// firebase-config.ts
import { initializeApp, getApps } from "firebase/app";
import { getMessaging, Messaging } from "firebase/messaging";

// Firebase Config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Initialize Firebase only once
export const app = !getApps().length 
  ? initializeApp(firebaseConfig)
  : getApps()[0];

// Messaging must be browser-side only
export const messaging = typeof window !== "undefined"
  ? getMessaging(app)
  : (null as unknown as Messaging);
