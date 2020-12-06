import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { GiHamburgerMenu } from "react-icons/gi";
import { setCategory } from '../../actions/searchCategoryActions';
import { useDispatch, useSelector } from "react-redux";

const Category = () => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null)
  const dispatch = useDispatch();
  const options = ['Users', 'Electronics', 'Books', 'Home and Garden', 'Ancient Relics of the Past that Contain Forbidden Knowledge and Immeasurable Power']

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuItemClick = async (e, idx) => {

    dispatch(setCategory({
      category: options[idx]
    }))
    setSelectedCategory(options[idx])
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  }

  return (
    <div className='category-contents'>
      <span>
        <h2>
          Category:
        </h2>
      </span>
      <div className="chosen-category">
        <h3>
        {selectedCategory ? selectedCategory : <p>Any</p>}
        </h3>
      </div>
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
        {options.map((option, idx) => (
          <MenuItem onClick={(event) => handleMenuItemClick(event, idx)}>
            {options[idx]}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default Category;
