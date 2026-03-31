import { useState } from "react";

import { extractStructuredData } from "../features/extract/api/extract";
import { ExtractForm } from "../features/extract/components/ExtractForm";
import { ExtractResult } from "../features/extract/components/ExtractResult";
import type { ExtractResponse } from "../features/extract/types";

function App() {
	const [text, setText] = useState("");
	const [result, setResult] = useState<ExtractResponse | null>(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (loading) return;

		setError("");
		setResult(null);
		setLoading(true);

		try {
			const data = await extractStructuredData(text);
			setResult(data);
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Failed to fetch");
		} finally {
			setLoading(false);
		}
	}

	return (
		<main
			style={{
				padding: "2rem",
				fontFamily: "Arial, sans-serif",
				maxWidth: "900px",
				margin: "0 auto",
			}}
		>
			<h1>Structured Data Extractor</h1>
			<p>Paste some text and get structured JSON back.</p>

			<ExtractForm
				text={text}
				loading={loading}
				onTextChange={setText}
				onSubmit={handleSubmit}
			/>

			{error && (
				<div style={{ marginTop: "1.5rem", color: "red" }}>
					<strong>Error:</strong> {error}
				</div>
			)}

			{result && <ExtractResult result={result} />}
		</main>
	);
}

export default App;
