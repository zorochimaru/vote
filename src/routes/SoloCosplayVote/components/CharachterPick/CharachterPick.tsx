import { FC } from 'react';
import { CharacterFirestore } from '../../../../interfaces';
import classes from './charachter-pick.module.css';

const CharachterPick: FC<{
  isActive?: boolean;
  rated?: boolean;
  character: CharacterFirestore;
  onClick: (character: CharacterFirestore) => void;
}> = ({ isActive, character: character, rated, onClick }) => {
  return (
    <button
      onClick={() => onClick(character)}
      className={`${classes.charContainer} ${isActive && classes.isActive} ${
        rated && classes.rated
      }`}>
      <span className={classes.orderNumber}>{character.orderNumber}</span>
      <img src={character.image} alt={character.characterName} />
    </button>
  );
};

export default CharachterPick;
