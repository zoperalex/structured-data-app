from typing import Protocol

from app.schemas.extract import TransactionExtractionResult


class StructuredDataExtractor(Protocol):
    def extract_expense_note(self, text: str) -> TransactionExtractionResult: ...
