from datetime import datetime, timezone
from app.adapters.db.session import db


class RateLimitRequest(db.Model):
    __tablename__ = "rate_limit_requests"

    id = db.Column(db.Integer, primary_key=True)
    identifier = db.Column(db.String, nullable=False, index=True)
    requested_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
