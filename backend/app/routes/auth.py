from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.use_cases.get_or_create_profile import GetOrCreateProfileUseCase

auth_blueprint = Blueprint("auth", __name__, url_prefix="/auth")


@auth_blueprint.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    profile = GetOrCreateProfileUseCase().execute(user_id)

    return jsonify(
        {
            "user_id": profile.user_id,
            "username": profile.username,
            "tier": profile.tier.value,
            "created_at": profile.created_at.isoformat(),
        }
    )
