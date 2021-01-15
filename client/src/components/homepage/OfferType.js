import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { MdLocalGroceryStore } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setOfferType} from '../../actions/searchCategoryActions';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  offerTypeButton : {
    minHeight: '64.4px',
    minWidth: '210px;',
    maxWidth: '210px;',
  }
}));

const OfferType = () => {

  let defaultOfferType = useSelector(store => store.entities.search_params.offer_type)
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null)
  const options = ['Purchase', 'Rent']
  const dispatch = useDispatch();
  const classes = useStyles();


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
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} variant="outlined" color="primary" className={classes.offerTypeButton}>
        <MdLocalGroceryStore /> OfferType: {defaultOfferType ? defaultOfferType : <p className="offer-type-selection">Purchase</p>}
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
