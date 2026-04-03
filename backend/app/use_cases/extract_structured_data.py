from app.ports.structured_data_extractor import StructuredDataExtractor
from app.schemas.extract import ExtractResponse, ExtractResult, SchemaField
from app.services.schema_builder import build_dynamic_model


class ExtractStructuredDataUseCase:
    def __init__(self, extractor: StructuredDataExtractor) -> None:
        self._extractor = extractor

    def execute(
        self,
        mode: str,
        text: str,
        preset: str | None = None,
        schema: list[SchemaField] | None = None,
    ) -> ExtractResponse:
        result: ExtractResult

        if mode == "preset":
            if preset == "expense_note":
                result = self._extractor.extract_expense_note(text)
            elif preset == "task_list":
                result = self._extractor.extract_task_list(text)
            elif preset == "contact_info":
                result = self._extractor.extract_contact_info(text)
            else:
                raise ValueError("Preset mode requires a valid preset")

            return ExtractResponse(
                input_text=text,
                mode="preset",
                preset=preset,
                result=result,
            )

        if mode == "user_defined":
            if not schema:
                raise ValueError("User-defined mode requires a schema")

            dynamic_model = build_dynamic_model(
                model_name="UserDefinedExtractionResult",
                fields=schema,
            )

            result = self._extractor.extract_user_defined(
                text=text,
                schema_model=dynamic_model,
            )

            return ExtractResponse(
                input_text=text,
                mode="user_defined",
                preset=None,
                result=result,
            )

        raise ValueError(f"Unsupported mode: {mode}")
