import { useState } from "react";
import { supabase } from "../../../shared/lib/supabase";

type SignupFormProps = {
	onToggle: () => void;
	onSuccess: () => void;
};

export function SignupForm({
	onToggle,
	onSuccess: _onSuccess,
}: SignupFormProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [verificationSent, setVerificationSent] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);

		const { error } = await supabase.auth.signUp({ email, password });

		if (error) {
			setError(error.message);
		} else {
			setVerificationSent(true);
		}

		setLoading(false);
	}

	if (verificationSent) {
		return (
			<>
				<h2 className="modal__title">Check your email</h2>
				<p className="modal__subtitle">
					We sent a verification link to <strong>{email}</strong>.
					Once verified, sign in to save your schema.
				</p>
				<button className="button button--secondary" onClick={onToggle}>
					Back to sign in
				</button>
			</>
		);
	}

	return (
		<>
			<h2 className="modal__title">Create an account</h2>
			<p className="modal__subtitle">
				Sign up to save and manage your schemas.
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
					{loading ? "Creating account..." : "Create account"}
				</button>
			</form>

			<p className="auth-form__toggle">
				Already have an account?{" "}
				<button onClick={onToggle}>Sign in</button>
			</p>
		</>
	);
}
