import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import { collection, doc, initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { FirestoreCollections } from './src/interfaces';

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
export const firestore = initializeFirestore(app, {
  experimentalForceLongPolling: true
});
export const storage = getStorage(app);

export const userDocumentRef = (uid: string) => doc(firestore, `authUsers`, uid);

export const authUsersCollectionRef = collection(firestore, FirestoreCollections.authUsers);

export const soloCosplayPersonsCollectionRef = collection(
  firestore,
  FirestoreCollections.soloCosplayPersons
);
export const soloCosplayCriteriaCollectionRef = collection(
  firestore,
  FirestoreCollections.soloCosplayCriteria
);
export const soloCosplayResultsCollectionRef = collection(
  firestore,
  FirestoreCollections.soloCosplayResults
);

export const cosplayTeamsCollectionRef = collection(firestore, FirestoreCollections.cosplayTeams);
export const cosplayTeamCriteriaCollectionRef = collection(
  firestore,
  FirestoreCollections.cosplayTeamCriteria
);
export const cosplayTeamResultsCollectionRef = collection(
  firestore,
  FirestoreCollections.cosplayTeamResults
);

export const kPopTeamsCollectionRef = collection(firestore, FirestoreCollections.kPopTeams);
export const kPopTeamCriteriaCollectionRef = collection(
  firestore,
  FirestoreCollections.kPopTeamCriteria
);
export const kPopTeamResultsCollectionRef = collection(
  firestore,
  FirestoreCollections.kPopTeamResults
);

export const kPopSoloCollectionRef = collection(firestore, FirestoreCollections.kPopSolo);
export const kPopSoloCriteriaCollectionRef = collection(
  firestore,
  FirestoreCollections.kPopSoloCriteria
);
export const kPopSoloResultsCollectionRef = collection(
  firestore,
  FirestoreCollections.kPopSoloResults
);
