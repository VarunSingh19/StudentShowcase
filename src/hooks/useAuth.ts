import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import {
  onAuthStateChanged,
  User,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Set persistence to local
    setPersistence(auth, browserLocalPersistence).catch(console.error);

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setLoading(false);
        setAuthChecked(true);
      },
      (error) => {
        console.error("Auth state change error:", error);
        setLoading(false);
        setAuthChecked(true);
      },
      () => {
        setLoading(false);
        setAuthChecked(true);
      }
    );

    return () => unsubscribe();
  }, []);

  return { user, loading, authChecked };
}
