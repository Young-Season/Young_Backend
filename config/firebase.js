import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import "firebase/firestore";
import secrets from "../secrets.json" assert { type: "json" };
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: secrets.API_KEY,
  authDomain: secrets.AUTH_DOMAIN,
  projectId: secrets.PROJECT_ID,
  storageBucket: secrets.STORAGE_BUCKET,
  messagingSenderId: secrets.MESSAGING_SENDER_ID,
  appId: secrets.APP_ID,
  measurementId: secrets.MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db;
