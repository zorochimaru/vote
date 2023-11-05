import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import { collection, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASECONFIG_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASECONFIG_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASECONFIG_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASECONFIG_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASECONFIG_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASECONFIG_APP_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);

export const soloCosplayPersonsCollectionRef = collection(firestore, `soloCosplayPersons`);
export const soloCosplayCriteriaCollectionRef = collection(firestore, `soloCosplayCriterias`);
export const soloCosplayResultsCollectionRef = collection(firestore, `soloCosplayResults`);
