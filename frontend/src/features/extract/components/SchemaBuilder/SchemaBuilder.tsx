import { useEffect, useState } from "react";

import type { FieldType, SchemaField } from "../../types";
import { AddFieldButton } from "./AddFieldButton";
import { FieldRow } from "./FieldRow";

type SchemaBuilderProps = {
	onSchemaChange?: (fields: SchemaField[]) => void;
};

function createSchemaField(type: FieldType): SchemaField {
	return {
		id: crypto.randomUUID(),
		name: "",
		type,
		children: type === "object" ? [] : [],
	};
}

export function SchemaBuilder({ onSchemaChange }: SchemaBuilderProps) {
	const [fields, setFields] = useState<SchemaField[]>([]);

	useEffect(() => {
		onSchemaChange?.(fields);
	}, [fields, onSchemaChange]);

	function updateField(updatedField: SchemaField) {
		setFields((previousFields) =>
			previousFields.map((field) =>
				field.id === updatedField.id ? updatedField : field,
			),
		);
	}

	function deleteField(fieldId: string) {
		setFields((previousFields) =>
			previousFields.filter((field) => field.id !== fieldId),
		);
	}

	function addRootField(type: FieldType) {
		setFields((previousFields) => [
			...previousFields,
			createSchemaField(type),
		]);
	}

	return (
		<section className="panel panel--medium">
			<h2 className="panel__title">Schema Builder</h2>
			<p className="panel__muted">
				Build a nested schema visually. Object fields can contain child
				fields.
			</p>

			<div className="schema-builder">
				<div className="schema-brace">{"{"}</div>

				<div className="schema-content">
					{fields.length === 0 ? (
						<p className="schema-builder__empty">
							No fields yet. Add your first field below.
						</p>
					) : null}

					{fields.map((field) => (
						<FieldRow
							key={field.id}
							field={field}
							level={0}
							onChange={updateField}
							onDelete={deleteField}
							onCreateField={createSchemaField}
						/>
					))}

					<AddFieldButton label="Add field" onAdd={addRootField} />
				</div>

				<div className="schema-brace">{"}"}</div>
			</div>
		</section>
	);
}
