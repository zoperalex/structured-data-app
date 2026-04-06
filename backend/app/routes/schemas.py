from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.adapters.db.repository.schema_repository import SQLAlchemySchemaRepository
from app.schemas.extract import SchemaField
from app.use_cases.delete_schema import DeleteSchemaUseCase
from app.use_cases.get_or_create_profile import GetOrCreateProfileUseCase
from app.use_cases.get_schemas import GetSchemasUseCase
from app.use_cases.save_schema import SaveSchemaUseCase

schemas_blueprint = Blueprint("schemas", __name__, url_prefix="/schemas")


@schemas_blueprint.route("/", methods=["GET"])
@jwt_required()
def get_schemas():
    user_id = get_jwt_identity()
    repository = SQLAlchemySchemaRepository()
    schemas = GetSchemasUseCase(repository).execute(user_id)
    return jsonify(schemas)


@schemas_blueprint.route("/", methods=["POST"])
@jwt_required()
def save_schema():
    user_id = get_jwt_identity()
    body = request.get_json()

    name = body.get("name")
    raw_fields = body.get("fields")

    if not name or not raw_fields:
        return jsonify({"error": "name and fields are required"}), 400

    try:
        fields = [SchemaField(**f) for f in raw_fields]
    except Exception:
        return jsonify({"error": "Invalid fields format"}), 400

    repository = SQLAlchemySchemaRepository()
    profile = GetOrCreateProfileUseCase().execute(user_id)

    try:
        schema = SaveSchemaUseCase(repository).execute(
            user_id=user_id,
            name=name,
            fields=fields,
            profile=profile,
        )
        return jsonify(schema), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 403


@schemas_blueprint.route("/<int:schema_id>", methods=["DELETE"])
@jwt_required()
def delete_schema(schema_id: int):
    user_id = get_jwt_identity()
    repository = SQLAlchemySchemaRepository()

    try:
        DeleteSchemaUseCase(repository).execute(
            user_id=user_id,
            schema_id=schema_id,
        )
        return jsonify({"message": "Schema deactivated successfully"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
