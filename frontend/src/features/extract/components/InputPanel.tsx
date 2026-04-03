import type { ModeName } from "../types";

type InputPanelProps = {
	mode: ModeName;
	text: string;
	loading: boolean;
	onTextChange: (value: string) => void;
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function InputPanel({
	mode,
	text,
	loading,
	onTextChange,
	onSubmit,
}: InputPanelProps) {
	return (
		<section className="panel panel--large">
			<h2 className="panel__title">Input</h2>
			<p className="panel__muted">
				{mode === "preset"
					? "Paste text and extract structured data with the selected preset."
					: "Paste text and define custom fields later."}
			</p>

			<form className="input-panel__form" onSubmit={onSubmit}>
				<textarea
					className="textarea"
					value={text}
					onChange={(event) => onTextChange(event.target.value)}
					placeholder="Paste text here..."
					rows={18}
				/>

				<button
					className="button"
					type="submit"
					disabled={loading || !text.trim()}
				>
					{loading ? "Extracting..." : "Extract Data"}
				</button>
			</form>
		</section>
	);
}
