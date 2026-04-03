import type { SchemaField } from "../types";

function getExampleValueForField(field: SchemaField): unknown {
	switch (field.type) {
		case "string":
			return "example text";
		case "int":
			return 123;
		case "float":
			return 123.45;
		case "boolean":
			return true;
		case "object":
			return buildExampleObject(field.children);
		default:
			return null;
	}
}

export function buildExampleObject(fields: SchemaField[]): Record<string, unknown> {
	const result: Record<string, unknown> = {};

	for (const field of fields) {
		const trimmedName = field.name.trim();

		if (!trimmedName) {
			continue;
		}

		result[trimmedName] = getExampleValueForField(field);
	}

	return result;
}