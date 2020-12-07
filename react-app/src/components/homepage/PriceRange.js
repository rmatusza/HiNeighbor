import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { MdAttachMoney } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setPriceRange } from '../../actions/searchCategoryActions';


const PriceRange = () => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null)
  const options = ['$5 - $20', '$20 - $50', '$50 - $100', '$100 +']
  const prices = [[5, 20], [20, 50], [50, 100], [100, 100]]
  const dispatch = useDispatch();


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = async (e, idx) => {

    dispatch(setPriceRange({
      price_range: prices[idx]
    }))
    setSelectedCategory(options[idx])
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} variant="contained" color="primary">
        <MdAttachMoney /> Price Range: {selectedCategory ? selectedCategory : <p className="price-range-selection">Any</p>}
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
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}


export default PriceRange;
