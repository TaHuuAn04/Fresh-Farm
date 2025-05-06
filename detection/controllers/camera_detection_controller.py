from flask_restful import Resource, reqparse
from . import api
from services.leaf_detection.leaf_detection import LeafDetection
import threading
from flask import request

class CameraDetectionController(Resource):
    detector = None
    thread = None
    
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('duration', type=int, help='Duration in seconds')
    
    def get(self):
        return {"message": "API is ready. Use POST to start leaf detection, DELETE to stop.", "status": "ready"}
    
    def post(self):
        try:
            if CameraDetectionController.thread is not None and CameraDetectionController.thread.is_alive():
                return {"status": "warning", "message": "Leaf detection is already running"}, 200
                
            CameraDetectionController.detector = LeafDetection()
            CameraDetectionController.thread = threading.Thread(target=CameraDetectionController.detector.start)
            CameraDetectionController.thread.daemon = True
            CameraDetectionController.thread.start()
            return {"status": "success", "message": "Leaf detection started"}, 200
        except Exception as e:
            return {"status": "error", "message": str(e)}, 500
            
    def delete(self):
        try:
            if CameraDetectionController.detector is not None:
                CameraDetectionController.detector.stop()
                CameraDetectionController.detector = None
                CameraDetectionController.thread = None
                return {"status": "success", "message": "Leaf detection stopped"}, 200
            else:
                return {"status": "warning", "message": "Leaf detection is not running"}, 200
        except Exception as e:
            return {"status": "error", "message": str(e)}, 500


class TimedDetectionController(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('duration', type=int, required=True, 
                                help='Duration in seconds for detection',
                                location=['json', 'args', 'form'])
    
    def post(self):
        try:
            args = self.parser.parse_args()
            duration = args['duration']
            
            
            if duration <= 0:
                return {"status": "error", "message": "Duration must be a positive number"}, 400
                
            detector = LeafDetection()
            
            success = detector.start_detection(duration=duration)
            
            if not success:
                return {"status": "error", "message": "Failed to start detection"}, 500
            
            summary = detector.get_detection_summary()
            
            return {
                "status": "success",
                "duration": duration,
                "detection_results": summary
            }, 200
            
        except Exception as e:
            import traceback
            traceback_str = traceback.format_exc()
            print(f"Error in TimedDetectionController: {str(e)}")
            print(traceback_str)
            return {"status": "error", "message": str(e), "traceback": traceback_str}, 500


api.add_resource(CameraDetectionController, '/camera-detection')
api.add_resource(TimedDetectionController, '/timed-detection') 