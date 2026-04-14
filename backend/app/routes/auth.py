from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.adapters.db.session import db
from app.use_cases.get_or_create_profile import GetOrCreateProfileUseCase

from datetime import datetime, timezone, timedelta
from app.models.rate_limit import RateLimitRequest

auth_blueprint = Blueprint("auth", __name__, url_prefix="/auth")


@auth_blueprint.route("/usage", methods=["GET"])
@jwt_required()
def get_usage():
    user_id = get_jwt_identity()
    profile = GetOrCreateProfileUseCase().execute(user_id)

    now = datetime.now(timezone.utc)
    hour_ago = now - timedelta(hours=1)
    day_ago = now - timedelta(days=1)

    identifier = f"user:{user_id}"

    requests_this_hour = RateLimitRequest.query.filter(
        RateLimitRequest.identifier == identifier,
        RateLimitRequest.requested_at >= hour_ago,
    ).count()

    requests_today = RateLimitRequest.query.filter(
        RateLimitRequest.identifier == identifier,
        RateLimitRequest.requested_at >= day_ago,
    ).count()

    from app.config import TIER_LIMITS

    limit = TIER_LIMITS[profile.tier]["requests_per_hour"]

    return jsonify(
        {
            "requests_this_hour": requests_this_hour,
            "requests_today": requests_today,
            "limit_per_hour": limit,
        }
    )


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


@auth_blueprint.route("/me", methods=["PATCH"])
@jwt_required()
def update_me():
    user_id = get_jwt_identity()
    body = request.get_json()
    username = body.get("username", "").strip()

    if not username:
        return jsonify({"error": "Username is required"}), 400

    if len(username) > 50:
        return jsonify({"error": "Username must be 50 characters or less"}), 400

    profile = GetOrCreateProfileUseCase().execute(user_id)
    profile.username = username
    db.session.commit()

    return jsonify(
        {
            "user_id": profile.user_id,
            "username": profile.username,
            "tier": profile.tier.value,
            "created_at": profile.created_at.isoformat(),
        }
    )
