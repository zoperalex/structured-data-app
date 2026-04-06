from app.ports.schema_repository import SchemaRepository


class GetSchemasUseCase:
    def __init__(self, repository: SchemaRepository) -> None:
        self._repository = repository

    def execute(self, user_id: str) -> list[dict]:
        schemas = self._repository.get_active_schemas(user_id)

        return [
            {
                "id": schema.id,
                "name": schema.name,
                "fields": schema.fields,
                "created_at": schema.created_at.isoformat(),
            }
            for schema in schemas
        ]
