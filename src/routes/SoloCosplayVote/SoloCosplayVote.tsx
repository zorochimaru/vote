import { addDoc, serverTimestamp } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import {
  soloCosplayCriteriaCollectionRef,
  soloCosplayPersonsCollectionRef,
  soloCosplayResultsCollectionRef
} from '../../../firebase';
import { useUser } from '../../contexts/AuthContext';
import { BasicLibFirestore, CharacterFirestore, Rate } from '../../interfaces';
import { getList } from '../../services/firestore.service';
import CharachterPick from './components/CharachterPick/CharachterPick';
import CriteriaList from './components/CriteriaList';
import InfoRow from './components/InfoRow';
import classes from './solo-cosplay-vote.module.css';

const SoloCosplayVote = () => {
  const { user } = useUser();
  const [selectedCharachter, setSelectedCharachter] = useState<CharacterFirestore>();
  const [soloCosplayCriteria, setSoloCosplayCriteria] = useState<BasicLibFirestore[]>([]);
  const [characters, setCharacters] = useState<CharacterFirestore[]>([]);
  const [rateResults, setRateResults] = useState<Map<string, Rate[]>>(new Map());
  const [showSubmitButton, setShowSubmitButton] = useState<boolean>(false);

  const isActiveCharacter = useCallback(
    (id: string): boolean => {
      return selectedCharachter?.id === id;
    },
    [selectedCharachter]
  );

  const isRated = useCallback(
    (id: string): boolean => {
      return rateResults.has(id) && [...rateResults.get(id)!].length === soloCosplayCriteria.length;
    },
    [rateResults, soloCosplayCriteria]
  );

  const fetchChars = useCallback(async () => {
    try {
      const chars = await getList<CharacterFirestore>(soloCosplayPersonsCollectionRef, 'desc');
      setCharacters(chars.sort((a, b) => a.orderNumber - b.orderNumber));
      setSelectedCharachter(chars[0]);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchCriteria = useCallback(async () => {
    try {
      const criteria = await getList<BasicLibFirestore>(soloCosplayCriteriaCollectionRef);
      setSoloCosplayCriteria(criteria);
    } catch (error) {
      console.error(error);
    }
  }, []);

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

  const submitHandler = useCallback(async () => {
    if (selectedCharachter) {
      const reqs = [];
      for (const [personId, results] of [...rateResults.entries()]) {
        reqs.push(
          addDoc(soloCosplayResultsCollectionRef, {
            createdAt: serverTimestamp(),
            createdBy: user?.id,
            personId,
            results
          })
        );
      }
      await Promise.all(reqs);
    } else {
      alert('Select character!');
    }
  }, [rateResults, user, selectedCharachter]);

  const selectCharachter = useCallback((character: CharacterFirestore) => {
    setSelectedCharachter(character);
  }, []);

  const selectedCharachtersRate = useCallback(
    (criteriaId: string): number => {
      const res = rateResults.has(selectedCharachter!.id)
        ? rateResults.get(selectedCharachter!.id)!
        : [];
      return res.find((x) => x.criteriaId === criteriaId)?.value || 0;
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

  return (
    <div className={classes.wrapper}>
      <div className={classes.descWrapper}>
        <div className={classes.rating}>
          <h2>Rating</h2>
          <div className={classes.questionsWrapper}>
            {soloCosplayCriteria.map((criteria) => (
              <CriteriaList
                key={criteria.id}
                label={criteria.label}
                value={selectedCharachtersRate(criteria.id)}
                onChange={(value) => patchResults(criteria.id, value)}
              />
            ))}
          </div>

          {showSubmitButton && (
            <button type="button" onClick={submitHandler} className={classes.submitBtn}>
              Submit
            </button>
          )}
        </div>
        <div className={classes.avatar}>
          <img src={selectedCharachter?.image} alt={selectedCharachter?.name} />
        </div>
        <div className={classes.info}>
          <h2>Description</h2>
          <InfoRow label="Char name" value={selectedCharachter?.characterName || ''} />
          <InfoRow label="Real Name" value={selectedCharachter?.name || ''} />
          <InfoRow label="Fandom" value={selectedCharachter?.fandom || ''} />
          <InfoRow label="Fandom Type" value={selectedCharachter?.fandomType || ''} />
          <InfoRow label="Self made" value={selectedCharachter?.selfMade || false} />
          <InfoRow label="Description" value={selectedCharachter?.description || ''} />
        </div>
      </div>

      <div className={classes.charsWrapper}>
        {characters.map((character) => (
          <CharachterPick
            key={character.id}
            onClick={selectCharachter}
            rated={isRated(character.id)}
            isActive={isActiveCharacter(character.id)}
            character={character}
          />
        ))}
      </div>
    </div>
  );
};

export default SoloCosplayVote;
