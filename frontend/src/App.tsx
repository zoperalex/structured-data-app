import { useState } from "react";
import type { ExtractResponse, ErrorResponse } from "./types";

function App() {
	const [text, setText] = useState("");
	const [result, setResult] = useState<ExtractResponse | null>(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");
		setResult(null);
		setLoading(true);

		try {
			const response = await fetch("http://127.0.0.1:5000/api/extract", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ text }),
			});

			if (!response.ok) {
				const errorData: ErrorResponse = await response.json();
				throw new Error(errorData.error || "Something went wrong");
			}

			const data: ExtractResponse = await response.json();
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

			<form onSubmit={handleSubmit} style={{ marginTop: "1.5rem" }}>
				<textarea
					value={text}
					onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
						setText(event.target.value)
					}
					placeholder="Paste text here..."
					rows={10}
					style={{ width: "100%", padding: "1rem", fontSize: "1rem" }}
				/>

				<button
					type="submit"
					disabled={loading || !text.trim()}
					style={{
						marginTop: "1rem",
						padding: "0.75rem 1.25rem",
						fontSize: "1rem",
					}}
				>
					{loading ? "Extracting..." : "Extract Data"}
				</button>
			</form>

			{error && (
				<div style={{ marginTop: "1.5rem", color: "red" }}>
					<strong>Error:</strong> {error}
				</div>
			)}

			{result && (
				<div style={{ marginTop: "2rem", textAlign: "left" }}>
					<h2 style={{ textAlign: "center" }}>Result</h2>

					<p>
						<strong>Mode:</strong> {result.mode}
					</p>

					<p>
						<strong>Input text:</strong>{" "}
						{result.input_text ?? "N/A"}
					</p>

					<p>
						<strong>Category:</strong> {result.result.category}
					</p>

					<h3>Items</h3>
					<ul>
						{result.result.items.map((item, index) => (
							<li key={index}>
								{item.type} — {item.amount} {item.currency} (
								{item.status})
							</li>
						))}
					</ul>

					<h3>Raw JSON</h3>
					<pre
						style={{
							background: "#f4f4f4",
							padding: "1rem",
							borderRadius: "8px",
							overflowX: "auto",
						}}
					>
						{JSON.stringify(result, null, 2)}
					</pre>
				</div>
			)}
		</main>
	);
}

export default App;
