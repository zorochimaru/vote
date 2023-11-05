import { useCallback, useEffect, useState } from 'react';
import {
  soloCosplayCriteriaCollectionRef,
  soloCosplayPersonsCollectionRef,
  soloCosplayResultsCollectionRef
} from '../../../firebase';
import CharachterPick from '../../components/UI/CharachterPick/CharachterPick';
import { useUser } from '../../contexts/AuthContext';
import { BasicLibFirestore, CharacterFirestore, Rate, Result } from '../../interfaces';
import { getList } from '../../services/firestore.service';
import CriteriaList from './components/CriteriaList';
import InfoRow from './components/InfoRow';
import classes from './home.module.css';
import { addDoc, serverTimestamp } from 'firebase/firestore';

const Home = () => {
  const [selectedCharachter, setSelectedCharachter] = useState<CharacterFirestore | null>(null);
  const [soloCosplayCriteria, setSoloCosplayCriteria] = useState<BasicLibFirestore[]>([]);
  const { user } = useUser();
  const [characters, setCharacters] = useState<CharacterFirestore[]>([]);
  const [rates, setRates] = useState<Map<string, Rate>>(new Map());

  const isActiveCharacter = (id: string): boolean => {
    return selectedCharachter?.id === id;
  };

  const fetchChars = useCallback(async () => {
    try {
      const chars = await getList<CharacterFirestore>(soloCosplayPersonsCollectionRef);
      setCharacters(chars);
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

  useEffect(() => {
    fetchChars();
    fetchCriteria();
  }, [fetchChars, fetchCriteria]);

  const patchResults = (criteriaId: string, value: number) => {
    setRates(new Map<string, Rate>(rates.set(criteriaId, { criteriaId, value })));
  };

  const submitHandler = async () => {
    if (selectedCharachter) {
      const results: Result = {
        personId: selectedCharachter.id,
        results: [...rates.keys()].map((k) => rates.get(k)!)
      };
      await addDoc(soloCosplayResultsCollectionRef, {
        createdAt: serverTimestamp(),
        createdBy: user?.uid,
        ...results
      });
    } else {
      alert('Select character!');
    }
  };

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
                onChange={(value) => patchResults(criteria.id, value)}
              />
            ))}
          </div>

          <button type="button" onClick={submitHandler} className={classes.submitBtn}>
            Submit
          </button>
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
        {characters.map((charachter) => (
          <CharachterPick
            key={charachter.id}
            onClick={setSelectedCharachter}
            isActive={isActiveCharacter(charachter.id)}
            charachter={charachter}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
