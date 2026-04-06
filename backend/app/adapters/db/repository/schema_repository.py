from datetime import datetime, timezone

from sqlalchemy.exc import SQLAlchemyError

from app.adapters.db.session import db
from app.models.schema import SavedSchema
from app.schemas.extract import SchemaField


class SQLAlchemySchemaRepository:
    def get_active_schemas(self, user_id: str) -> list[SavedSchema]:
        return SavedSchema.query.filter_by(user_id=user_id, is_active=True).all()

    def get_active_schema_count(self, user_id: str) -> int:
        return SavedSchema.query.filter_by(user_id=user_id, is_active=True).count()

    def save_schema(
        self, user_id: str, name: str, fields: list[SchemaField]
    ) -> SavedSchema:
        schema = SavedSchema(
            user_id=user_id,
            name=name,
            fields=[field.model_dump() for field in fields],
        )
        db.session.add(schema)
        db.session.commit()
        return schema

    def deactivate_schema(self, schema_id: int, user_id: str) -> None:
        schema = SavedSchema.query.filter_by(
            id=schema_id, user_id=user_id, is_active=True
        ).first()
        if not schema:
            raise ValueError(f"Schema {schema_id} not found or not owned by user")

        schema.is_active = False
        schema.deactivated_at = datetime.now(timezone.utc)
        db.session.commit()
