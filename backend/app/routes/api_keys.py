from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.adapters.db.repository.api_key_repository import SQLAlchemyApiKeyRepository
from app.use_cases.generate_api_key import GenerateApiKeyUseCase
from app.use_cases.get_api_keys import GetApiKeysUseCase
from app.use_cases.revoke_api_key import RevokeApiKeyUseCase
from app.use_cases.get_or_create_profile import GetOrCreateProfileUseCase

api_keys_blueprint = Blueprint("api_keys", __name__, url_prefix="/api-keys")


@api_keys_blueprint.route("/", methods=["GET"])
@jwt_required()
def get_api_keys():
    user_id = get_jwt_identity()
    repository = SQLAlchemyApiKeyRepository()
    keys = GetApiKeysUseCase(repository).execute(user_id)
    return jsonify(keys)


@api_keys_blueprint.route("/", methods=["POST"])
@jwt_required()
def generate_api_key():
    user_id = get_jwt_identity()
    body = request.get_json()
    name = body.get("name", "").strip()

    if not name:
        return jsonify({"error": "Key name is required"}), 400

    repository = SQLAlchemyApiKeyRepository()
    profile = GetOrCreateProfileUseCase().execute(user_id)

    try:
        result = GenerateApiKeyUseCase(repository).execute(
            user_id=user_id,
            name=name,
            profile=profile,
        )
        return jsonify(result), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 403


@api_keys_blueprint.route("/<int:key_id>", methods=["DELETE"])
@jwt_required()
def revoke_api_key(key_id: int):
    user_id = get_jwt_identity()
    repository = SQLAlchemyApiKeyRepository()

    try:
        RevokeApiKeyUseCase(repository).execute(
            key_id=key_id,
            user_id=user_id,
        )
        return jsonify({"message": "API key revoked successfully"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
