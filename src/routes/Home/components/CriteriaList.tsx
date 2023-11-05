import { Rating } from '@mui/material';
import { FunctionComponent, useState } from 'react';
import classes from '../home.module.css';

const CriteriaList: FunctionComponent<{
  label: string;
  onChange: (value: number) => void;
}> = ({ label, onChange }) => {
  const [value, setValue] = useState<number | null>(0);

  return (
    <div className={classes.row}>
      <div className={classes.column}>{label}</div>
      <div className={classes.column}>
        <Rating
          name="rating"
          value={value}
          onChange={(_event, newValue) => {
            setValue(newValue);
            onChange(newValue || 0);
          }}
        />
      </div>
    </div>
  );
};

export default CriteriaList;
