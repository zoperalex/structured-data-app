from flask import Blueprint, jsonify, request
from pydantic import ValidationError

from app.adapters.gemini_structured_data_extractor import GeminiStructuredDataExtractor
from app.schemas.extract import ExtractRequest
from app.use_cases.extract_structured_data import ExtractStructuredDataUseCase

extract_blueprint = Blueprint("extract", __name__)


@extract_blueprint.post("/api/extract")
def extract_data():
    try:
        payload = ExtractRequest.model_validate(request.get_json())

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
