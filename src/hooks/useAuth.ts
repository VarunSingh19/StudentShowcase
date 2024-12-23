import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import {
  onAuthStateChanged,
  User,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Set persistence to local
    setPersistence(auth, browserLocalPersistence).catch(console.error);

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        setUser(user);
        if (user) {
          const adminDoc = await getDoc(doc(db, "adminUsers", user.uid));
          setIsAdmin(adminDoc.exists() && adminDoc.data()?.isAdmin);
        } else {
          setIsAdmin(false);
        }
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

  return { user, isAdmin, loading, authChecked };
}
