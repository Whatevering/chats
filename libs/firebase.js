import admin from "firebase-admin";
import serviceAccount from "../firebase-admin.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
export const auth = admin.auth();
export const db = admin.firestore();
