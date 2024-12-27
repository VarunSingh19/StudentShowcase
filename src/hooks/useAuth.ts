import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import {
  onAuthStateChanged,
  User,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [teamNotifications, setTeamNotifications] = useState<{
    [teamId: string]: number;
  }>({});

  useEffect(() => {
    let unsubscribeTeams: (() => void) | null = null;

    setPersistence(auth, browserLocalPersistence).catch(console.error);

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (user) => {
        setUser(user);
        if (user) {
          const adminDoc = await getDoc(doc(db, "adminUsers", user.uid));
          setIsAdmin(adminDoc.exists() && adminDoc.data()?.isAdmin);
          unsubscribeTeams = subscribeToTeamNotifications(user.uid);
        } else {
          setIsAdmin(false);
          setTeamNotifications({});
          if (unsubscribeTeams) {
            unsubscribeTeams();
          }
        }
        setLoading(false);
        setAuthChecked(true);
      },
      (error) => {
        console.error("Auth state change error:", error);
        setLoading(false);
        setAuthChecked(true);
      }
    );

    return () => {
      unsubscribeAuth();
      if (unsubscribeTeams) {
        unsubscribeTeams();
      }
    };
  }, []);

  const subscribeToTeamNotifications = (userId: string) => {
    const teamsQuery = query(
      collection(db, "teams"),
      where("currentMembers", "array-contains", userId)
    );

    return onSnapshot(teamsQuery, (snapshot) => {
      const notifications: { [teamId: string]: number } = {};
      snapshot.docs.forEach((doc) => {
        const teamData = doc.data();
        notifications[doc.id] = teamData.unreadMessages?.[userId] || 0;
      });
      setTeamNotifications(notifications);
    });
  };

  return { user, isAdmin, loading, authChecked, teamNotifications };
}
