import { db } from "@/lib/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";

export const generateSearchTerms = (displayName: string, email: string) => {
  const terms = new Set<string>();
  const addTerms = (input: string) => {
    const words = input.toLowerCase().split(/\s+/);
    words.forEach((word) => {
      for (let i = 1; i <= word.length; i++) {
        terms.add(word.substring(0, i));
      }
    });
  };

  addTerms(displayName);
  addTerms(email.split("@")[0]); // Add username part of email

  return Array.from(terms);
};

export const createUserProfile = async (userId: string, userData: any) => {
  const { displayName, email } = userData;
  const searchTerms = generateSearchTerms(displayName, email);

  await setDoc(doc(db, "profiles", userId), {
    ...userData,
    searchTerms,
  });
};

export const updateUserProfile = async (userId: string, userData: any) => {
  const { displayName, email } = userData;
  const searchTerms = generateSearchTerms(displayName, email);

  await updateDoc(doc(db, "profiles", userId), {
    ...userData,
    searchTerms,
  });
};
