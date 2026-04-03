import { useState } from "react";

import { extractStructuredData } from "../features/extract/api/extract";
import { ExtractWorkspace } from "../features/extract/components/ExtractWorkspace";
import type {
	ExtractResponse,
	ExtractRequest,
	ModeName,
	PresetName,
	SchemaField,
} from "../features/extract/types";

function App() {
	const [mode, setMode] = useState<ModeName>("preset");
	const [preset, setPreset] = useState<PresetName>("expense_note");
	const [text, setText] = useState("");
	const [result, setResult] = useState<ExtractResponse | null>(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [schemaFields, setSchemaFields] = useState<SchemaField[]>([]);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (loading) return;

		setError("");
		setResult(null);
		setLoading(true);

		try {
			const payload: ExtractRequest = {
				mode,
				preset: mode === "preset" ? preset : null,
				schema: mode === "user_defined" ? schemaFields : null,
				text,
			};

			const data = await extractStructuredData(payload);
			setResult(data);
		} catch (submitError: unknown) {
			setError(
				submitError instanceof Error
					? submitError.message
					: "Failed to fetch",
			);
		} finally {
			setLoading(false);
		}
	}

	return (
		<main className="page scrollbar-hidden">
			<div className="page__header">
				<h1 className="page__title">Structured Data Extractor</h1>
				<p className="page__subtitle">
					Extract structured information from messy text.
				</p>
			</div>

			<ExtractWorkspace
				mode={mode}
				preset={preset}
				text={text}
				result={result}
				error={error}
				loading={loading}
				schemaFields={schemaFields}
				onModeChange={setMode}
				onPresetChange={setPreset}
				onTextChange={setText}
				onSubmit={handleSubmit}
				onSchemaChange={setSchemaFields}
			/>
		</main>
	);
}

export default App;
