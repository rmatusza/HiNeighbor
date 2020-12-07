import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { MdLocalGroceryStore } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setOfferType} from '../../actions/searchCategoryActions';


const OfferType = () => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null)
  const options = ['Purchase', 'Rent', 'Services']
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = async (e, idx) => {

    dispatch(setOfferType({
      offer_type: options[idx]
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
        <MdLocalGroceryStore /> OfferType: {selectedCategory ? selectedCategory : <p className="offer-type-selection">Any</p>}
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


export default OfferType;
