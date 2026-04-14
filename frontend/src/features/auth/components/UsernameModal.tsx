import { useState } from "react";
import { updateUsername } from "../api/auth";
import type { Profile } from "../api/auth";
import type { Session } from "@supabase/supabase-js";

type UsernameModalProps = {
	session: Session;
	onComplete: (profile: Profile) => void;
};

export function UsernameModal({ session, onComplete }: UsernameModalProps) {
	const [username, setUsername] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const profile = await updateUsername(
				session.access_token,
				username,
			);
			onComplete(profile);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to save username",
			);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="modal-overlay">
			<div className="modal">
				<h2 className="modal__title">Welcome!</h2>
				<p className="modal__subtitle">
					Choose a username to get started.
				</p>

				{error && <p className="auth-form__error">{error}</p>}

				<form className="auth-form" onSubmit={handleSubmit}>
					<div className="auth-form__field">
						<label>Username</label>
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							maxLength={50}
							autoFocus
							required
						/>
					</div>
					<button className="button" type="submit" disabled={loading}>
						{loading ? "Saving..." : "Continue"}
					</button>
				</form>
			</div>
		</div>
	);
}
