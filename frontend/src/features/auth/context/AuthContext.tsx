import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../../shared/lib/supabase";
import { getProfile } from "../api/auth";
import type { Profile } from "../api/auth";

type AuthContextType = {
	session: Session | null;
	profile: Profile | null;
	setProfile: (profile: Profile) => void;
	loading: boolean;
	signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [session, setSession] = useState<Session | null>(null);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchProfile = useCallback(async (session: Session) => {
		try {
			const profile = await getProfile(session.access_token);
			setProfile(profile);
		} catch {
			setProfile(null);
		}
	}, []);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			if (session) {
				fetchProfile(session).finally(() => setLoading(false));
			} else {
				setLoading(false);
			}
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			if (session) fetchProfile(session);
			else setProfile(null);
		});

		return () => subscription.unsubscribe();
	}, [fetchProfile]);

	async function signOut() {
		await supabase.auth.signOut();
		setProfile(null);
	}

	return (
		<AuthContext.Provider
			value={{ session, profile, setProfile, loading, signOut }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context)
		throw new Error("useAuth must be used within an AuthProvider");
	return context;
}
