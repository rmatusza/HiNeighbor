import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { BiDotsVerticalRounded } from "react-icons/bi";
import { useHistory,  Redirect } from 'react-router-dom'
import PostItem from './PostItem';
import PostedItems from '../user_dropdown/PostedItems'
import { setPostItemFormStatus } from '../../actions/itemsActions';




const UserDropdown = (props) => {

  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useDispatch();
  const history = useHistory();
  const form_state = useSelector(store => store.entities.post_item_form_state.status)

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

  // const togglePostItemForm = () => {
  //   console.log('here')
  //   setVisibility(true)
  //   return(<PostItem visible={visibility}/>)
  // }

  console.log(form_state)

  const handleDialogClose = () => {
    dispatch(setPostItemFormStatus(false))
    // setDialogOpen(false);
  };

  const handleDialogOpen = () => {
   dispatch(setPostItemFormStatus(true))
  };

  return (
    <>
      <div>
        {/* <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}> */}
          <h2>
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
          <MenuItem onClick={handleDialogOpen}> Post an Item </MenuItem>
          <MenuItem onClick={handleClose}>My Stats</MenuItem>
          <MenuItem onClick={handlePostedItems}>Posted Items</MenuItem>
          <MenuItem onClick={handlePurchaseHistory}>Purchase History</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
      {form_state === true ? <PostItem /> : <> </>}
    </>

  );
}


export default UserDropdown;
