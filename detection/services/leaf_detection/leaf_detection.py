# Import the InferencePipeline object
from inference import InferencePipeline
import cv2
import numpy as np
import time
import threading
from collections import Counter

class LeafDetection:
    def __init__(self):
        self.pipeline = None
        # initialize a pipeline object
        self.pipeline = InferencePipeline.init_with_workflow(
            api_key="vuyzT1aTtmr7W4qVr8oJ",
            workspace_name="an-7bkyw",
            workflow_id="custom-workflow",
            video_reference=0,
            max_fps=30,
            on_prediction=self.my_sink
        )
        
        self.detection_results = []
        self.running = False
        self.start_time = 0
        self.duration = 0
        self.detection_complete = threading.Event()
        
    def reset_detection(self):
        """Reset the previous detection"""
        self.detection_results = []
        self.running = False
        self.start_time = 0
        self.duration = 0
        self.detection_complete.clear()

    def my_sink(self, result, video_frame):
        """Process each detected frame"""
        if not self.running and self.duration > 0:
            return
            
        if video_frame is not None:
            try:
                # Get the image frame
                if hasattr(video_frame, 'image'):
                    frame = video_frame.image
                elif hasattr(video_frame, 'numpy'):
                    frame = video_frame.numpy()
                else:
                    print("Cannot get frame")
                    return
                
                current_detections = []
                    
                # Process the prediction results
                if 'predictions' in result:
                    predictions = result['predictions']
                    if hasattr(predictions, 'xyxy') and len(predictions.xyxy) > 0:
                        for i, box in enumerate(predictions.xyxy):
                            x1, y1, x2, y2 = box
                            
                            class_name = "unknown"
                            confidence = 0.0
                            
                            if hasattr(predictions, 'data') and 'class_name' in predictions.data:
                                try:
                                    class_name = predictions.data['class_name'][i]
                                except:
                                    pass
                            
                            if hasattr(predictions, 'confidence') and i < len(predictions.confidence):
                                try:
                                    confidence = float(predictions.confidence[i])
                                except:
                                    pass
                            
                            # Bounding box
                            cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
                            cv2.putText(frame, f"{class_name} {confidence:.2f}", (int(x1), int(y1)-10), 
                                        cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
                            
                            current_detections.append({
                                'class': class_name,
                                'confidence': confidence,
                                'box': [float(x1), float(y1), float(x2), float(y2)]
                            })

                # Store the detection results
                if current_detections:
                    self.detection_results.append(current_detections)
                
                if self.duration > 0:
                    elapsed_time = time.time() - self.start_time
                    remaining_time = max(0, self.duration - elapsed_time)
                    
                    cv2.putText(frame, f"Time left: {int(remaining_time)}s", (10, 30), 
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                    
                    if elapsed_time >= self.duration:
                        self.running = False
                        self.detection_complete.set()
                        if hasattr(self.pipeline, 'stop'):
                            self.pipeline.stop()
                        elif hasattr(self.pipeline, '_stop'):
                            self.pipeline._stop()
                
                # Display the frame
                cv2.imshow("Leaf Detection", frame)
                
                key = cv2.waitKey(1)
                if key == ord('q'):
                    if hasattr(self.pipeline, 'stop'):
                        self.pipeline.stop()
                    elif hasattr(self.pipeline, '_stop'):
                        self.pipeline._stop()
                    else:
                        print("Cannot find the pipeline stop method")

            except Exception as e:
                print(f"Error processing frame: {e}")
        
        # Debug output
        if 'predictions' in result and hasattr(result['predictions'], 'confidence'):
            print(f"Detections: {len(result['predictions'].confidence)}, " 
                  f"Confidence: {result['predictions'].confidence}")

    def start(self):
        """Legacy method to run continuous detection"""
        try:
            self.running = True
            self.duration = 0
            
            self.pipeline.start()
            
            if hasattr(self.pipeline, 'join'):
                self.pipeline.join()
        except KeyboardInterrupt:
            self.stop()
        except Exception as e:
            print(f"Error running: {e}")
        finally:
            self.stop()

    def start_detection(self, duration=10):
        """Detect in a certain time (in seconds)"""
        if self.running:
            return False
            
        # Reset the previous results
        self.reset_detection()
        
        # Set the running time
        self.duration = duration
        self.start_time = time.time()
        self.running = True
        
        try:
            thread = threading.Thread(target=self.pipeline.start)
            thread.daemon = True
            thread.start()
            
            self.detection_complete.wait(timeout=duration + 5)
            
            self.stop()
            
            return True
        except Exception as e:
            print(f"Error detecting: {e}")
            self.stop()
            return False
     
    def stop(self):
        """Stop detection"""
        self.running = False
        
        if self.pipeline:
            try:
                if hasattr(self.pipeline, 'stop'):
                    self.pipeline.stop()
                elif hasattr(self.pipeline, '_stop'):
                    self.pipeline._stop()
            except Exception as e:
                print(f"Error stopping pipeline: {e}")
        
        cv2.destroyAllWindows()
     
    def get_detection_summary(self):
        """Get the summary of the entire detection process"""
        if not self.detection_results:
            return {
                "status": "no_detection",
                "message": "No objects were detected",
                "counts": {},
                "classes": [],
                "total_objects": 0
            }
        
        all_classes = []
        confidence_scores = []
        health_status = {
            "Healthy": 0, 
            "Diseased": 0, 
            "unknown": 0,
            "Bacterial Spot": 0,
            "Early Blight": 0,
            "Late Blight": 0,
            "Leaf Mold": 0,
            "Leaf Miner": 0,
            "Mosaic Virus": 0,
            "Septoria": 0,
            "Spider Mites": 0,
            "Yellow Leaf Curl Virus": 0,
            "Plant Health": 0
        }
        
        for frame_result in self.detection_results:
            for detection in frame_result:
                class_name = detection.get('class', 'unknown')
                confidence = detection.get('confidence', 0.0)
                
                if confidence > 0.3:
                    all_classes.append(class_name)
                    confidence_scores.append(confidence)

                    if class_name == 'Healthy':
                        health_status["Healthy"] += 1
                    elif class_name == 'Bacterial Spot':
                        health_status["Bacterial Spot"] += 1
                    elif class_name == 'Early Blight':
                        health_status["Early Blight"] += 1
                    elif class_name == 'Late Blight':
                        health_status["Late Blight"] += 1
                    elif class_name == 'Leaf Mold':
                        health_status["Leaf Mold"] += 1
                    elif class_name == 'Leaf_Miner':
                        health_status["Leaf Miner"] += 1
                    elif class_name == 'Mosaic Virus':
                        health_status["Mosaic Virus"] += 1
                    elif class_name == 'Septoria':
                        health_status["Septoria"] += 1
                    elif class_name == 'Spider Mites':
                        health_status["Spider Mites"] += 1
                    elif class_name == 'Yellow Leaf Curl Virus':
                        health_status["Yellow Leaf Curl Virus"] += 1
                    elif class_name == 'plant-health':
                        health_status["Plant Health"] += 1
                    else:
                        health_status["unknown"] += 1
        
        class_counts = Counter(all_classes)
        
        total_detections = len(all_classes)
        avg_confidence = sum(confidence_scores) / len(confidence_scores) if confidence_scores else 0
        
        result = {
            "status": "success",
            "classes": list(class_counts.keys()),
            "counts": dict(class_counts),
            "health_status": health_status,
            "total_objects": total_detections,
            "frames_with_detections": len(self.detection_results),
            "average_confidence": round(avg_confidence, 3),
            "max_confidence": round(max(confidence_scores), 3) if confidence_scores else 0,
            "min_confidence": round(min(confidence_scores), 3) if confidence_scores else 0
        }
        
        healthy_count = health_status["Healthy"]
        # Calculate total diseased count from all disease types
        diseased_count = sum(count for key, count in health_status.items() 
                           if key not in ["Healthy", "unknown", "Plant Health"])
        
        total_labeled = healthy_count + diseased_count
        if total_labeled > 0:
            healthy_ratio = healthy_count / total_labeled * 100
            result["healthy_ratio"] = round(healthy_ratio, 1)
            
            # Conclusion
            if healthy_ratio >= 80:
                result["health_level"] = "Excellent"
                result["message"] = f"Healthy plant ({healthy_count}/{total_labeled} leaves, {healthy_ratio:.1f}%)"
            elif healthy_ratio >= 60:
                result["health_level"] = "Good"
                result["message"] = f"Relatively healthy plant ({healthy_count}/{total_labeled} leaves, {healthy_ratio:.1f}%)"
            elif healthy_ratio >= 40:
                result["health_level"] = "Fair"
                result["message"] = f"Plant shows signs of disease ({diseased_count}/{total_labeled} leaves, {(100-healthy_ratio):.1f}%)"
            elif healthy_ratio >= 20:
                result["health_level"] = "Poor"
                result["message"] = f"Plant shows significant disease ({diseased_count}/{total_labeled} leaves, {(100-healthy_ratio):.1f}%)"
            else:
                result["health_level"] = "Critical"
                result["message"] = f"Plant shows severe disease ({diseased_count}/{total_labeled} leaves, {(100-healthy_ratio):.1f}%)"
        else:
            result["message"] = f"Detected {total_detections} objects, but unable to determine health status"
            
        return result