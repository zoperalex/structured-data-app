import type {
	ExtractResponse,
	ModeName,
	PresetName,
	SchemaField,
} from "../types";
import { ExamplePanel } from "./ExamplePanel";
import { InputPanel } from "./InputPanel";
import { ModeSelector } from "./ModeSelector";
import { OutputPanel } from "./OutputPanel";
import { PresetSelector } from "./PresetSelector";
import { SchemaBuilder } from "./SchemaBuilder/SchemaBuilder";
import type { Session } from "@supabase/supabase-js";

type ExtractWorkspaceProps = {
	mode: ModeName;
	preset: PresetName;
	text: string;
	result: ExtractResponse | null;
	loading: boolean;
	schemaFields: SchemaField[];
	session: Session | null;
	onModeChange: (mode: ModeName) => void;
	onPresetChange: (preset: PresetName) => void;
	onTextChange: (value: string) => void;
	onSchemaChange: (fields: SchemaField[]) => void;
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function ExtractWorkspace({
	mode,
	preset,
	text,
	result,
	loading,
	schemaFields,
	session,
	onModeChange,
	onPresetChange,
	onTextChange,
	onSchemaChange,
	onSubmit,
}: ExtractWorkspaceProps) {
	return (
		<section
			className={`workspace ${
				mode === "user_defined" ? "workspace--user-defined" : ""
			}`}
		>
			<InputPanel
				text={text}
				loading={loading}
				mode={mode}
				onTextChange={onTextChange}
				onSubmit={onSubmit}
			/>

			<div className="workspace__middle">
				<ModeSelector mode={mode} onModeChange={onModeChange} />

				{mode === "preset" ? (
					<PresetSelector
						preset={preset}
						onPresetChange={onPresetChange}
					/>
				) : (
					<SchemaBuilder
						onSchemaChange={onSchemaChange}
						session={session}
					/>
				)}

				<ExamplePanel
					mode={mode}
					preset={preset}
					schemaFields={schemaFields}
				/>
			</div>

			<OutputPanel result={result} loading={loading} />
		</section>
	);
}
