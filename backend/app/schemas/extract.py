from typing import Any, Literal

from pydantic import BaseModel, Field


PresetName = Literal["expense_note", "task_list", "contact_info"]
ModeName = Literal["preset", "user_defined"]
FieldType = Literal["string", "int", "float", "boolean", "object"]


class SchemaField(BaseModel):
    id: str
    name: str
    type: FieldType
    children: list["SchemaField"] = Field(default_factory=list)


class ExtractRequest(BaseModel):
    mode: ModeName
    preset: PresetName | None = None
    schema: list[SchemaField] | None = None
    text: str


class TransactionItem(BaseModel):
    type: str
    amount: float = Field(..., ge=0)
    currency: str = Field(..., min_length=3, max_length=3)
    status: Literal["Paid", "Pending", "Overdue"]


class TransactionExtractionResult(BaseModel):
    category: Literal["expense_note"]
    items: list[TransactionItem]


class TaskItem(BaseModel):
    task: str
    assignee: str | None = None
    due_date: str | None = None
    status: str | None = None


class TaskListExtractionResult(BaseModel):
    category: Literal["task_list"]
    items: list[TaskItem]


class ContactInfoItem(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    company: str | None = None


class ContactInfoExtractionResult(BaseModel):
    category: Literal["contact_info"]
    items: list[ContactInfoItem]


PresetResult = (
    TransactionExtractionResult | TaskListExtractionResult | ContactInfoExtractionResult
)
UserDefinedResult = dict[str, Any]
ExtractResult = PresetResult | UserDefinedResult


class ExtractResponse(BaseModel):
    input_text: str | None = None
    mode: ModeName
    preset: PresetName | None = None
    result: ExtractResult
