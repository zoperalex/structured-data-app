import { useEffect, useRef, useState } from "react";

import type { FieldType } from "../../types";
import { TypeDropdown } from "./TypeDropdown";

type AddFieldButtonProps = {
	label?: string;
	onAdd: (type: FieldType) => void;
};

export function AddFieldButton({
	label = "Add field",
	onAdd,
}: AddFieldButtonProps) {
	const [isOpen, setIsOpen] = useState(false);
	const containerReference = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				containerReference.current &&
				!containerReference.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	function handleTypeSelect(type: FieldType) {
		onAdd(type);
		setIsOpen(false);
	}

	return (
		<div className="add-field" ref={containerReference}>
			<button
				type="button"
				className="add-field__button"
				onClick={() => setIsOpen((previousValue) => !previousValue)}
			>
				<span>{label}</span>
				<span className="add-field__plus">+</span>
			</button>

			{isOpen ? <TypeDropdown onSelect={handleTypeSelect} /> : null}
		</div>
	);
}
