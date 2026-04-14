from datetime import datetime, timezone, timedelta

from flask import request as flask_request

from app.adapters.db.session import db
from app.config import TIER_LIMITS
from app.enums import Tier
from app.models.rate_limit import RateLimitRequest
from app.models.profile import Profile


def get_identifier(user_id: str | None) -> str:
    if user_id:
        return f"user:{user_id}"
    ip = flask_request.headers.get("X-Forwarded-For", flask_request.remote_addr)
    return f"ip:{ip}"


def get_limit(user_id: str | None) -> int:
    if not user_id:
        return TIER_LIMITS["unauthenticated"]["requests_per_hour"]

    profile = Profile.query.filter_by(user_id=user_id).first()
    tier = profile.tier if profile else Tier.FREE
    return TIER_LIMITS[tier]["requests_per_hour"]


def check_rate_limit(user_id: str | None) -> tuple[bool, int]:
    identifier = get_identifier(user_id)
    limit = get_limit(user_id)
    window_start = datetime.now(timezone.utc) - timedelta(hours=1)

    count = RateLimitRequest.query.filter(
        RateLimitRequest.identifier == identifier,
        RateLimitRequest.requested_at >= window_start,
    ).count()

    if count >= limit:
        return False, limit

    db.session.add(RateLimitRequest(identifier=identifier))
    db.session.commit()
    return True, limit
