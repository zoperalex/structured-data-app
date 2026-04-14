from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from pydantic import ValidationError

from app.adapters.gemini_structured_data_extractor import GeminiStructuredDataExtractor
from app.models.schema import SavedSchema
from app.schemas.extract import ExtractRequest, SchemaField
from app.services.rate_limiter import check_rate_limit
from app.services.api_key_auth import resolve_api_key
from app.use_cases.extract_structured_data import ExtractStructuredDataUseCase

extract_blueprint = Blueprint("extract", __name__)


@extract_blueprint.post("/api/extract")
@jwt_required(optional=True)
def extract_data():
    user_id = get_jwt_identity()
    is_api_key_request = False

    if not user_id:
        raw_key = request.headers.get("X-API-Key")
        if raw_key:
            user_id = resolve_api_key(raw_key)
            if not user_id:
                return jsonify({"error": "Invalid API key"}), 401
            is_api_key_request = True

    allowed, limit = check_rate_limit(user_id)
    if not allowed:
        tier = "unauthenticated"
        if user_id:
            from app.models.profile import Profile

            profile = Profile.query.filter_by(user_id=user_id).first()
            tier = profile.tier.value if profile else "free"

        tier_label = tier.capitalize()
        tier_suffix = (
            "when not logged in."
            if tier == "unauthenticated"
            else f"in the {tier_label} tier."
        )

        return (
            jsonify(
                {
                    "error": f"Rate limit exceeded. You are allowed {limit} requests per hour {tier_suffix}",
                }
            ),
            429,
        )

    try:
        payload = ExtractRequest.model_validate(request.get_json())

        if is_api_key_request and payload.mode == "user_defined":
            if not payload.schema_id:
                return (
                    jsonify(
                        {
                            "error": "API key requests must use schema_id instead of inline schema fields."
                        }
                    ),
                    400,
                )

            saved_schema = SavedSchema.query.filter_by(
                id=payload.schema_id,
                user_id=user_id,
                is_active=True,
            ).first()

            if not saved_schema:
                return (
                    jsonify(
                        {
                            "error": f"Schema {payload.schema_id} not found or not owned by your account."
                        }
                    ),
                    404,
                )

            payload.schema = [SchemaField(**f) for f in saved_schema.fields]

        extractor = GeminiStructuredDataExtractor()
        use_case = ExtractStructuredDataUseCase(extractor)

        response_model = use_case.execute(
            mode=payload.mode,
            text=payload.text,
            preset=payload.preset,
            schema=payload.schema,
        )

        return jsonify(response_model.model_dump())
    except ValidationError as exc:
        return (
            jsonify(
                {
                    "error": "Invalid request body",
                    "details": exc.errors(),
                }
            ),
            400,
        )
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 500
    except Exception:
        return jsonify({"error": "Unexpected server error"}), 500
