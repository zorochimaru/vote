import { kPopTeamCriteriaCollectionRef, kPopTeamsCollectionRef } from '../../../firebase';
import CharachterPick from '../../components/CharachterPick/CharachterPick';
import CriteriaList from '../../components/CriteriaList/CriteriaList';
import InfoRow from '../../components/InfoRow/InfoRow';
import { useVote } from '../../hooks/useVote';
import { KpopFirestore } from '../../interfaces/kpop-firestore.interface';
import classes from '../../styles/vote-page.module.css';

const KPopVote = () => {
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
    handleSubmit
  ] = useVote<KpopFirestore>(
    kPopTeamsCollectionRef,
    kPopTeamCriteriaCollectionRef,
    kPopTeamCriteriaCollectionRef
  );

  return (
    <div className={classes.wrapper}>
      <div className={classes.descWrapper}>
        <div className={classes.rating}>
          <h2>Rating</h2>
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

          {showSubmitButton && (
            <button type="button" onClick={handleSubmit} className={classes.submitBtn}>
              Submit
            </button>
          )}
        </div>
        <div className={classes.avatar}>
          <img src={selectedCharachter?.image} alt={selectedCharachter?.name} />
        </div>
        <div className={classes.info}>
          <h2>Description</h2>

          <InfoRow label="Name" value={selectedCharachter?.name || ''} />
          <InfoRow label="Track" value={selectedCharachter?.trackName || ''} />
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

export default KPopVote;
