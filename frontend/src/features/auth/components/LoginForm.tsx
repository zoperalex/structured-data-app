import { useState } from "react";
import { supabase } from "../../../shared/lib/supabase";

type LoginFormProps = {
	onToggle: () => void;
	onSuccess: () => void;
};

export function LoginForm({ onToggle, onSuccess }: LoginFormProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			setError(error.message);
		} else {
			onSuccess();
		}

		setLoading(false);
	}

	return (
		<>
			<h2 className="modal__title">Sign in to save</h2>
			<p className="modal__subtitle">
				Save your schema and access it later.
			</p>

			{error && <p className="auth-form__error">{error}</p>}

			<form className="auth-form" onSubmit={handleSubmit}>
				<div className="auth-form__field">
					<label>Email</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="auth-form__field">
					<label>Password</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<button className="button" type="submit" disabled={loading}>
					{loading ? "Signing in..." : "Sign in"}
				</button>
			</form>

			<p className="auth-form__toggle">
				Don't have an account?{" "}
				<button onClick={onToggle}>Create one</button>
			</p>
		</>
	);
}
