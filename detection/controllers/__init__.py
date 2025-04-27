from flask import Blueprint
from flask_restful import Api

bp = Blueprint("detection_api", __name__, url_prefix="/v1")
api = Api(bp)

# Import controllers
from .camera_detection_controller import CameraDetectionController
