import {
  cosplayTeamCriteriaCollectionRef,
  cosplayTeamResultsCollectionRef,
  cosplayTeamsCollectionRef
} from '../../../firebase';
import CharachterPick from '../../components/CharachterPick/CharachterPick';
import CriteriaList from '../../components/CriteriaList/CriteriaList';
import InfoRow from '../../components/InfoRow/InfoRow';
import { useVote } from '../../hooks/useVote';
import { TeamFirestore } from '../../interfaces';
import classes from '../../styles/vote-page.module.css';

const TeamCosplayVote = () => {
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
  ] = useVote<TeamFirestore>(
    cosplayTeamsCollectionRef,
    cosplayTeamCriteriaCollectionRef,
    cosplayTeamResultsCollectionRef
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
          <img
            src={selectedCharachter?.image || 'gs.logo.white-mini.png'}
            alt={selectedCharachter?.name}
          />
        </div>
        <div className={classes.info}>
          <h2>Description</h2>
          <InfoRow label="Name" value={selectedCharachter?.name || ''} />
          <InfoRow label="Fandom" value={selectedCharachter?.fandom || ''} />
          <InfoRow label="Fandom Type" value={selectedCharachter?.fandomType || ''} />
          <InfoRow label="Costume Type" value={selectedCharachter?.costumeType || ''} />
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

export default TeamCosplayVote;
