import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

type HamburgerMenuProps = {
	onSignOut: () => void;
	onNavigate: (path: string) => void;
};

export function HamburgerMenu({ onSignOut, onNavigate }: HamburgerMenuProps) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const location = useLocation();

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	function handleNavigate(path: string) {
		setOpen(false);
		onNavigate(path);
	}

	function handleSignOut() {
		setOpen(false);
		onSignOut();
	}

	const isHome = location.pathname === "/";
	const isDashboard = location.pathname === "/dashboard";
	const isDocs = location.pathname === "/documentation";

	return (
		<div className="hamburger" ref={ref}>
			<button
				className="hamburger__button"
				onClick={() => setOpen((prev) => !prev)}
				aria-label="Menu"
			>
				<span className="hamburger__bar" />
				<span className="hamburger__bar" />
				<span className="hamburger__bar" />
			</button>

			{open && (
				<div className="hamburger__dropdown">
					{!isHome && (
						<button
							className="hamburger__item"
							onClick={() => handleNavigate("/")}
						>
							Home
						</button>
					)}
					{!isDashboard && (
						<button
							className="hamburger__item"
							onClick={() => handleNavigate("/dashboard")}
						>
							Dashboard
						</button>
					)}
					{!isDocs && (
						<button
							className="hamburger__item"
							onClick={() => handleNavigate("/documentation")}
						>
							Documentation
						</button>
					)}
					<div className="hamburger__divider" />
					<button
						className="hamburger__item hamburger__item--danger"
						onClick={handleSignOut}
					>
						Sign out
					</button>
				</div>
			)}
		</div>
	);
}
