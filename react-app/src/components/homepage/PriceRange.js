import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { MdAttachMoney } from "react-icons/md";

const PriceRange = () => {

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
        <MdAttachMoney /> Price Range
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>$5 - $20</MenuItem>
        <MenuItem onClick={handleClose}>$20 - $50</MenuItem>
        <MenuItem onClick={handleClose}>$50 - $100</MenuItem>
        <MenuItem onClick={handleClose}>$100 +</MenuItem>
      </Menu>
    </div>
  );
}


export default PriceRange;
