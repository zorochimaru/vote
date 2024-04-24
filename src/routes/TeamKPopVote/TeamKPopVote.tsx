import {
  kPopTeamCriteriaCollectionRef,
  kPopTeamResultsCollectionRef,
  kPopTeamsCollectionRef
} from '../../../firebase';
import CharachterPick from '../../components/CharachterPick/CharachterPick';
import CriteriaList from '../../components/CriteriaList/CriteriaList';
import InfoRow from '../../components/InfoRow/InfoRow';
import { useVote } from '../../hooks/useVote';
import { KpopFirestore } from '../../interfaces/kpop-firestore.interface';
import classes from '../../styles/vote-page.module.css';

const TeamKPopVote = () => {
  const [
    characters,
    selectedCharachter,
    setCharacter,
    isActiveCharacter,
    selectedCharachtersRate,
    isRated,
    soloCosplayCriteria,
    patchResults,
    showSubmitButton,
    handleSubmit,
    skipCharacter
  ] = useVote<KpopFirestore>(
    kPopTeamsCollectionRef,
    kPopTeamCriteriaCollectionRef,
    kPopTeamResultsCollectionRef
  );

  return (
    <div className={classes.wrapper}>
      <div className={classes.descWrapper}>
        <div className={classes.rating}>
          <h2>Rating</h2>
          {showSubmitButton ? (
            <button type="button" onClick={handleSubmit} className={classes.submitBtn}>
              Submit
            </button>
          ) : (
            <button type="button" className={classes.skipBtn} onClick={skipCharacter}>
              Skip 🙅‍♂️
            </button>
          )}
          <div className={classes.questionsWrapper}>
            {soloCosplayCriteria?.map((criteria) => (
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
          <img src={'gs.logo.white-mini.png'} alt={selectedCharachter?.name} />
        </div>
        <div className={classes.info}>
          <h2>Description</h2>

          <InfoRow label="Name" value={selectedCharachter?.name || ''} />
          <InfoRow label="Person Count" value={selectedCharachter?.personCount || 0} />
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

export default TeamKPopVote;
