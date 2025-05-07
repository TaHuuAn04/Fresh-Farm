import { HttpMethod } from '@common/enums';
import { BASE_URL_DETECTION } from '@environments';
import { HttpFetchDto } from 'src/http';

export class DetectionResponseDto {
  status: string;
  duration: number;
  detection_results: {
    status: string;
    classes: string[];
    counts: {
      [key: string]: number;
    };
    health_status: {
      [key: string]: number;
    };
    total_objects: number;
    frames_with_detections: number;
    average_confidence: number;
    max_confidence: number;
    min_confidence: number;
    message: string;
  };
}

export class PostDetectionDto extends HttpFetchDto {
  public static url = BASE_URL_DETECTION + '/v1/timed-detection';
  public method = HttpMethod.POST;
  public url = PostDetectionDto.url;
  public paramsDto = undefined;
  public bodyDto = { duration: 0 };
  public responseDto = undefined;

  constructor(public queryDto: { duration: number }) {
    super();
    this.bodyDto = { duration: queryDto.duration };
  }
}
