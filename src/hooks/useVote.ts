import { CollectionReference, DocumentData, addDoc, serverTimestamp } from 'firebase/firestore';
import { useConfirm } from 'material-ui-confirm';
import { useCallback, useEffect, useState } from 'react';
import { soloCosplayResultsCollectionRef } from '../../firebase';
import { useUser } from '../contexts/AuthContext';
import { BasicLibFirestore, Rate } from '../interfaces';
import { CommonFireStoreDocument } from '../interfaces/common-firesotre.interface';
import { getList } from '../services/firestore.service';

interface VoteHook extends CommonFireStoreDocument {
  orderNumber: number;
}

export const useVote = <T extends VoteHook>(
  personsCollectionRef: CollectionReference<DocumentData, DocumentData>,
  criteriaCollectionRef: CollectionReference<DocumentData, DocumentData>
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

  const [selectedCharachter, setSelectedCharachter] = useState<T>();
  const [characters, setCharacters] = useState<T[]>([]);
  const [soloCosplayCriteria, setSoloCosplayCriteria] = useState<BasicLibFirestore[]>([]);
  const [rateResults, setRateResults] = useState<Map<string, Rate[]>>(new Map());
  const [showSubmitButton, setShowSubmitButton] = useState<boolean>(false);

  const selectedCharachtersRate = useCallback(
    (criteriaId: string): number => {
      const res = rateResults.has(selectedCharachter!.id)
        ? rateResults.get(selectedCharachter!.id)!
        : [];
      return res.find((x) => x.criteriaId === criteriaId)?.value || 0;
    },
    [selectedCharachter, rateResults]
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
      return selectedCharachter?.id === id;
    },
    [selectedCharachter]
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
      const resultRequests = [];
      for (const [personId, results] of [...rateResults.entries()]) {
        resultRequests.push(
          addDoc(soloCosplayResultsCollectionRef, {
            createdAt: serverTimestamp(),
            createdBy: user?.id,
            personId,
            results
          })
        );
      }

      await Promise.all(resultRequests);
      localStorage.removeItem('soloCosplayResultsTemp');
    } catch (error) {
      console.error(error);
    }
  }, [rateResults, user]);

  const patchResults = useCallback(
    (criteriaId: string, value: number) => {
      if (rateResults.has(selectedCharachter!.id)) {
        const currRes = rateResults.get(selectedCharachter!.id)!;
        const currCriteriaRes = currRes.findIndex((x) => x.criteriaId === criteriaId);
        if (currCriteriaRes !== -1) {
          currRes.splice(currCriteriaRes, 1, { criteriaId, value });
          setRateResults((prev) => new Map(prev.set(selectedCharachter!.id, [...currRes])));
        } else {
          setRateResults(
            (prev) => new Map(prev.set(selectedCharachter!.id, [...currRes, { criteriaId, value }]))
          );
        }
      } else {
        setRateResults(
          (prev) => new Map(prev.set(selectedCharachter!.id, [{ criteriaId, value }]))
        );
      }
    },
    [selectedCharachter, rateResults]
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
    const tempResults = localStorage.getItem('soloCosplayResultsTemp');
    const arrayResults: [string, Rate[]] = JSON.parse(tempResults || '[]');
    if (arrayResults.length) {
      const tempRes = new Map();
      arrayResults.forEach(([key, value]) => {
        tempRes.set(key, value);
      });
      setRateResults(tempRes);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('soloCosplayResultsTemp', JSON.stringify([...rateResults]));
  }, [rateResults]);

  return [
    characters,
    selectedCharachter,
    setCharacter,
    isActiveCharacter,
    selectedCharachtersRate,
    isRated,
    soloCosplayCriteria,
    patchResults,
    showSubmitButton,
    handleSubmit
  ];
};
