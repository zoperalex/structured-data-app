import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

type SignInModalProps = {
	onClose: () => void;
};

export function SignInModal({ onClose }: SignInModalProps) {
	const [view, setView] = useState<"login" | "signup">("login");

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal" onClick={(e) => e.stopPropagation()}>
				<button className="modal__close" onClick={onClose}>
					✕
				</button>
				{view === "login" ? (
					<LoginForm
						onToggle={() => setView("signup")}
						onSuccess={onClose}
					/>
				) : (
					<SignupForm
						onToggle={() => setView("login")}
						onSuccess={onClose}
					/>
				)}
			</div>
		</div>
	);
}
