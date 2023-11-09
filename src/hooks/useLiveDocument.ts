import { DocumentData, DocumentReference, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { CommonFireStoreDocument } from '../interfaces';

export const useLiveDocument = <T extends CommonFireStoreDocument>(
  documentRef: DocumentReference<DocumentData, DocumentData>
): [T | null] => {
  const [document, setDocument] = useState<T | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(documentRef, (doc) => {
      setDocument(doc.data() as T);
    });
    return () => {
      unsub();
    };
  }, [documentRef]);

  return [document];
};
