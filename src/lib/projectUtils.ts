import { db } from "@/lib/firebase";
import { collection, query, limit, getDocs } from "firebase/firestore";

export async function fetchProjects(limitCount = 4) {
  const projectsRef = collection(db, "projects");
  const q = query(projectsRef, limit(limitCount));
  const querySnapshot = await getDocs(q);

  const projects = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return projects;
}
