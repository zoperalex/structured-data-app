from typing import Literal
from pydantic import BaseModel, Field


class ExtractRequest(BaseModel):
    text: str


class TransactionItem(BaseModel):
    type: str
    amount: float = Field(..., ge=0)
    currency: str = Field(..., min_length=3, max_length=3)
    status: Literal["Paid", "Pending", "Overdue"]


class TransactionExtractionResult(BaseModel):
    category: Literal["expense_note"]
    items: list[TransactionItem]


class ExtractResponse(BaseModel):
    mode: Literal["preset"]
    result: TransactionExtractionResult
    input_text: str | None = None
