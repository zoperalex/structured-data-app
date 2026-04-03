import type { FieldType, SchemaField } from "../../types";
import { AddFieldButton } from "./AddFieldButton";

type FieldRowProps = {
	field: SchemaField;
	level: number;
	onChange: (updatedField: SchemaField) => void;
	onDelete: (fieldId: string) => void;
	onCreateField: (type: FieldType) => SchemaField;
};

export function FieldRow({
	field,
	level,
	onChange,
	onDelete,
	onCreateField,
}: FieldRowProps) {
	function updateName(name: string) {
		onChange({
			...field,
			name,
		});
	}

	function addChildField(type: FieldType) {
		const newChildField = onCreateField(type);

		onChange({
			...field,
			children: [...field.children, newChildField],
		});
	}

	function updateChildField(updatedChildField: SchemaField) {
		onChange({
			...field,
			children: field.children.map((child) =>
				child.id === updatedChildField.id ? updatedChildField : child,
			),
		});
	}

	function deleteChildField(childFieldId: string) {
		onChange({
			...field,
			children: field.children.filter(
				(child) => child.id !== childFieldId,
			),
		});
	}

	const isObjectField = field.type === "object";

	return (
		<div className="schema-field" style={{ marginLeft: `${level * 20}px` }}>
			<div className="schema-field__row">
				<input
					className="schema-field__name"
					type="text"
					placeholder="Enter name"
					value={field.name}
					onChange={(event) => updateName(event.target.value)}
				/>

				<span className="schema-field__type">{field.type}</span>

				<button
					type="button"
					className="schema-field__delete"
					onClick={() => onDelete(field.id)}
					aria-label="Delete field"
					title="Delete field"
				>
					×
				</button>
			</div>

			{isObjectField ? (
				<div className="schema-field__children">
					<div className="schema-brace schema-brace--nested">
						{"{"}
					</div>

					<div className="schema-field__children-content">
						{field.children.map((childField) => (
							<FieldRow
								key={childField.id}
								field={childField}
								level={level + 1}
								onChange={updateChildField}
								onDelete={deleteChildField}
								onCreateField={onCreateField}
							/>
						))}

						<AddFieldButton
							label="Add child field"
							onAdd={addChildField}
						/>
					</div>

					<div className="schema-brace schema-brace--nested">
						{"}"}
					</div>
				</div>
			) : null}
		</div>
	);
}
