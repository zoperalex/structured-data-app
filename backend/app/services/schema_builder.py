from __future__ import annotations

from typing import Any

from pydantic import BaseModel, create_model

from app.schemas.extract import SchemaField


def _python_type_for_field(field: SchemaField) -> Any:
    if field.type == "string":
        return str
    if field.type == "int":
        return int
    if field.type == "float":
        return float
    if field.type == "boolean":
        return bool
    if field.type == "object":
        return build_dynamic_model(
            model_name=_safe_model_name(field.name or "NestedObject"),
            fields=field.children,
        )

    raise ValueError(f"Unsupported field type: {field.type}")


def _safe_model_name(name: str) -> str:
    cleaned = "".join(char if char.isalnum() else "_" for char in name.strip())
    return cleaned or "DynamicModel"


def build_dynamic_model(model_name: str, fields: list[SchemaField]) -> type[BaseModel]:
    model_fields: dict[str, tuple[Any, Any]] = {}

    for field in fields:
        field_name = field.name.strip()

        if not field_name:
            continue

        python_type = _python_type_for_field(field)
        model_fields[field_name] = (python_type, ...)

    return create_model(_safe_model_name(model_name), **model_fields)
