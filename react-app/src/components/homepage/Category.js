import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { GiHamburgerMenu } from "react-icons/gi";
import { setCategory } from '../../actions/searchCategoryActions';

const Category = () => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [category, setCategory] = useState('')

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className='category-contents'>
      <span>
        <h2>
          Category
        </h2>
      </span>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        <GiHamburgerMenu />
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Users</MenuItem>
        <MenuItem onClick={handleClose}>Electronics</MenuItem>
        <MenuItem onClick={handleClose}>Books</MenuItem>
        <MenuItem onClick={handleClose}>Home and Garden</MenuItem>
        <MenuItem onClick={handleClose}>Ancient Relics of the Past that Contain Forbidden Knowledge and Immeasurable Power</MenuItem>
      </Menu>
    </div>
  );
}

export default Category;
