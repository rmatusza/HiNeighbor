import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { GiHamburgerMenu } from "react-icons/gi";
import { setCategory } from '../../actions/searchCategoryActions';
import { useDispatch, useSelector } from "react-redux";

const Category = () => {

  let defaultCategory = useSelector(store => store.entities.search_params.category)
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Books')
  const dispatch = useDispatch();
  const options = ['Books', 'Clothing', 'Electronics', 'Home Decor', 'Kitchen', 'Music', 'Video Games', ]

  const images = {
    'Books': require("../../static/books.png"),
    'Clothing': require("../../static/clothes.png"),
    'Electronics': require("../../static/electronics.png"),
    'Home Decor': require("../../static/home_decor.png"),
    'Kitchen': require("../../static/kitchen.png"),
    'Music': require("../../static/music.png"),
    'Video Games': require("../../static/video_games.png"),
  }

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
        <h1>
          Category:
        </h1>
      </span>
      <div className="chosen-category">
        <div className="category-image-container">
          <img className="category-image" alt="category-icon" src={images[selectedCategory].default} />
        </div>
        <div className="category-name-container">
          <h3 className="category-name">
            {defaultCategory ? defaultCategory : <p>Books</p>}
          </h3>
        </div>
      </div>
      <div className="hamburger-menu-container">
        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} className="hamburger-menu-button">
          <GiHamburgerMenu />
        </Button>
      </div>
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
