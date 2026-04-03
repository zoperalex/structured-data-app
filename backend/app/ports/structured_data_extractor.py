from typing import Protocol

from app.schemas.extract import (
    TransactionExtractionResult,
    TaskListExtractionResult,
    ContactInfoExtractionResult,
)


class StructuredDataExtractor(Protocol):
    def extract_expense_note(self, text: str) -> TransactionExtractionResult: ...

    def extract_task_list(self, text: str) -> TaskListExtractionResult: ...

    def extract_contact_info(self, text: str) -> ContactInfoExtractionResult: ...

    def extract_user_defined(
        self,
        text: str,
        schema_model: type[BaseModel],
    ) -> dict[str, Any]: ...
