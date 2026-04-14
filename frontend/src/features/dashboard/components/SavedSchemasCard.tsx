import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSchemas } from "../../extract/api/schemas";
import type { SavedSchema } from "../../extract/api/schemas";

type SavedSchemasCardProps = {
	session: Session;
};

export function SavedSchemasCard({ session }: SavedSchemasCardProps) {
	const [schemas, setSchemas] = useState<SavedSchema[]>([]);
	const [loading, setLoading] = useState(true);
	const [copiedId, setCopiedId] = useState<number | null>(null);

	useEffect(() => {
		getSchemas(session.access_token)
			.then(setSchemas)
			.finally(() => setLoading(false));
	}, [session]);

	function handleCopyId(id: number) {
		navigator.clipboard.writeText(String(id));
		setCopiedId(id);
		setTimeout(() => setCopiedId(null), 3000);
	}

	if (loading)
		return (
			<section className="panel">
				<h2 className="panel__title">Saved Schemas</h2>
				<p className="panel__muted">Loading...</p>
			</section>
		);

	return (
		<section className="panel">
			<h2 className="panel__title">Saved Schemas</h2>
			<p className="panel__muted">
				Use a schema ID in your API requests to extract with a saved
				schema.
			</p>

			{schemas.length === 0 ? (
				<p className="saved-schemas__empty">
					No saved schemas yet. Build one in the{" "}
					<a href="/" className="docs__link">
						Schema Builder
					</a>
					.
				</p>
			) : (
				<div className="saved-schemas__list">
					{schemas.map((schema) => (
						<div key={schema.id} className="saved-schemas__item">
							<div className="saved-schemas__item-info">
								<span className="saved-schemas__item-name">
									{schema.name}
								</span>
								<span className="saved-schemas__item-id">
									ID: {schema.id}
								</span>
							</div>
							<div className="saved-schemas__item-right">
								<span className="saved-schemas__item-date">
									{new Date(
										schema.created_at,
									).toLocaleDateString()}
								</span>
								<button
									className="header-auth__button"
									onClick={() => handleCopyId(schema.id)}
								>
									{copiedId === schema.id
										? "Copied!"
										: "Copy ID"}
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</section>
	);
}
