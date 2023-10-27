import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASECONFIG_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASECONFIG_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASECONFIG_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASECONFIG_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASECONFIG_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASECONFIG_APP_ID
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
