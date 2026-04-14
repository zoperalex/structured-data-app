import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getUsage } from "../../auth/api/auth";
import type { UsageData } from "../../auth/api/auth";

type UsageCardProps = {
	session: Session;
};

export function UsageCard({ session }: UsageCardProps) {
	const [usage, setUsage] = useState<UsageData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getUsage(session.access_token)
			.then(setUsage)
			.finally(() => setLoading(false));
	}, [session]);

	if (loading)
		return (
			<section className="panel">
				<h2 className="panel__title">Usage</h2>
				<p className="panel__muted">Loading...</p>
			</section>
		);

	if (!usage) return null;

	const hourPercent = Math.min(
		(usage.requests_this_hour / usage.limit_per_hour) * 100,
		100,
	);

	return (
		<section className="panel">
			<h2 className="panel__title">Usage</h2>
			<p className="panel__muted">Your request usage.</p>

			<div className="usage-card__stats">
				<div className="usage-card__stat">
					<span className="usage-card__label">
						Requests this hour
					</span>
					<span className="usage-card__value">
						{usage.requests_this_hour}
						<span className="usage-card__limit">
							{" "}
							/ {usage.limit_per_hour}
						</span>
					</span>
					<div className="usage-card__bar">
						<div
							className="usage-card__bar-fill"
							style={{ width: `${hourPercent}%` }}
						/>
					</div>
				</div>

				<div className="usage-card__stat">
					<span className="usage-card__label">Requests today</span>
					<span className="usage-card__value">
						{usage.requests_today}
					</span>
				</div>
			</div>
		</section>
	);
}
