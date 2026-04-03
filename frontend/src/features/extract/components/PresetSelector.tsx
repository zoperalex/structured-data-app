import type { PresetName } from "../types";

type PresetSelectorProps = {
	preset: PresetName;
	onPresetChange: (preset: PresetName) => void;
};

export function PresetSelector({
	preset,
	onPresetChange,
}: PresetSelectorProps) {
	return (
		<section className="panel panel--small">
			<h3 className="panel__title">Preset</h3>

			<select
				className="select"
				value={preset}
				onChange={(event) =>
					onPresetChange(event.target.value as PresetName)
				}
			>
				<option value="expense_note">Expense Note</option>
				<option value="task_list">Task List</option>
				<option value="contact_info">Contact Info</option>
			</select>
		</section>
	);
}
