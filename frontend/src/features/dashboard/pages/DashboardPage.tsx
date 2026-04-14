import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import { TierCard } from "../components/TierCard";
import { UsageCard } from "../components/UsageCard";
import { ApiKeysCard } from "../components/ApiKeysCard";
import { PageHeader } from "../../../shared/components/PageHeader";
import { SavedSchemasCard } from "../components/SavedSchemasCard";
import { useEffect, useState } from "react";
import { Toast } from "../../../shared/components/Toast";

export function DashboardPage() {
	const { session, profile, loading } = useAuth();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [successMessage, setSuccessMessage] = useState("");
	const [infoMessage, setInfoMessage] = useState("");
	const [cancelMessage, setCancelMessage] = useState("");

	useEffect(() => {
		if (searchParams.get("upgrade") === "success") {
			setSuccessMessage("Your plan has been upgraded successfully!");
			setTimeout(() => setSuccessMessage(""), 5000);
		} else if (searchParams.get("upgrade") === "cancelled") {
			setInfoMessage(
				"Upgrade cancelled. You can upgrade anytime from the dashboard.",
			);
			setTimeout(() => setInfoMessage(""), 5000);
		}
	}, [searchParams]);

	if (loading) return null;

	if (!session || !profile) {
		return (
			<main className="page">
				<div className="page__header">
					<div>
						<h1 className="page__title">Dashboard</h1>
					</div>
				</div>
				<div className="dashboard__locked">
					<p className="dashboard__locked-message">
						You need to be signed in to access the dashboard.
					</p>
					<button className="button" onClick={() => navigate("/")}>
						Go to home
					</button>
				</div>
			</main>
		);
	}

	return (
		<main className="page">
			<PageHeader
				title="Dashboard"
				subtitle="Manage your account and API keys."
			/>

			<div className="dashboard__grid">
				<TierCard
					profile={profile}
					session={session}
					onCancelled={() =>
						setCancelMessage(
							"Your subscription has been cancelled. You'll keep access until the end of your billing period.",
						)
					}
				/>
				<UsageCard session={session} />
				<ApiKeysCard session={session} profile={profile} />
				<SavedSchemasCard session={session} />
			</div>

			{successMessage && (
				<Toast
					message={successMessage}
					onClose={() => setSuccessMessage("")}
					type="success"
				/>
			)}
			{infoMessage && (
				<Toast
					message={infoMessage}
					onClose={() => setInfoMessage("")}
					type="info"
				/>
			)}
			{cancelMessage && (
				<Toast
					message={cancelMessage}
					onClose={() => setCancelMessage("")}
					type="info"
				/>
			)}
		</main>
	);
}
