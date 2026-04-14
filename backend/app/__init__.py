from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timezone, timedelta

from app.models.rate_limit import RateLimitRequest
from app.adapters.db.session import db
from app.routes.extract import extract_blueprint
from app.routes.auth import auth_blueprint
from app.routes.schemas import schemas_blueprint
from app.routes.api_keys import api_keys_blueprint
from app.routes.billing import billing_blueprint
from app.config import Config
import requests


def get_supabase_public_key():
    jwks_url = Config.get_env_variable("SUPABASE_JWKS_URL")
    jwks = requests.get(jwks_url).json()
    from jwt.algorithms import ECAlgorithm

    return ECAlgorithm.from_jwk(jwks["keys"][0])


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(
        app,
        origins=[
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "https://jsonextract.com",
            "https://www.jsonextract.com",
        ],
    )

    app.config["SQLALCHEMY_DATABASE_URI"] = Config.get_env_variable("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_PUBLIC_KEY"] = get_supabase_public_key()
    app.config["JWT_ALGORITHM"] = "ES256"
    app.config["JWT_IDENTITY_CLAIM"] = "sub"

    db.init_app(app)
    JWTManager(app)

    app.register_blueprint(extract_blueprint)
    app.register_blueprint(auth_blueprint)
    app.register_blueprint(schemas_blueprint)
    app.register_blueprint(api_keys_blueprint)
    app.register_blueprint(billing_blueprint)

    scheduler = BackgroundScheduler()
    scheduler.add_job(
        func=cleanup_rate_limit_records,
        trigger="interval",
        hours=24,
        args=[app],
    )
    scheduler.start()

    return app


def cleanup_rate_limit_records(app):
    with app.app_context():
        cutoff = datetime.now(timezone.utc) - timedelta(hours=1)
        RateLimitRequest.query.filter(RateLimitRequest.requested_at < cutoff).delete()
        db.session.commit()
