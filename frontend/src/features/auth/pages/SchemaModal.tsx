import { useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { LoginForm } from "../components/LoginForm";
import { SignupForm } from "../components/SignupForm";
import { saveSchema } from "../../extract/api/schemas";
import type { SchemaField } from "../../extract/types";
import type { SavedSchema } from "../../extract/api/schemas";

type ModalView = "login" | "signup" | "save";

type SchemaModalProps = {
	session: Session | null;
	fields: SchemaField[];
	onClose: () => void;
	onSaved: (schema: SavedSchema) => void;
};

export function SchemaModal({
	session,
	fields,
	onClose,
	onSaved,
}: SchemaModalProps) {
	const [view, setView] = useState<ModalView>(session ? "save" : "login");
	const [schemaName, setSchemaName] = useState("");
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	async function handleSave() {
		if (!session || !schemaName.trim()) return;
		setSaving(true);
		setError("");

		try {
			const saved = await saveSchema(
				session.access_token,
				schemaName,
				fields,
			);
			onSaved(saved);
			onClose();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to save schema",
			);
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal" onClick={(e) => e.stopPropagation()}>
				<button className="modal__close" onClick={onClose}>
					✕
				</button>

				{view === "login" && (
					<LoginForm
						onToggle={() => setView("signup")}
						onSuccess={() => setView("save")}
					/>
				)}

				{view === "signup" && (
					<SignupForm
						onToggle={() => setView("login")}
						onSuccess={() => setView("save")}
					/>
				)}

				{view === "save" && (
					<>
						<h2 className="modal__title">Save schema</h2>
						<p className="modal__subtitle">
							Give your schema a name to save it.
						</p>

						{error && <p className="auth-form__error">{error}</p>}

						<div className="save-form">
							<div className="save-form__field">
								<label>Schema name</label>
								<input
									type="text"
									placeholder="e.g. Invoice Parser"
									value={schemaName}
									onChange={(e) =>
										setSchemaName(e.target.value)
									}
									autoFocus
								/>
							</div>
							<div className="save-form__actions">
								<button
									className="button button--secondary"
									onClick={onClose}
								>
									Cancel
								</button>
								<button
									className="button"
									onClick={handleSave}
									disabled={saving || !schemaName.trim()}
								>
									{saving ? "Saving..." : "Save"}
								</button>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
