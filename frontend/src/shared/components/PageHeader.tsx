import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";
import { HamburgerMenu } from "./HamburgerMenu";
import { SignInModal } from "../../features/auth/components/SignInModal";
import { SignOutModal } from "../../features/auth/components/SignOutModal";
import { UsernameModal } from "../../features/auth/components/UsernameModal";

type PageHeaderProps = {
	title: string;
	subtitle?: string;
};

export function PageHeader({ title, subtitle }: PageHeaderProps) {
	const { session, profile, setProfile, loading, signOut } = useAuth();
	const navigate = useNavigate();
	const [showSignIn, setShowSignIn] = useState(false);
	const [showSignOut, setShowSignOut] = useState(false);

	const tierLabel = profile
		? profile.tier.charAt(0).toUpperCase() + profile.tier.slice(1)
		: null;

	const needsUsername = session && profile && profile.username === null;

	async function handleSignOut() {
		await signOut();
		setShowSignOut(false);
	}

	return (
		<>
			<div className="page__header">
				<div>
					<h1 className="page__title">{title}</h1>
					{subtitle && <p className="page__subtitle">{subtitle}</p>}
				</div>

				{!loading && (
					<div className="header-auth">
						{session && profile ? (
							<>
								<span className="header-auth__greeting">
									Hello, {profile.username ?? ""}!
									{tierLabel && (
										<span className="header-auth__tier">
											{" "}
											| {tierLabel} Tier
										</span>
									)}
								</span>
								<HamburgerMenu
									onSignOut={() => setShowSignOut(true)}
									onNavigate={navigate}
								/>
							</>
						) : (
							<button
								className="header-auth__button"
								onClick={() => setShowSignIn(true)}
							>
								Sign in
							</button>
						)}
					</div>
				)}
			</div>

			{needsUsername && session && (
				<UsernameModal session={session} onComplete={setProfile} />
			)}
			{showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}
			{showSignOut && (
				<SignOutModal
					onConfirm={handleSignOut}
					onCancel={() => setShowSignOut(false)}
				/>
			)}
		</>
	);
}
