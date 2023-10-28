import { FC } from 'react';
import { Character } from '../../../interfaces';
import classes from './charachter-pick.module.css';

const CharachterPick: FC<{ isActive?: boolean; charachter: Character }> = ({
  isActive,
  charachter
}) => {
  return (
    <div className={`${classes.charContainer} ${isActive && classes.isActive} ${classes.rated}`}>
      <span className={classes.orderNumber}>{charachter.orderNumber}</span>
      <img src={charachter.image} alt={charachter.characterName} />
    </div>
  );
};

export default CharachterPick;
