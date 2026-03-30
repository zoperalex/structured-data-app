import { useEffect, useState } from "react";

function App() {
	const [backendStatus, setBackendStatus] = useState("Loading...");
	const [error, setError] = useState("");

	useEffect(() => {
		async function checkBackend() {
			try {
				const response = await fetch(
					"http://localhost:5000/api/health",
				);

				if (!response.ok) {
					throw new Error(`HTTP error: ${response.status}`);
				}

				const data = await response.json();
				setBackendStatus(data.status);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Something went wrong",
				);
			}
		}

		checkBackend();
	}, []);

	return (
		<main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
			<h1>Structured Data Extractor</h1>

			{error ? (
				<p style={{ color: "red" }}>Error: {error}</p>
			) : (
				<p>Backend status: {backendStatus}</p>
			)}
		</main>
	);
}

export default App;
