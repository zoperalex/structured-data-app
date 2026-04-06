from typing import Protocol
from app.models.schema import SavedSchema
from app.schemas.extract import SchemaField


class SchemaRepository(Protocol):
    def get_active_schemas(self, user_id: str) -> list[SavedSchema]: ...

    def get_active_schema_count(self, user_id: str) -> int: ...

    def save_schema(
        self, user_id: str, name: str, fields: list[SchemaField]
    ) -> SavedSchema: ...

    def deactivate_schema(self, schema_id: int, user_id: str) -> None: ...
