import { db } from "@/lib/firebase";
import { collection, query, limit, getDocs } from "firebase/firestore";

export async function fetchUserProfiles(limitCount = 4) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, limit(limitCount));
  const querySnapshot = await getDocs(q);

  const profiles = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return profiles;
}
