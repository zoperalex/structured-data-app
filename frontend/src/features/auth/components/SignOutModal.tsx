type SignOutModalProps = {
	onConfirm: () => void;
	onCancel: () => void;
};

export function SignOutModal({ onConfirm, onCancel }: SignOutModalProps) {
	return (
		<div className="modal-overlay" onClick={onCancel}>
			<div className="modal" onClick={(e) => e.stopPropagation()}>
				<button className="modal__close" onClick={onCancel}>
					✕
				</button>
				<h2 className="modal__title">Sign out</h2>
				<p className="modal__subtitle">
					Are you sure you want to sign out?
				</p>
				<div className="confirm-modal__actions">
					<button
						className="button button--secondary"
						onClick={onCancel}
					>
						Cancel
					</button>
					<button className="button" onClick={onConfirm}>
						Sign out
					</button>
				</div>
			</div>
		</div>
	);
}
