from app.ports.schema_repository import SchemaRepository


class DeleteSchemaUseCase:
    def __init__(self, repository: SchemaRepository) -> None:
        self._repository = repository

    def execute(self, user_id: str, schema_id: int) -> None:
        self._repository.deactivate_schema(schema_id=schema_id, user_id=user_id)
