import secrets
import hashlib

from app.config import TIER_LIMITS
from app.models.profile import Profile
from app.ports.api_key_repository import ApiKeyRepository


class GenerateApiKeyUseCase:
    def __init__(self, repository: ApiKeyRepository) -> None:
        self._repository = repository

    def execute(self, user_id: str, name: str, profile: Profile) -> dict:
        limit = TIER_LIMITS[profile.tier]["api_keys"]

        if limit == 0:
            raise ValueError("Your tier does not support API keys. Please upgrade.")

        current_count = self._repository.get_active_key_count(user_id)
        if current_count >= limit:
            raise ValueError(
                f"API key limit reached for your tier ({limit} key{'s' if limit != 1 else ''} max)"
            )

        raw_key = "sde_" + secrets.token_urlsafe(32)
        key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
        key_prefix = raw_key[:8]

        self._repository.create_key(
            user_id=user_id,
            name=name,
            key_hash=key_hash,
            key_prefix=key_prefix,
        )

        return {
            "raw_key": raw_key,
            "key_prefix": key_prefix,
            "name": name,
        }
