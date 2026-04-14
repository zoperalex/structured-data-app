import { useState } from "react";
import { useAuth } from "../features/auth/context/AuthContext";
import { extractStructuredData } from "../features/extract/api/extract";
import { ExtractWorkspace } from "../features/extract/components/ExtractWorkspace";
import { Toast } from "../shared/components/Toast";
import { PageHeader } from "../shared/components/PageHeader";
import type {
	ExtractResponse,
	ExtractRequest,
	ModeName,
	PresetName,
	SchemaField,
} from "../features/extract/types";

function MainPage() {
	const { session } = useAuth();

	const [mode, setMode] = useState<ModeName>("preset");
	const [preset, setPreset] = useState<PresetName>("expense_note");
	const [text, setText] = useState("");
	const [result, setResult] = useState<ExtractResponse | null>(null);
	const [error, setError] = useState("");
	const [extractLoading, setExtractLoading] = useState(false);
	const [schemaFields, setSchemaFields] = useState<SchemaField[]>([]);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (extractLoading) return;

		setError("");
		setResult(null);
		setExtractLoading(true);

		try {
			const payload: ExtractRequest = {
				mode,
				preset: mode === "preset" ? preset : null,
				schema: mode === "user_defined" ? schemaFields : null,
				text,
			};

			const data = await extractStructuredData(
				payload,
				session?.access_token ?? undefined,
			);
			setResult(data);
		} catch (submitError: unknown) {
			setError(
				submitError instanceof Error
					? submitError.message
					: "Failed to fetch",
			);
		} finally {
			setExtractLoading(false);
		}
	}

	return (
		<main className="page scrollbar-hidden">
			<PageHeader
				title="JSONExtract - Structured Data Extractor"
				subtitle="Extract structured information from messy text."
			/>

			<ExtractWorkspace
				mode={mode}
				preset={preset}
				text={text}
				result={result}
				loading={extractLoading}
				schemaFields={schemaFields}
				onModeChange={setMode}
				onPresetChange={setPreset}
				onTextChange={setText}
				onSubmit={handleSubmit}
				onSchemaChange={setSchemaFields}
				session={session}
			/>

			{error && <Toast message={error} onClose={() => setError("")} />}
		</main>
	);
}

export default MainPage;
