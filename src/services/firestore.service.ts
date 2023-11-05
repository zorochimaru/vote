import { CollectionReference, getDocs } from 'firebase/firestore';

export const getList = async <T>(collectionRef: CollectionReference): Promise<T[]> => {
  const docsSnap = await getDocs(collectionRef);
  return docsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
};
