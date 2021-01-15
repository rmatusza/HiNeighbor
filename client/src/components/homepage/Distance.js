import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { GiPathDistance } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { setDistance } from '../../actions/searchCategoryActions';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  distanceButton : {
    minHeight: '64.4px',
    minWidth: '210px;',
    maxWidth: '210px;',
  }
}));

const Distance = () => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null)
  const options = ['0 - 5 mi', '10 - 20 mi', '20 mi +']
  const dispatch = useDispatch();
  const classes = useStyles();

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
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} variant="outlined" color="primary" className={classes.distanceButton}>
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
          <MenuItem onClick={(event) => handleMenuItemClick(event, idx)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}


export default Distance;
