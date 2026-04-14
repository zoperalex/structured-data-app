from app.ports.api_key_repository import ApiKeyRepository


class GetApiKeysUseCase:
    def __init__(self, repository: ApiKeyRepository) -> None:
        self._repository = repository

    def execute(self, user_id: str) -> list[dict]:
        keys = self._repository.get_active_keys(user_id)
        return [
            {
                "id": key.id,
                "name": key.name,
                "key_prefix": key.key_prefix,
                "created_at": key.created_at.isoformat(),
                "last_used_at": (
                    key.last_used_at.isoformat() if key.last_used_at else None
                ),
            }
            for key in keys
        ]
