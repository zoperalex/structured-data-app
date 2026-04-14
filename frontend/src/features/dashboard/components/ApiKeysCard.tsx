import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getApiKeys, generateApiKey, revokeApiKey } from "../../auth/api/auth";
import type { ApiKey, GeneratedApiKey } from "../../auth/api/auth";
import type { Profile } from "../../auth/api/auth";
import { TIER_LIMITS } from "../constants/tierLimits";

type ApiKeysCardProps = {
	session: Session;
	profile: Profile;
};

export function ApiKeysCard({ session, profile }: ApiKeysCardProps) {
	const [keys, setKeys] = useState<ApiKey[]>([]);
	const [loading, setLoading] = useState(true);
	const [newKeyName, setNewKeyName] = useState("");
	const [generating, setGenerating] = useState(false);
	const [generatedKey, setGeneratedKey] = useState<GeneratedApiKey | null>(
		null,
	);
	const [revealed, setRevealed] = useState(false);
	const [error, setError] = useState("");

	const tier = profile.tier as keyof typeof TIER_LIMITS;
	const keyLimit = TIER_LIMITS[tier].api_keys;
	const canGenerateKeys = keyLimit > 0;
	const [copied, setCopied] = useState(false);
	const [revokeTargetId, setRevokeTargetId] = useState<number | null>(null);

	useEffect(() => {
		getApiKeys(session.access_token)
			.then(setKeys)
			.finally(() => setLoading(false));
	}, [session]);

	async function handleGenerate() {
		if (!newKeyName.trim()) return;
		setGenerating(true);
		setError("");

		try {
			const result = await generateApiKey(
				session.access_token,
				newKeyName,
			);
			setGeneratedKey(result);
			setNewKeyName("");
			const updatedKeys = await getApiKeys(session.access_token);
			setKeys(updatedKeys);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to generate key",
			);
		} finally {
			setGenerating(false);
		}
	}

	async function handleRevoke(keyId: number) {
		try {
			await revokeApiKey(session.access_token, keyId);
			setKeys((prev) => prev.filter((k) => k.id !== keyId));
		} catch {
			setError("Failed to revoke key");
		}
	}

	if (!canGenerateKeys) {
		return (
			<section className="panel">
				<h2 className="panel__title">API Keys</h2>
				<p className="panel__muted">
					API keys are available on the Pro and Business tiers.
				</p>
				<div className="api-keys__upgrade">
					Upgrade your plan to generate API keys and integrate the
					extractor into your own projects.
				</div>
			</section>
		);
	}

	return (
		<section className="panel">
			<h2 className="panel__title">API Keys</h2>
			<p className="panel__muted">
				Generate keys to use the extractor in your own projects. You can
				have up to {keyLimit} active key{keyLimit !== 1 ? "s" : ""}.
			</p>

			{generatedKey && (
				<div className="api-keys__new-key">
					<p className="api-keys__new-key-warning">
						Copy this key now — you won't be able to see it again.
					</p>
					<div className="api-keys__key-display">
						<code className="api-keys__key-value">
							{revealed
								? generatedKey.raw_key
								: generatedKey.raw_key.slice(0, 8) +
									"•".repeat(20)}
						</code>
						<button
							className="header-auth__button"
							onClick={() => setRevealed((prev) => !prev)}
						>
							{revealed ? "Hide" : "Reveal"}
						</button>
						<button
							className="header-auth__button"
							onClick={() => {
								navigator.clipboard.writeText(
									generatedKey.raw_key,
								);
								setCopied(true);
								setTimeout(() => setCopied(false), 3000);
							}}
						>
							{copied ? "Copied!" : "Copy"}
						</button>
					</div>
					<button
						className="api-keys__dismiss"
						onClick={() => {
							setGeneratedKey(null);
							setRevealed(false);
						}}
					>
						I've saved my key
					</button>
				</div>
			)}

			{error && <p className="auth-form__error">{error}</p>}

			{!loading && keys.length > 0 && (
				<div className="api-keys__list">
					{keys.map((key) => (
						<div key={key.id} className="api-keys__item">
							<div className="api-keys__item-info">
								<span className="api-keys__item-name">
									{key.name}
								</span>
								<span className="api-keys__item-prefix">
									{key.key_prefix}...
								</span>
								<span className="api-keys__item-meta">
									Created{" "}
									{new Date(
										key.created_at,
									).toLocaleDateString()}
									{key.last_used_at &&
										` · Last used ${new Date(key.last_used_at).toLocaleDateString()}`}
								</span>
							</div>
							<button
								className="header-auth__button"
								onClick={() => setRevokeTargetId(key.id)}
							>
								Revoke
							</button>
						</div>
					))}
				</div>
			)}

			{keys.length < keyLimit && (
				<div className="api-keys__generate">
					<input
						type="text"
						placeholder="Key name (e.g. My Project)"
						value={newKeyName}
						onChange={(e) => setNewKeyName(e.target.value)}
						className="api-keys__input"
					/>
					<button
						className="button"
						onClick={handleGenerate}
						disabled={generating || !newKeyName.trim()}
					>
						{generating ? "Generating..." : "Generate key"}
					</button>
				</div>
			)}
			{revokeTargetId !== null && (
				<div
					className="modal-overlay"
					onClick={() => setRevokeTargetId(null)}
				>
					<div className="modal" onClick={(e) => e.stopPropagation()}>
						<button
							className="modal__close"
							onClick={() => setRevokeTargetId(null)}
						>
							✕
						</button>
						<h2 className="modal__title">Revoke API key</h2>
						<p className="modal__subtitle">
							Are you sure? This key will stop working immediately
							and cannot be undone.
						</p>
						<div className="confirm-modal__actions">
							<button
								className="button button--secondary"
								onClick={() => setRevokeTargetId(null)}
							>
								Cancel
							</button>
							<button
								className="button"
								onClick={() => {
									handleRevoke(revokeTargetId);
									setRevokeTargetId(null);
								}}
							>
								Revoke
							</button>
						</div>
					</div>
				</div>
			)}
		</section>
	);
}
