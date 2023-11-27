import { FunctionComponent } from 'react';
import classes from '../../styles/vote-page.module.css';

const InfoRow: FunctionComponent<{ label: string; value: string | boolean | number }> = ({
  label,
  value
}) => {
  return (
    <div className={classes.row}>
      <div className={classes.column}>{label}:&nbsp;</div>
      <div className={classes.column}>
        {typeof value === 'boolean' ? (value ? 'yes' : 'no') : value}
      </div>
    </div>
  );
};

export default InfoRow;
