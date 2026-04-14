from app.ports.api_key_repository import ApiKeyRepository


class RevokeApiKeyUseCase:
    def __init__(self, repository: ApiKeyRepository) -> None:
        self._repository = repository

    def execute(self, key_id: int, user_id: str) -> None:
        self._repository.revoke_key(key_id=key_id, user_id=user_id)
