from datetime import datetime, timezone
from app.adapters.db.session import db


class SavedSchema(db.Model):
    __tablename__ = "saved_schemas"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, nullable=False, index=True)
    name = db.Column(db.String(100), nullable=False)
    fields = db.Column(db.JSON, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    deactivated_at = db.Column(db.DateTime, nullable=True)
