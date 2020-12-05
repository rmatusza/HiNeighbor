import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { GiPathDistance } from "react-icons/gi";

const Distance = () => {

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} variant="contained" color="primary">
        <GiPathDistance /> Distance
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>0 - 5 mi</MenuItem>
        <MenuItem onClick={handleClose}>5 - 10 mi</MenuItem>
        <MenuItem onClick={handleClose}>10 - 20 mi</MenuItem>
        <MenuItem onClick={handleClose}>20 mi +</MenuItem>
      </Menu>
    </div>
  );
}


export default Distance;
