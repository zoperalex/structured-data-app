import { PRESET_EXAMPLES } from "../constants/examples";
import { buildExampleObject } from "../utils/schemaToExample";
import type { ModeName, PresetName, SchemaField } from "../types";

type ExamplePanelProps = {
	mode: ModeName;
	preset: PresetName;
	schemaFields: SchemaField[];
};

export function ExamplePanel({
	mode,
	preset,
	schemaFields,
}: ExamplePanelProps) {
	if (mode === "user_defined") {
		const dynamicExample = {
			input_text: "Your input text here",
			mode: "user_defined",
			preset: null,
			result: buildExampleObject(schemaFields),
		};

		return (
			<section className="panel panel--medium">
				<h2 className="panel__title">Example Output</h2>

				<div className="example-block">
					<div className="example-block__label">Example Output</div>
					<pre className="code-block">
						{JSON.stringify(dynamicExample, null, 2)}
					</pre>
				</div>
			</section>
		);
	}

	const example = PRESET_EXAMPLES[preset];

	return (
		<section className="panel panel--medium">
			<h2 className="panel__title">Example Output</h2>

			<div className="example-block">
				<div className="example-block__label">Example Input</div>
				<pre className="code-block">{example.input_text}</pre>
			</div>

			<div className="example-block">
				<div className="example-block__label">Example API Response</div>
				<pre className="code-block">
					{JSON.stringify(example, null, 2)}
				</pre>
			</div>
		</section>
	);
}
