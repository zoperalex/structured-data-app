import hashlib
from datetime import datetime, timezone

from app.adapters.db.repository.api_key_repository import SQLAlchemyApiKeyRepository
from app.adapters.db.session import db


def resolve_api_key(raw_key: str) -> str | None:
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    repository = SQLAlchemyApiKeyRepository()
    api_key = repository.get_key_by_hash(key_hash)

    if not api_key:
        return None

    api_key.last_used_at = datetime.now(timezone.utc)
    db.session.commit()

    return api_key.user_id
