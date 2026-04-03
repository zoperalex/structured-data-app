import type { ModeName } from "../types";

type ModeSelectorProps = {
	mode: ModeName;
	onModeChange: (mode: ModeName) => void;
};

export function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
	return (
		<section className="panel panel--small">
			<h3 className="panel__title">Mode</h3>

			<div className="selector-group">
				<button
					type="button"
					className={`selector-button ${mode === "preset" ? "selector-button--active" : ""}`}
					onClick={() => onModeChange("preset")}
				>
					Preset
				</button>

				<button
					type="button"
					className={`selector-button ${mode === "user_defined" ? "selector-button--active" : ""}`}
					onClick={() => onModeChange("user_defined")}
				>
					User Defined
				</button>
			</div>
		</section>
	);
}
