from llm.gemini_client import GeminiClient
from schemas import ExtractResponse


class ExtractionService:
    def __init__(self, gemini_client: GeminiClient) -> None:
        self._gemini_client = gemini_client

    def extract(self, text: str) -> ExtractResponse:
        extraction_result = self._gemini_client.extract_expense_note(text)

        return ExtractResponse(
            mode="preset",
            input_text=text,
            result=extraction_result,
        )
