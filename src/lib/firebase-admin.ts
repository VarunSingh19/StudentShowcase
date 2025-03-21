import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin for server components
function initializeFirebaseAdmin() {
  const apps = getApps();

  if (!apps.length) {
    // Check if we have the service account credentials
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      console.error(
        "FIREBASE_SERVICE_ACCOUNT_KEY environment variable not set"
      );
      return null;
    }

    try {
      // Parse the service account JSON
      const serviceAccount = JSON.parse(
        Buffer.from(
          process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
          "base64"
        ).toString()
      );

      initializeApp({
        credential: cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });
    } catch (error) {
      console.error("Error initializing Firebase Admin:", error);
      return null;
    }
  }

  return getFirestore();
}

// Export the Firestore instance
export const adminDb = initializeFirebaseAdmin();
