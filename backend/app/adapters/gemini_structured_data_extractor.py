import os
from google import genai
from google.genai import types
from typing import Type, TypeVar
from pydantic import BaseModel

from app.schemas.extract import (
    TransactionExtractionResult,
    TaskListExtractionResult,
    ContactInfoExtractionResult,
)
from app.config import Config

T = TypeVar("T", bound=BaseModel)


class GeminiStructuredDataExtractor:
    def __init__(self) -> None:
        self._client = genai.Client(api_key=Config.gemini_api_key())
        self._model = "gemini-2.5-flash"

    def _generate(self, prompt: str, response_schema: Type[T]) -> T:
        response = self._client.models.generate_content(
            model=self._model,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=response_schema,
            ),
        )

        parsed = response.parsed

        if parsed is None:
            raise ValueError(
                f"Gemini returned no parsed result for schema {response_schema.__name__}"
            )

        return parsed

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

        return self._generate(prompt, TransactionExtractionResult)

    def extract_task_list(self, text: str) -> TaskListExtractionResult:
        prompt = f"""
Extract tasks from the user's text.

Return data that matches the provided schema.
Only include tasks that are explicitly present in the text.

Use:
- task: a short description of the task
- assignee: the person responsible for the task if mentioned, otherwise null
- due_date: any mentioned deadline or date in string, otherwise null
- status: short label describing the task state if clear. ONLY "Pending", "Not Started", "In Progress", "Completed". If not clear, assume "Pending".

Rules:
- Do NOT invent tasks
- Do NOT assume assignees or due dates if not mentioned
- Keep task descriptions concise

User text:
{text}
""".strip()

        return self._generate(prompt, TaskListExtractionResult)

    def extract_contact_info(self, text: str) -> ContactInfoExtractionResult:
        prompt = f"""
Extract contact information from the user's text.

Return data that matches the provided schema.
Only include contact information that is explicitly present in the text.

Use:
- name: full name of the person if available, otherwise null
- email: email address if available, otherwise null
- phone: phone number if available, otherwise null
- company: company name if mentioned, otherwise null

Rules:
- Do NOT invent any values
- Only extract clearly identifiable contact details
- Group related information into the same item when they belong to the same person
- If multiple people are mentioned, return multiple items

User text:
{text}
""".strip()

        return self._generate(prompt, ContactInfoExtractionResult)

    def extract_user_defined(
        self,
        text: str,
        schema_model: type[BaseModel],
    ) -> dict[str, Any]:
        prompt = f"""
Extract structured information from the user's text.

Return data that matches the provided schema exactly.
Only include fields that are present or can be inferred with high confidence.
Do not add extra keys.
If a value cannot be determined confidently, provide your best structured attempt that still matches the schema.

User text:
{text}
""".strip()

        parsed = self._generate(prompt, schema_model)
        return parsed.model_dump()
