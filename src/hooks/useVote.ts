import {
  CollectionReference,
  DocumentData,
  addDoc,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { useConfirm } from 'material-ui-confirm';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userDocumentRef } from '../../firebase';
import { useUser } from '../contexts/AuthContext';
import { useLoading } from '../contexts/LoadingContext';
import {
  BasicLibFirestore,
  CommonFirestoreWithOrder,
  FirestoreCollections,
  Rate
} from '../interfaces';
import { getList } from '../services/firestore.service';

export const useVote = <T extends CommonFirestoreWithOrder>(
  personsCollectionRef: CollectionReference<DocumentData, DocumentData>,
  criteriaCollectionRef: CollectionReference<DocumentData, DocumentData>,
  resultsCollectionRef: CollectionReference<DocumentData, DocumentData>
): [
  T[],
  T | undefined,
  (item: T) => void,
  (id: string) => boolean,
  (criteriaId: string) => number,
  (id: string) => boolean,
  BasicLibFirestore[],
  (criteriaId: string, criteria: string, value: number) => void,
  boolean,
  () => void
] => {
  const { user } = useUser();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const [selectedCharacter, setSelectedCharachter] = useState<T>();
  const [characters, setCharacters] = useState<T[]>([]);
  const [cosplayCriteria, setSoloCosplayCriteria] = useState<BasicLibFirestore[]>([]);
  const [rateResults, setRateResults] = useState<Map<string, Rate[]>>(new Map());
  const [showSubmitButton, setShowSubmitButton] = useState<boolean>(false);

  const selectedCharactersRate = useCallback(
    (criteriaId: string): number => {
      const res = rateResults.has(selectedCharacter?.id || '')
        ? rateResults.get(selectedCharacter?.id || '')!
        : [];
      return res.find((x) => x.criteriaId === criteriaId)?.value || 0;
    },
    [selectedCharacter, rateResults]
  );

  const fetchChars = useCallback(async () => {
    try {
      const chars = await getList<T>(personsCollectionRef, 'desc');
      setCharacters(chars.sort((a, b) => a.orderNumber - b.orderNumber));
      setSelectedCharachter(chars[0]);
    } catch (error) {
      console.error(error);
    }
  }, [personsCollectionRef]);

  const fetchCriteria = useCallback(async () => {
    try {
      const criteria = await getList<BasicLibFirestore>(criteriaCollectionRef);
      setSoloCosplayCriteria(criteria);
    } catch (error) {
      console.error(error);
    }
  }, [criteriaCollectionRef]);

  const isActiveCharacter = useCallback(
    (id: string): boolean => {
      return selectedCharacter?.id === id;
    },
    [selectedCharacter]
  );

  const setCharacter = useCallback((character: T) => {
    setSelectedCharachter(character);
  }, []);

  const isRated = useCallback(
    (id: string): boolean => {
      return rateResults.has(id) && [...rateResults.get(id)!].length === cosplayCriteria.length;
    },
    [rateResults, cosplayCriteria]
  );

  const handleSubmit = async () => {
    try {
      await confirm();
      await saveResults();
    } catch (error) {
      console.error(error);
    }
  };

  const saveResults = useCallback(async () => {
    setLoading(true);
    try {
      for (const [personId, results] of [...rateResults.entries()]) {
        await addDoc(resultsCollectionRef, {
          createdAt: serverTimestamp(),
          createdBy: user?.id,
          personId,
          personNickname: characters.find((x) => x.id === personId)?.name || '',
          results
        });
      }

      switch (personsCollectionRef.id) {
        case FirestoreCollections.soloCosplayPersons:
          await updateDoc(userDocumentRef(user!.id), { soloCosplayFinished: true });
          break;
        case FirestoreCollections.cosplayTeams:
          await updateDoc(userDocumentRef(user!.id), { teamCosplayFinished: true });
          break;
        case FirestoreCollections.kPopTeams:
          await updateDoc(userDocumentRef(user!.id), { kPopFinished: true });
          break;
        default:
          break;
      }

      localStorage.removeItem(`${personsCollectionRef.id}`);
      setLoading(false);
      navigate('/');
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }, [
    rateResults,
    user,
    personsCollectionRef,
    resultsCollectionRef,
    navigate,
    characters,
    setLoading
  ]);

  const patchResults = useCallback(
    (criteriaId: string, criteria: string, value: number) => {
      if (rateResults.has(selectedCharacter?.id || '')) {
        const currRes = rateResults.get(selectedCharacter?.id || '')!;
        const currCriteriaRes = currRes.findIndex((x) => x.criteriaId === criteriaId);
        if (currCriteriaRes !== -1) {
          currRes.splice(currCriteriaRes, 1, { criteriaId, value, criteria });
          setRateResults((prev) => new Map(prev.set(selectedCharacter?.id || '', [...currRes])));
        } else {
          setRateResults(
            (prev) =>
              new Map(
                prev.set(selectedCharacter?.id || '', [...currRes, { criteriaId, value, criteria }])
              )
          );
        }
      } else {
        setRateResults(
          (prev) =>
            new Map(prev.set(selectedCharacter?.id || '', [{ criteriaId, value, criteria }]))
        );
      }
    },
    [selectedCharacter, rateResults]
  );

  useEffect(() => {
    fetchChars();
    fetchCriteria();
  }, [fetchChars, fetchCriteria]);

  useEffect(() => {
    const allCharsHasFilled =
      characters.length === rateResults.size &&
      [...rateResults.values()].every((x) => x.length === cosplayCriteria.length);
    setShowSubmitButton(allCharsHasFilled);
  }, [characters, rateResults, cosplayCriteria]);

  useEffect(() => {
    const allCharsHasFilled =
      characters.length === rateResults.size &&
      [...rateResults.values()].every((x) => x.length === cosplayCriteria.length);
    setShowSubmitButton(allCharsHasFilled);
  }, [characters, rateResults, cosplayCriteria]);

  useEffect(() => {
    const tempResults = localStorage.getItem(`${personsCollectionRef.id}`);
    const arrayResults: [string, Rate[]] = JSON.parse(tempResults || '[]');
    if (arrayResults.length) {
      const tempRes = new Map();
      arrayResults.forEach(([key, value]) => {
        tempRes.set(key, value);
      });
      setRateResults(tempRes);
    }
  }, [personsCollectionRef]);

  useEffect(() => {
    localStorage.setItem(`${personsCollectionRef.id}`, JSON.stringify([...rateResults]));
  }, [rateResults, personsCollectionRef]);

  return [
    characters,
    selectedCharacter,
    setCharacter,
    isActiveCharacter,
    selectedCharactersRate,
    isRated,
    cosplayCriteria,
    patchResults,
    showSubmitButton,
    handleSubmit
  ];
};
