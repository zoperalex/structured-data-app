import { useState } from "react";
import type { Session } from "@supabase/supabase-js";
import type { Profile } from "../../auth/api/auth";
import { createCheckoutSession, cancelSubscription } from "../../auth/api/auth";
import { TIER_LIMITS, STRIPE_PRICES } from "../constants/tierLimits";

type TierCardProps = {
	profile: Profile;
	session: Session;
	onCancelled: () => void;
};

export function TierCard({ profile, session, onCancelled }: TierCardProps) {
	const tier = profile.tier as keyof typeof TIER_LIMITS;
	const limits = TIER_LIMITS[tier];
	const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
	const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
		"monthly",
	);
	const [loading, setLoading] = useState<string | null>(null);
	const [showCancelModal, setShowCancelModal] = useState(false);
	const [cancelling, setCancelling] = useState(false);

	async function handleUpgrade(priceId: string, tierName: string) {
		setLoading(tierName);
		try {
			const { url } = await createCheckoutSession(
				session.access_token,
				priceId,
			);
			window.location.href = url;
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(null);
		}
	}

	async function handleCancelConfirm() {
		setCancelling(true);
		try {
			await cancelSubscription(session.access_token);
			setShowCancelModal(false);
			onCancelled();
		} catch (err) {
			console.error(err);
		} finally {
			setCancelling(false);
		}
	}

	return (
		<section className="panel">
			<h2 className="panel__title">Your Plan</h2>
			<p className="panel__muted">Current tier and limits.</p>

			<div className="tier-card__tier">{tierLabel} Tier</div>

			<div className="tier-card__limits">
				<div className="tier-card__limit-row">
					<span>Saved schemas</span>
					<span>{limits.saved_schemas}</span>
				</div>
				<div className="tier-card__limit-row">
					<span>API keys</span>
					<span>
						{limits.api_keys === 0 ? "None" : limits.api_keys}
					</span>
				</div>
				<div className="tier-card__limit-row">
					<span>Requests per hour</span>
					<span>{limits.requests_per_hour}</span>
				</div>
			</div>

			{tier !== "free" && (
				<div className="tier-card__cancel">
					<button
						className="tier-card__cancel-btn"
						onClick={() => setShowCancelModal(true)}
					>
						Cancel subscription
					</button>
				</div>
			)}

			{tier !== "business" && (
				<div className="tier-card__upgrade">
					<div className="tier-card__upgrade-header">
						<p className="tier-card__upgrade-title">
							Upgrade your plan
						</p>
						<div className="tier-card__billing-toggle">
							<button
								className={`tier-card__toggle-btn ${billingPeriod === "monthly" ? "tier-card__toggle-btn--active" : ""}`}
								onClick={() => setBillingPeriod("monthly")}
							>
								Monthly
							</button>
							<button
								className={`tier-card__toggle-btn ${billingPeriod === "annual" ? "tier-card__toggle-btn--active" : ""}`}
								onClick={() => setBillingPeriod("annual")}
							>
								Annual
								<span className="tier-card__save-badge">
									Save 2 months
								</span>
							</button>
						</div>
					</div>

					<div className="tier-card__plans">
						{tier === "free" && (
							<div className="tier-card__plan">
								<div className="tier-card__plan-info">
									<span className="tier-card__plan-name">
										Pro
									</span>
									<span className="tier-card__plan-price">
										{billingPeriod === "monthly"
											? "$5/mo"
											: "$50/yr"}
									</span>
									<span className="tier-card__plan-features">
										5 schemas · 1 API key · 100 req/hr
									</span>
								</div>
								<button
									className="button"
									disabled={loading === "pro"}
									onClick={() =>
										handleUpgrade(
											STRIPE_PRICES.pro[billingPeriod],
											"pro",
										)
									}
								>
									{loading === "pro"
										? "Redirecting..."
										: "Upgrade"}
								</button>
							</div>
						)}

						<div className="tier-card__plan">
							<div className="tier-card__plan-info">
								<span className="tier-card__plan-name">
									Business
								</span>
								<span className="tier-card__plan-price">
									{billingPeriod === "monthly"
										? "$19/mo"
										: "$190/yr"}
								</span>
								<span className="tier-card__plan-features">
									20 schemas · 3 API keys · 500 req/hr
								</span>
							</div>
							<button
								className="button"
								disabled={loading === "business"}
								onClick={() =>
									handleUpgrade(
										STRIPE_PRICES.business[billingPeriod],
										"business",
									)
								}
							>
								{loading === "business"
									? "Redirecting..."
									: "Upgrade"}
							</button>
						</div>
					</div>
				</div>
			)}

			{showCancelModal && (
				<div
					className="modal-overlay"
					onClick={() => setShowCancelModal(false)}
				>
					<div className="modal" onClick={(e) => e.stopPropagation()}>
						<button
							className="modal__close"
							onClick={() => setShowCancelModal(false)}
						>
							✕
						</button>
						<h2 className="modal__title">Cancel subscription</h2>
						<p className="modal__subtitle">
							Your subscription will remain active until the end
							of the current billing period, then revert to the
							Free tier. Any excess API keys will be revoked at
							that point.
						</p>
						<div className="confirm-modal__actions">
							<button
								className="button button--secondary"
								onClick={() => setShowCancelModal(false)}
							>
								Keep subscription
							</button>
							<button
								className="button"
								onClick={handleCancelConfirm}
								disabled={cancelling}
							>
								{cancelling
									? "Cancelling..."
									: "Cancel subscription"}
							</button>
						</div>
					</div>
				</div>
			)}
		</section>
	);
}
