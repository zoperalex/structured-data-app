import type { FieldType } from "../../types";

type TypeDropdownProps = {
	onSelect: (type: FieldType) => void;
};

const FIELD_TYPES: FieldType[] = [
	"string",
	"int",
	"float",
	"boolean",
	"object",
];

export function TypeDropdown({ onSelect }: TypeDropdownProps) {
	return (
		<div className="type-dropdown">
			{FIELD_TYPES.map((fieldType) => (
				<button
					key={fieldType}
					type="button"
					className="type-dropdown__item"
					onClick={() => onSelect(fieldType)}
				>
					{fieldType}
				</button>
			))}
		</div>
	);
}
