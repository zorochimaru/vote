import { CollectionReference, DocumentReference, getDoc, getDocs } from 'firebase/firestore';

export const getList = async <T>(
  collectionRef: CollectionReference,
  order: 'asc' | 'desc' = 'asc'
): Promise<T[]> => {
  const docsSnap = await getDocs(collectionRef);
  if (order === 'desc') {
    return docsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T).reverse();
  }
  return docsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
};

export const getDocument = async <T>(documentRef: DocumentReference): Promise<T> => {
  const doc = await getDoc(documentRef);
  return { id: doc.id, ...doc.data() } as T;
};
