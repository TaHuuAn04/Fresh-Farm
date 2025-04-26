from flask import Flask
from controllers import bp as api_bp

def create_app():
    app = Flask(__name__)

    app.register_blueprint(api_bp)
    return app

def create_migrations_app():
    app = Flask(__name__)
    return app