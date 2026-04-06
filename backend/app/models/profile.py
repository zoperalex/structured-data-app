from datetime import datetime, timezone
from app.adapters.db.session import db
from app.enums import Tier


class Profile(db.Model):
    __tablename__ = "profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, unique=True, nullable=False)
    username = db.Column(db.String(50), nullable=True)
    tier = db.Column(db.Enum(Tier), default=Tier.FREE, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
