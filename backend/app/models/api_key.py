from datetime import datetime, timezone
from app.adapters.db.session import db


class ApiKey(db.Model):
    __tablename__ = "api_keys"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, nullable=False, index=True)
    name = db.Column(db.String(100), nullable=False)
    key_hash = db.Column(db.String, nullable=False, unique=True)
    key_prefix = db.Column(db.String(8), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    last_used_at = db.Column(db.DateTime, nullable=True)
