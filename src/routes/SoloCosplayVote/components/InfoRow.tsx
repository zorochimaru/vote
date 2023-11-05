import { FunctionComponent } from 'react';
import classes from '../solo-cosplay-vote.module.css';

const InfoRow: FunctionComponent<{ label: string; value: string | boolean }> = ({
  label,
  value
}) => {
  return (
    <div className={classes.row}>
      <div className={classes.column}>{label}</div>
      <div className={classes.column}>
        {typeof value === 'boolean' ? (value ? 'yes' : 'no') : value}
      </div>
    </div>
  );
};

export default InfoRow;
