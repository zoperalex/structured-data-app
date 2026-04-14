import { useState } from "react";

import type {
	ContactInfoResult,
	ExtractResponse,
	TaskListResult,
	TransactionExtractionResult,
} from "../types";

type OutputPanelProps = {
	result: ExtractResponse | null;
	loading: boolean;
};

function renderExpenseNote(result: TransactionExtractionResult) {
	return (
		<ul className="result-list">
			{result.items.map((item, index) => (
				<li key={index} className="result-list__item">
					<strong>{item.type}</strong> — {item.amount} {item.currency}{" "}
					({item.status})
				</li>
			))}
		</ul>
	);
}

function renderTaskList(result: TaskListResult) {
	return (
		<ul className="result-list">
			{result.items.map((item, index) => (
				<li key={index} className="result-list__item">
					<div>
						<strong>{item.task}</strong>
					</div>
					<div className="result-meta">
						{item.assignee
							? `Assignee: ${item.assignee}`
							: "Assignee: N/A"}
					</div>
					<div className="result-meta">
						{item.due_date ? `Due: ${item.due_date}` : "Due: N/A"}
					</div>
					<div className="result-meta">
						{item.status ? `Status: ${item.status}` : "Status: N/A"}
					</div>
				</li>
			))}
		</ul>
	);
}

function renderContactInfo(result: ContactInfoResult) {
	return (
		<ul className="result-list">
			{result.items.map((item, index) => (
				<li key={index} className="result-list__item">
					<div className="result-meta">
						<strong>Name:</strong> {item.name ?? "N/A"}
					</div>
					<div className="result-meta">
						<strong>Email:</strong> {item.email ?? "N/A"}
					</div>
					<div className="result-meta">
						<strong>Phone:</strong> {item.phone ?? "N/A"}
					</div>
					<div className="result-meta">
						<strong>Company:</strong> {item.company ?? "N/A"}
					</div>
				</li>
			))}
		</ul>
	);
}

export function OutputPanel({ result, loading }: OutputPanelProps) {
	const [copied, setCopied] = useState(false);

	const rawJson = result ? JSON.stringify(result, null, 2) : "";

	async function handleCopy() {
		if (!rawJson) return;

		try {
			await navigator.clipboard.writeText(rawJson);
			setCopied(true);

			setTimeout(() => {
				setCopied(false);
			}, 1500);
		} catch (copyError) {
			console.error("Failed to copy JSON:", copyError);
		}
	}

	function renderResultContent() {
		if (loading) {
			return <p className="panel__muted">Waiting for response...</p>;
		}

		if (!result) {
			return (
				<p className="panel__muted">
					Your structured output will appear here after extraction.
				</p>
			);
		}

		switch (result.result.category) {
			case "expense_note":
				return renderExpenseNote(result.result);
			case "task_list":
				return renderTaskList(result.result);
			case "contact_info":
				return renderContactInfo(result.result);
			default:
				return null;
		}
	}

	return (
		<section className="panel panel--large">
			<div className="panel__header">
				<div>
					<h2 className="panel__title">Output</h2>
					<p className="panel__muted">
						Structured result from the extractor.
					</p>
				</div>

				{result ? (
					<button
						className="button button--secondary"
						type="button"
						onClick={handleCopy}
					>
						{copied ? "Copied!" : "Copy JSON"}
					</button>
				) : null}
			</div>

			<div className="output-panel__body">{renderResultContent()}</div>

			{result ? (
				<div className="output-panel__json">
					<div className="example-block__label">Raw JSON</div>
					<pre className="code-block">{rawJson}</pre>
				</div>
			) : null}
		</section>
	);
}
