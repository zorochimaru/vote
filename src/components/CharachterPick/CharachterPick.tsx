import { CommonFirestoreWithOrder as CommonVote } from '../../interfaces';
import classes from './charachter-pick.module.css';

const CharachterPick = <T extends CommonVote>({
  isActive,
  character,
  rated,
  onClick
}: {
  isActive?: boolean;
  rated?: boolean;
  character: T;
  onClick: (character: T) => void;
}) => {
  return (
    <button
      onClick={() => onClick(character)}
      className={`${classes.charContainer} ${isActive && classes.isActive} ${
        rated && classes.rated
      }`}>
      <span className={classes.orderNumber}>{character.orderNumber}</span>
      <img src={character?.image || 'gs.logo.white-mini.png'} alt={character.name} />
    </button>
  );
};

export default CharachterPick;
