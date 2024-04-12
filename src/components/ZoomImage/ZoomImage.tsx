import { Popover } from '@mui/material';
import React, { FunctionComponent, useState } from 'react';

const ZoomImage: FunctionComponent<{ url: string }> = ({ url }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <button
        aria-describedby={id}
        style={{
          border: 0,
          padding: 0,
          cursor: 'pointer'
        }}
        onClick={handleClick}>
        <img src={url || 'gs.logo.white-mini.png'} alt="" />
      </button>
      <Popover
        id={id}
        open={open}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        anchorEl={anchorEl}
        onClose={handleClose}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}>
        <img style={{ maxHeight: '80dvh' }} src={url || 'gs.logo.white-mini.png'} alt="" />
      </Popover>
    </>
  );
};
export default ZoomImage;
