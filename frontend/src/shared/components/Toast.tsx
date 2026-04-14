import { useEffect } from "react";

type ToastProps = {
	message: string;
	onClose: () => void;
	type?: "error" | "success" | "info";
};

export function Toast({ message, onClose, type = "error" }: ToastProps) {
	useEffect(() => {
		const timer = setTimeout(onClose, 5000);
		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<div className="toast-container">
			<div className={`toast toast--${type}`}>
				<span className="toast__close-icon">
					{type === "error" && (
						<svg
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none"
						>
							<circle cx="10" cy="10" r="9" fill="white" />
							<path
								d="M7 7l6 6M13 7l-6 6"
								stroke="#c0392b"
								strokeWidth="2"
								strokeLinecap="round"
							/>
						</svg>
					)}
					{type === "success" && (
						<svg
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none"
						>
							<circle cx="10" cy="10" r="9" fill="white" />
							<path
								d="M6 10l3 3 5-5"
								stroke="#27ae60"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					)}
					{type === "info" && (
						<svg
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none"
						>
							<circle cx="10" cy="10" r="9" fill="white" />
							<path
								d="M10 9v5M10 7h.01"
								stroke="#2980b9"
								strokeWidth="2"
								strokeLinecap="round"
							/>
						</svg>
					)}
				</span>
				<span className="toast__message">{message}</span>
				<button className="toast__close" onClick={onClose}>
					✕
				</button>
			</div>
		</div>
	);
}
