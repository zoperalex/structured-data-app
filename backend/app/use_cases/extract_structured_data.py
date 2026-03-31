from app.ports.structured_data_extractor import StructuredDataExtractor
from app.schemas.extract import ExtractResponse


class ExtractStructuredDataUseCase:
    def __init__(self, extractor: StructuredDataExtractor) -> None:
        self._extractor = extractor

    def execute(self, text: str) -> ExtractResponse:
        result = self._extractor.extract_expense_note(text)

        return ExtractResponse(
            mode="preset",
            input_text=text,
            result=result,
        )
