import os
from google import genai
from google.genai import types

from app.schemas.extract import TransactionExtractionResult
from app.config import Config


class GeminiStructuredDataExtractor:
    def __init__(self) -> None:
        self._client = genai.Client(api_key=Config.gemini_api_key())

    def extract_expense_note(self, text: str) -> TransactionExtractionResult:
        prompt = f"""
Extract expense information from the user's text.

Return data that matches the provided schema.
Only include expenses that are actually present in the text.
Use:
- type: short label like "rent" or "electricity"
- amount: numeric value greater than or equal to  0
- currency: currency code if clear, otherwise best effort. Needs to be 3 characters. If no currency is mentioned, assume N/A.
- status: "Paid", "Pending" or "Overdue" ONLY. If not clear, assume "Pending".

User text:
{text}
""".strip()

        response = self._client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=TransactionExtractionResult,
            ),
        )

        parsed = response.parsed
        if parsed is None:
            raise ValueError("Gemini returned no parsed structured result")

        return parsed
