import { Button } from '@mui/material';
import {
  soloCosplayCriteriaCollectionRef,
  soloCosplayPersonsCollectionRef,
  soloCosplayResultsCollectionRef
} from '../../../firebase';
import CharachterPick from '../../components/CharachterPick/CharachterPick';
import CriteriaList from '../../components/CriteriaList/CriteriaList';
import InfoRow from '../../components/InfoRow/InfoRow';
import ZoomImage from '../../components/ZoomImage/ZoomImage';
import { useVote } from '../../hooks/useVote';
import { CharacterFirestore } from '../../interfaces';
import classes from '../../styles/vote-page.module.css';

const SoloCosplayVote = () => {
  const [
    characters,
    selectedCharacter,
    setCharacter,
    isActiveCharacter,
    selectedCharachtersRate,
    isRated,
    soloCosplayCriteria,
    patchResults,
    showSubmitButton,
    handleSubmit,
    skipCharacter,
    nextCharacter,
    prevCharacter
  ] = useVote<CharacterFirestore>(
    soloCosplayPersonsCollectionRef,
    soloCosplayCriteriaCollectionRef,
    soloCosplayResultsCollectionRef
  );

  return (
    <div className={classes.wrapper}>
      <div className={classes.descWrapper}>
        <div className={classes.rating}>
          <h2>Rating</h2>
          <div className={classes.actionWrapper}>
            {showSubmitButton ? (
              <button type="button" onClick={handleSubmit} className={classes.submitBtn}>
                Submit
              </button>
            ) : (
              <button type="button" className={classes.skipBtn} onClick={skipCharacter}>
                Skip 🙅‍♂️
              </button>
            )}
            <div style={{ display: 'flex', gap: '30px' }}>
              <Button
                type="button"
                style={{ paddingInline: '40px' }}
                variant="contained"
                onClick={prevCharacter}>
                Prev
              </Button>
              <Button
                type="button"
                style={{ paddingInline: '40px' }}
                variant="contained"
                onClick={nextCharacter}>
                Next
              </Button>
            </div>
          </div>

          <div className={classes.questionsWrapper}>
            {soloCosplayCriteria
              ?.sort((a, b) => a.order - b.order)
              ?.map((criteria) => (
                <CriteriaList
                  key={criteria.id}
                  label={criteria.label}
                  value={selectedCharachtersRate(criteria.id)}
                  onChange={(value) => patchResults(criteria.id, criteria.label, value)}
                />
              ))}
          </div>
        </div>
        <div className={classes.avatar}>
          <ZoomImage url={selectedCharacter?.image || ''} />
        </div>
        <div className={classes.info}>
          <h2>Description</h2>
          <InfoRow label="Registration type" value={selectedCharacter?.registrationType || ''} />
          <InfoRow label="Character name" value={selectedCharacter?.characterName || ''} />
          <InfoRow label="Name" value={selectedCharacter?.name || ''} />
          <InfoRow label="Fandom" value={selectedCharacter?.fandom || ''} />
          <InfoRow label="Fandom Type" value={selectedCharacter?.fandomType || ''} />
          <InfoRow label="Costume Type" value={selectedCharacter?.costumeType || ''} />
        </div>
      </div>

      <div className={classes.charsWrapper}>
        {characters.map((character) => (
          <CharachterPick
            key={character.id}
            onClick={setCharacter}
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
