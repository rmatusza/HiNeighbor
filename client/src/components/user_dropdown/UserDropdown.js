import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import { setPostItemFormStatus, setPostItemRentStatus } from '../../actions/itemsActions';
import { logoutUser } from '../../actions/userCredsAction';
import { clearSearchParams } from '../../actions/searchCategoryActions';
import { setInboxVisibility } from '../../actions/chatActions';
import PostItem from './PostItem';
import PostRentItem from './PostRentItem';
import Inbox from './Inbox';
import {
  Menu,
  MenuItem,
} from '@material-ui/core';
import { BiDotsVerticalRounded } from "react-icons/bi";

const UserDropdown = (props) => {

  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useDispatch();
  const history = useHistory();
  const form_state = useSelector(store => store.entities.post_item_form_state.status)
  const rent_form_state = useSelector(store => store.entities.post_item_rent_state.rentStatus)
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
    dispatch(logoutUser())
    dispatch(clearSearchParams())
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

  const handleDialogOpen = () => {
   dispatch(setPostItemFormStatus(true))
  };

  const handleDialogRentOpen = () => {
   dispatch(setPostItemRentStatus(true))
  };

  const handleDisplayInbox = () => {
    dispatch(setInboxVisibility(true))
  }

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
          <MenuItem onClick={handleDisplayInbox}>Inbox</MenuItem>
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

// || form_state.length === 0)

export default UserDropdown;
