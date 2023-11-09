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
import { BasicLibFirestore, CommonFirestoreWithOrder, Rate } from '../interfaces';
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
  (criteriaId: string, value: number) => void,
  boolean,
  () => void
] => {
  const { user } = useUser();
  const confirm = useConfirm();
  const navigate = useNavigate();

  const [selectedCharacter, setSelectedCharachter] = useState<T>();
  const [characters, setCharacters] = useState<T[]>([]);
  const [soloCosplayCriteria, setSoloCosplayCriteria] = useState<BasicLibFirestore[]>([]);
  const [rateResults, setRateResults] = useState<Map<string, Rate[]>>(new Map());
  const [showSubmitButton, setShowSubmitButton] = useState<boolean>(false);

  const selectedCharactersRate = useCallback(
    (criteriaId: string): number => {
      const res = rateResults.has(selectedCharacter!.id)
        ? rateResults.get(selectedCharacter!.id)!
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
      return rateResults.has(id) && [...rateResults.get(id)!].length === soloCosplayCriteria.length;
    },
    [rateResults, soloCosplayCriteria]
  );

  const handleSubmit = () => {
    confirm()
      .then(() => {
        saveResults();
      })
      .catch(() => {});
  };

  const saveResults = useCallback(async () => {
    try {
      for (const [personId, results] of [...rateResults.entries()]) {
        addDoc(resultsCollectionRef, {
          createdAt: serverTimestamp(),
          createdBy: user?.id,
          personId,
          results
        });
      }

      switch (personsCollectionRef.id) {
        case 'soloCosplayPersons':
          updateDoc(userDocumentRef(user!.id), { soloCosplayFinished: true });
          break;
        case 'cosplayTeam':
          updateDoc(userDocumentRef(user!.id), { teamCosplayFinished: true });
          break;
        case 'kPopTeams':
          updateDoc(userDocumentRef(user!.id), { kPopFinished: true });
          break;
        default:
          break;
      }

      sessionStorage.removeItem(`${personsCollectionRef.id}`);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  }, [rateResults, user, personsCollectionRef, resultsCollectionRef, navigate]);

  const patchResults = useCallback(
    (criteriaId: string, value: number) => {
      if (rateResults.has(selectedCharacter!.id)) {
        const currRes = rateResults.get(selectedCharacter!.id)!;
        const currCriteriaRes = currRes.findIndex((x) => x.criteriaId === criteriaId);
        if (currCriteriaRes !== -1) {
          currRes.splice(currCriteriaRes, 1, { criteriaId, value });
          setRateResults((prev) => new Map(prev.set(selectedCharacter!.id, [...currRes])));
        } else {
          setRateResults(
            (prev) => new Map(prev.set(selectedCharacter!.id, [...currRes, { criteriaId, value }]))
          );
        }
      } else {
        setRateResults((prev) => new Map(prev.set(selectedCharacter!.id, [{ criteriaId, value }])));
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
      [...rateResults.values()].every((x) => x.length === soloCosplayCriteria.length);
    setShowSubmitButton(allCharsHasFilled);
  }, [characters, rateResults, soloCosplayCriteria]);

  useEffect(() => {
    const allCharsHasFilled =
      characters.length === rateResults.size &&
      [...rateResults.values()].every((x) => x.length === soloCosplayCriteria.length);
    setShowSubmitButton(allCharsHasFilled);
  }, [characters, rateResults, soloCosplayCriteria]);

  useEffect(() => {
    const tempResults = sessionStorage.getItem(`${personsCollectionRef.id}`);
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
    sessionStorage.setItem(`${personsCollectionRef.id}`, JSON.stringify([...rateResults]));
  }, [rateResults, personsCollectionRef]);

  return [
    characters,
    selectedCharacter,
    setCharacter,
    isActiveCharacter,
    selectedCharactersRate,
    isRated,
    soloCosplayCriteria,
    patchResults,
    showSubmitButton,
    handleSubmit
  ];
};
