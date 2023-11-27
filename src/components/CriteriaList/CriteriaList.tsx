import { Rating } from '@mui/material';
import { FunctionComponent, useEffect, useState } from 'react';
import classes from '../../styles/vote-page.module.css';

const CriteriaList: FunctionComponent<{
  label: string;
  value: number;
  onChange: (value: number) => void;
}> = ({ label, onChange, value }) => {
  const [rate, setRate] = useState<number | null>(value);

  useEffect(() => {
    setRate(value);
  }, [value]);

  return (
    <div className={classes.row}>
      <div className={classes.column}>{label}</div>
      <div className={classes.column}>
        <Rating
          size="large"
          name="rating"
          value={rate}
          onChange={(_event, newValue) => {
            setRate(newValue);
            onChange(newValue || 0);
          }}
        />
      </div>
    </div>
  );
};

export default CriteriaList;
