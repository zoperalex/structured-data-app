from datetime import datetime, timezone
from app.adapters.db.session import db
from app.models.api_key import ApiKey


class SQLAlchemyApiKeyRepository:
    def get_active_keys(self, user_id: str) -> list[ApiKey]:
        return ApiKey.query.filter_by(user_id=user_id, is_active=True).all()

    def get_active_key_count(self, user_id: str) -> int:
        return ApiKey.query.filter_by(user_id=user_id, is_active=True).count()

    def create_key(
        self, user_id: str, name: str, key_hash: str, key_prefix: str
    ) -> ApiKey:
        api_key = ApiKey(
            user_id=user_id,
            name=name,
            key_hash=key_hash,
            key_prefix=key_prefix,
        )
        db.session.add(api_key)
        db.session.commit()
        return api_key

    def revoke_key(self, key_id: int, user_id: str) -> None:
        key = ApiKey.query.filter_by(id=key_id, user_id=user_id, is_active=True).first()
        if not key:
            raise ValueError(f"API key {key_id} not found or not owned by user")
        key.is_active = False
        db.session.commit()

    def get_key_by_hash(self, key_hash: str) -> ApiKey | None:
        return ApiKey.query.filter_by(key_hash=key_hash, is_active=True).first()
