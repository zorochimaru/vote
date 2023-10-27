import React from 'react';

import classes from './icon.module.css';
const Sprite = import.meta.env.BASE_URL + 'sprite.svg';

type IconProps = {
  icon: string;
  color?: string;
  size?: number;
};

const Icon: React.FC<IconProps> = ({ icon, color = 'white', size = 24 }) => (
  <svg className={classes.svgIcon} fill={color} width={size} height={size}>
    <use href={`${Sprite}#${icon}`} />
  </svg>
);

export default Icon;
