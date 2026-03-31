type ExtractFormProps = {
	text: string;
	loading: boolean;
	onTextChange: (value: string) => void;
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function ExtractForm({
	text,
	loading,
	onTextChange,
	onSubmit,
}: ExtractFormProps) {
	return (
		<form onSubmit={onSubmit} style={{ marginTop: "1.5rem" }}>
			<textarea
				value={text}
				onChange={(event) => onTextChange(event.target.value)}
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
	);
}
