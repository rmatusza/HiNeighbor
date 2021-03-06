import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { GiPathDistance } from "react-icons/gi";
import { useDispatch } from "react-redux";
import { setDistance } from '../../actions/searchCategoryActions';

const Distance = () => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null)
  const options = ['0 - 5 mi', '10 - 20 mi', '20 mi +']
  const dispatch = useDispatch();

  const handleClick = (event) => {
    alert('Distance Feature in Progress')
    // setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = async (e, idx) => {

    dispatch(setDistance({
      distance: options[idx]
    }))
    setSelectedCategory(options[idx])
    setAnchorEl(null);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} variant="outlined" color="secondary" className="search-container__distance-button">
        <GiPathDistance /> Distance: {selectedCategory ? selectedCategory : <p className="distance-selection">Any</p>}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option, idx) => (
          <MenuItem onClick={(event) => handleMenuItemClick(event, idx)} key={idx}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}


export default Distance;
