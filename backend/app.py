from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from pydantic import ValidationError

from llm.gemini_client import GeminiClient
from schemas import ExtractRequest
from services.extraction_service import ExtractionService

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

gemini_client = GeminiClient()
extraction_service = ExtractionService(gemini_client)


@app.post("/api/extract")
def extract_data():
    try:
        payload = ExtractRequest.model_validate(request.get_json())
        response_model = extraction_service.extract(payload.text)
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


if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
