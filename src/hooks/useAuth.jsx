import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase";
import { fetchProfile } from "@/services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let latestRequest = 0;

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      const requestId = ++latestRequest;
      setUser(u);
      setLoading(true);

      Promise.resolve()
        .then(() => (u ? fetchProfile(u.uid) : null))
        .catch(() => null)
        .then((nextProfile) => {
          if (!active || requestId !== latestRequest) return;
          setProfile(nextProfile);
          setLoading(false);
        });
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const refresh = useCallback(async () => {
    if (auth.currentUser) setProfile(await fetchProfile(auth.currentUser.uid));
  }, []);

  const value = useMemo(
    () => ({ user, profile, loading, refresh, isAdmin: profile?.status === "active" && (profile?.role === "super_admin" || (profile?.permissions?.length || 0) > 0) }),
    [user, profile, loading, refresh]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
