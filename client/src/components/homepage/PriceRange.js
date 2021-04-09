import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { MdAttachMoney } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setPriceRange } from '../../actions/searchCategoryActions';

const PriceRange = () => {
  let defaultPriceRange = useSelector(store => store.entities.search_params.price_range)
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null)
  const options = ['ANY', '$5 - $20', '$20 - $50', '$50 - $100', '$100 +']
  const prices = [[0, 1000000000], [5, 20], [20, 50], [50, 100], [100, 10000000000]]
  const dispatch = useDispatch();

  //('DEFAULT PRICE RANGE:', defaultPriceRange)
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

  if(defaultPriceRange && defaultPriceRange[1] === 10000000000) {
    defaultPriceRange = '$100+'
  } else if(defaultPriceRange && defaultPriceRange[1] === 1000000000) {
    defaultPriceRange = 'Any'
  } else if(defaultPriceRange && defaultPriceRange.length === 2) {
    defaultPriceRange = `$${defaultPriceRange[0]} - $${defaultPriceRange[1]}`
  }

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} variant="outlined" color="secondary" className="search-container__price-range-button">
        <MdAttachMoney /> Price Range: {selectedCategory ? selectedCategory : <p className="price-range-selection">{defaultPriceRange ? defaultPriceRange : 'Any'}</p>}
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


export default PriceRange;
