import { FC } from 'react';
import { CharacterFirestore } from '../../../interfaces';
import classes from './charachter-pick.module.css';

const CharachterPick: FC<{
  isActive?: boolean;
  charachter: CharacterFirestore;
  onClick: (id: CharacterFirestore) => void;
}> = ({ isActive, charachter, onClick }) => {
  return (
    <button
      onClick={() => onClick(charachter)}
      className={`${classes.charContainer} ${isActive && classes.isActive} ${classes.rated}`}>
      <span className={classes.orderNumber}>{charachter.orderNumber}</span>
      <img src={charachter.image} alt={charachter.characterName} />
    </button>
  );
};

export default CharachterPick;
