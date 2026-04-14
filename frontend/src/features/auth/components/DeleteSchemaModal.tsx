type DeleteSchemaModalProps = {
	schemaName: string;
	onConfirm: () => void;
	onCancel: () => void;
};

export function DeleteSchemaModal({
	schemaName,
	onConfirm,
	onCancel,
}: DeleteSchemaModalProps) {
	return (
		<div className="modal-overlay" onClick={onCancel}>
			<div className="modal" onClick={(e) => e.stopPropagation()}>
				<button className="modal__close" onClick={onCancel}>
					✕
				</button>
				<h2 className="modal__title">Delete schema</h2>
				<p className="modal__subtitle">
					Are you sure you want to delete{" "}
					<strong>{schemaName}</strong>? This can be recovered later
					if you upgrade your tier.
				</p>
				<div className="confirm-modal__actions">
					<button
						className="button button--secondary"
						onClick={onCancel}
					>
						Cancel
					</button>
					<button className="button" onClick={onConfirm}>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
}
