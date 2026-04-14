from app.adapters.db.repository.api_key_repository import SQLAlchemyApiKeyRepository
from app.config import TIER_LIMITS
from app.enums import Tier


class RevokeExcessApiKeysUseCase:
    def execute(self, user_id: str, new_tier: Tier) -> int:
        repository = SQLAlchemyApiKeyRepository()
        new_limit = TIER_LIMITS[new_tier]["api_keys"]
        active_keys = repository.get_active_keys(user_id)

        if len(active_keys) <= new_limit:
            return 0

        # Sort by created_at descending — newest first
        sorted_keys = sorted(active_keys, key=lambda k: k.created_at, reverse=True)
        keys_to_revoke = sorted_keys[new_limit:]

        for key in keys_to_revoke:
            repository.revoke_key(key.id, user_id)

        return len(keys_to_revoke)
