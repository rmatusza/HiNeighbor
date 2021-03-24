import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { BiDotsVerticalRounded } from "react-icons/bi";
import { useHistory,  Redirect } from 'react-router-dom'
import PostItem from './PostItem';
import PostRentItem from './PostRentItem';
import { setPostItemFormStatus } from '../../actions/itemsActions';
import { setPostItemRentStatus } from '../../actions/itemsActions';




const UserDropdown = (props) => {

  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useDispatch();
  const history = useHistory();
  const form_state = useSelector(store => store.entities.post_item_form_state.status)
  const rent_form_state = useSelector(store => store.entities.post_item_rent_state.rentStatus)
  //(rent_form_state)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    props.setAuthenticated(false)
  };

  const handlePostedItems = () => {
    history.replace('/posted-items')
  }

  const handlePurchaseHistory = () => {
    history.replace('/purchase-history')
  }

  const handleMyStats = () => {
    history.replace('/user-stats')
  }

  const handleBidHistory = () => {
    history.replace('/bid-history')
  }

  const handleDialogClose = () => {
    dispatch(setPostItemFormStatus(false))
    // setDialogOpen(false);
  };

  const handleDialogOpen = () => {
   dispatch(setPostItemFormStatus(true))
  };

  const handleDialogRentClose = () => {
    dispatch(setPostItemRentStatus(false))
    // setDialogOpen(false);
  };

  const handleDialogRentOpen = () => {
   dispatch(setPostItemRentStatus(true))
  };

  return (
    <>
      <div>
        {/* <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}> */}
          <h2 className="three-dots">
            <BiDotsVerticalRounded aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}/>
          </h2>
        {/* </Button> */}
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleDialogOpen}> Post an Item for Sale</MenuItem>
          <MenuItem onClick={handleDialogRentOpen}> Post an Item for Rent</MenuItem>
          <MenuItem onClick={handleMyStats}>My Stats</MenuItem>
          <MenuItem onClick={handlePostedItems}>Posted Items</MenuItem>
          <MenuItem onClick={handlePurchaseHistory}>Purchase History</MenuItem>
          <MenuItem onClick={handleBidHistory}>Bid History</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
      {rent_form_state === true ? <PostRentItem /> : <> </>}
      {form_state === true ? <PostItem /> : <> </>}

      {/* <PostRentItem /> */}
    </>

  );
}

{/* || rent_form_state.length === 0) */}
// || form_state.length === 0)

export default UserDropdown;
