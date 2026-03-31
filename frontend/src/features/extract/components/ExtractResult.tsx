import { useState } from "react";
import { Check, Copy } from "lucide-react";

import type { ExtractResponse } from "../types";

type ExtractResultProps = {
	result: ExtractResponse;
};

export function ExtractResult({ result }: ExtractResultProps) {
	const [copied, setCopied] = useState(false);

	const rawJson = JSON.stringify(result, null, 2);

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(rawJson);
			setCopied(true);

			setTimeout(() => {
				setCopied(false);
			}, 3500);
		} catch (error) {
			console.error("Failed to copy JSON:", error);
		}
	}

	return (
		<div style={{ marginTop: "2rem", textAlign: "left" }}>
			<h2>Result</h2>

			<p>
				<strong>Mode:</strong> {result.mode}
			</p>

			<p>
				<strong>Input text:</strong> {result.input_text ?? "N/A"}
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

			<div
				style={{
					marginTop: "1.5rem",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<h3 style={{ margin: 0 }}>Raw JSON</h3>
				<button
					type="button"
					onClick={handleCopy}
					style={{
						padding: "0.5rem 0.75rem",
						fontSize: "0.9rem",
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
						gap: "0.4rem",
					}}
				>
					{copied ? <Check size={16} /> : <Copy size={16} />}
					{copied ? "Copied!" : "Copy JSON"}
				</button>
			</div>

			<pre
				style={{
					background: "#f4f4f4",
					padding: "1rem",
					borderRadius: "8px",
					overflowX: "auto",
					marginTop: "0.75rem",
				}}
			>
				{rawJson}
			</pre>
		</div>
	);
}
