from app.config import TIER_LIMITS
from app.models.profile import Profile
from app.ports.schema_repository import SchemaRepository
from app.schemas.extract import SchemaField


class SaveSchemaUseCase:
    def __init__(self, repository: SchemaRepository) -> None:
        self._repository = repository

    def execute(
        self, user_id: str, name: str, fields: list[SchemaField], profile: Profile
    ) -> dict:
        limit = TIER_LIMITS[profile.tier]["saved_schemas"]
        current_count = self._repository.get_active_schema_count(user_id)

        if current_count >= limit:
            raise ValueError(
                f"Schema limit reached for your tier ({limit} schema{'s' if limit != 1 else ''} max)"
            )

        schema = self._repository.save_schema(user_id, name, fields)

        return {
            "id": schema.id,
            "name": schema.name,
            "fields": schema.fields,
            "created_at": schema.created_at.isoformat(),
        }
