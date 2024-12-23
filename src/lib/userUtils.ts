import { db } from "@/lib/firebase";
import { UserProfile } from "@/types/profile";
import { collection, getDocs } from "firebase/firestore";

export async function fetchUserProfiles(): Promise<UserProfile[]> {
  const profilesCollection = collection(db, "profiles");
  const profilesSnapshot = await getDocs(profilesCollection);
  return profilesSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      displayName: data.displayName,
      bio: data.bio,
      location: data.location,
      skills: data.skills || [],
      socialLinks: {
        github: data.socialLinks?.github || "",
        linkedin: data.socialLinks?.linkedin || "",
        twitter: data.socialLinks?.twitter || "",
        portfolio: data.socialLinks?.portfolio || "",
      },
      hobbiesAndInterests: data.hobbiesAndInterests || [],
      languages: data.languages || [],
      emailAddress: data.emailAddress || "",
      phoneNumber: data.phoneNumber || "",
      points: data.points || 0,
      orderHistory: data.orderHistory || [],
      likedProducts: data.likedProducts || [],
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date(),
    } as UserProfile;
  });
}
