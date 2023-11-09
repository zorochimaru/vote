import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import { collection, doc, getFirestore } from 'firebase/firestore';

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

export const userDocumentRef = (uid: string) => doc(firestore, `authUsers`, uid);

export const soloCosplayPersonsCollectionRef = collection(firestore, `soloCosplayPersons`);
export const soloCosplayCriteriaCollectionRef = collection(firestore, `soloCosplayCriteria`);
export const soloCosplayResultsCollectionRef = collection(firestore, `soloCosplayResults`);

export const cosplayTeamsCollectionRef = collection(firestore, `cosplayTeam`);
export const cosplayTeamCriteriaCollectionRef = collection(firestore, `cosplayTeamCriteria`);
export const cosplayTeamResultsCollectionRef = collection(firestore, `cosplayTeamResults`);

export const kPopTeamsCollectionRef = collection(firestore, `kPopTeams`);
export const kPopTeamCriteriaCollectionRef = collection(firestore, `kPopTeamCriteria`);
export const kPopTeamResultsCollectionRef = collection(firestore, `kPopTeamResults`);
