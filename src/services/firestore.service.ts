import { CollectionReference, DocumentReference, doc, getDoc, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { FirestoreCollections } from '../interfaces';

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

export const getDocument = async <T>(documentRef: DocumentReference): Promise<T | null> => {
  const doc = await getDoc(documentRef);
  return doc.exists() ? ({ id: doc.id, ...doc.data() } as T) : null;
};

export const getDocumentRef = (collectionRef: FirestoreCollections, id: string) =>
  doc(firestore, collectionRef, id);
