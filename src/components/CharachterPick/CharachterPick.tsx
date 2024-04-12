import { CommonFirestoreWithOrder as CommonVote } from '../../interfaces';
import classes from './charachter-pick.module.css';

const CharachterPick = <T extends CommonVote>({
  isActive,
  character,
  rated,
  onClick,
  isWideCard
}: {
  isActive?: boolean;
  rated?: boolean;
  character: T;
  onClick: (character: T) => void;
  isWideCard?: boolean;
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={() => {
        scrollToTop();
        onClick(character);
      }}
      className={`${classes.charContainer}
       ${isWideCard && classes.wideCard}
       ${isActive && classes.isActive}
      ${rated && classes.rated}`}>
      <span className={classes.orderNumber}>{character.orderNumber}</span>
      <img src={character?.image || 'gs.logo.white-mini.png'} alt={character.name} />
    </button>
  );
};

export default CharachterPick;
