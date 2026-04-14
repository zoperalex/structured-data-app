import { useEffect, useState, useCallback } from "react";
import type { Session } from "@supabase/supabase-js";
import type { FieldType, SchemaField } from "../../types";
import { AddFieldButton } from "./AddFieldButton";
import { FieldRow } from "./FieldRow";
import { SchemaModal } from "../../../auth/pages/SchemaModal";
import { DeleteSchemaModal } from "../../../auth/components/DeleteSchemaModal";
import { getSchemas, deleteSchema } from "../../api/schemas";
import type { SavedSchema } from "../../api/schemas";

type SchemaBuilderProps = {
	onSchemaChange?: (fields: SchemaField[]) => void;
	session: Session | null;
};

function createSchemaField(type: FieldType): SchemaField {
	return {
		id: crypto.randomUUID(),
		name: "",
		type,
		children: [],
	};
}

export function SchemaBuilder({ onSchemaChange, session }: SchemaBuilderProps) {
	const [fields, setFields] = useState<SchemaField[]>([]);
	const [showModal, setShowModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [saved, setSaved] = useState(false);
	const [savedSchemas, setSavedSchemas] = useState<SavedSchema[]>([]);
	const [selectedSchemaId, setSelectedSchemaId] = useState<number | null>(
		null,
	);
	const [isDirty, setIsDirty] = useState(false);

	const showSaveButton =
		fields.length > 0 && (selectedSchemaId === null || isDirty);
	const selectedSchema =
		savedSchemas.find((s) => s.id === selectedSchemaId) ?? null;

	const fetchSchemas = useCallback(async () => {
		if (!session) return;
		try {
			const schemas = await getSchemas(session.access_token);
			setSavedSchemas(schemas);
		} catch {
			// silently fail
		}
	}, [session]);

	useEffect(() => {
		fetchSchemas();
	}, [fetchSchemas]);

	useEffect(() => {
		onSchemaChange?.(fields);
	}, [fields, onSchemaChange]);

	function updateField(updatedField: SchemaField) {
		setFields((prev) =>
			prev.map((f) => (f.id === updatedField.id ? updatedField : f)),
		);
		setIsDirty(true);
	}

	function deleteField(fieldId: string) {
		setFields((prev) => prev.filter((f) => f.id !== fieldId));
		setIsDirty(true);
	}

	function addRootField(type: FieldType) {
		setFields((prev) => [...prev, createSchemaField(type)]);
		setIsDirty(true);
	}

	function handleSchemaSelect(e: React.ChangeEvent<HTMLSelectElement>) {
		const id = Number(e.target.value);
		if (!id) {
			setFields([]);
			setSelectedSchemaId(null);
			setIsDirty(false);
			return;
		}

		const schema = savedSchemas.find((s) => s.id === id);
		if (!schema) return;

		setFields(schema.fields);
		setSelectedSchemaId(id);
		setIsDirty(false);
	}

	function handleSaved(schema: SavedSchema) {
		setSaved(true);
		setIsDirty(false);
		setSelectedSchemaId(schema.id);
		fetchSchemas();
		setTimeout(() => setSaved(false), 3000);
	}

	async function handleDeleteConfirm() {
		if (!session || !selectedSchemaId) return;
		try {
			await deleteSchema(session.access_token, selectedSchemaId);
			setFields([]);
			setSelectedSchemaId(null);
			setIsDirty(false);
			setShowDeleteModal(false);
			fetchSchemas();
		} catch {
			setShowDeleteModal(false);
		}
	}

	return (
		<section className="panel panel--medium">
			<div className="schema-builder__header">
				<div>
					<h2 className="panel__title">Schema Builder</h2>
					<p className="panel__muted">
						Build a nested schema visually. Object fields can
						contain child fields.{" "}
						<div style={{ fontWeight: 600, color: "#e0e0e0" }}>
							Make sure the names are as descriptive as possible
							for best extraction results.
						</div>
					</p>
				</div>

				{session && savedSchemas.length > 0 && (
					<div className="schema-builder__toolbar">
						<select
							className="schema-builder__select"
							value={selectedSchemaId ?? ""}
							onChange={handleSchemaSelect}
						>
							<option value="">Load a saved schema...</option>
							{savedSchemas.map((schema) => (
								<option key={schema.id} value={schema.id}>
									{schema.name}
								</option>
							))}
						</select>

						<button
							className={`schema-builder__delete ${selectedSchemaId ? "schema-builder__delete--visible" : ""}`}
							onClick={() => setShowDeleteModal(true)}
							tabIndex={selectedSchemaId ? 0 : -1}
						>
							Delete
						</button>
					</div>
				)}
			</div>

			<div className="schema-builder">
				<div className="schema-brace">{"{"}</div>
				<div className="schema-content">
					{fields.length === 0 && (
						<p className="schema-builder__empty">
							No fields yet. Add your first field below.
						</p>
					)}
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

			{showSaveButton && (
				<div className="schema-builder__save">
					<button
						className="button"
						onClick={() => setShowModal(true)}
					>
						{session ? "Save schema" : "Sign in to save"}
					</button>
				</div>
			)}

			{saved && (
				<p
					style={{
						margin: "0.75rem 0 0",
						color: "#b8b8b8",
						fontSize: "0.9rem",
					}}
				>
					Schema saved successfully.
				</p>
			)}

			{showModal && (
				<SchemaModal
					session={session}
					fields={fields}
					onClose={() => setShowModal(false)}
					onSaved={handleSaved}
				/>
			)}

			{showDeleteModal && selectedSchema && (
				<DeleteSchemaModal
					schemaName={selectedSchema.name}
					onConfirm={handleDeleteConfirm}
					onCancel={() => setShowDeleteModal(false)}
				/>
			)}
		</section>
	);
}
