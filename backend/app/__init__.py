from flask import Flask
from flask_cors import CORS

from app.routes.extract import extract_blueprint


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

    app.register_blueprint(extract_blueprint)
    return app
