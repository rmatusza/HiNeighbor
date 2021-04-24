import React from 'react';
import './top-bar.css'
import UserDropdown from '../user_dropdown/UserDropdown'
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { BsHouseFill } from "react-icons/bs";
import { setItems, setRentItems } from '../../actions/itemsActions';
import { refreshHomePageItems } from '../refresh_home_page/refreshHomePageItems';

const TopBar = (props) => {
  const firstName = useSelector((store) => store.session.currentUser.firstName)
  const search_params = useSelector(store => store.entities.search_params)
  const currUserId = useSelector(store => store.session.currentUser.id)
  const history = useHistory();
  const dispatch = useDispatch();

  const redirectToHomePage = async () => {
    const items = await refreshHomePageItems({search_params, currUserId})
    if (items.saleItems.length > 0) {
      dispatch(setItems(items.saleItems))
      dispatch(setRentItems([]))
    } else {
      dispatch(setRentItems(items.rentItems))
      dispatch(setItems([]))
    }

    history.replace('/')
  }
  
  return (
    <>
      <div className="top-bar-container">
        <div className='home-icon-container' onClick={redirectToHomePage}>
          <h2 className="house-icon">
            <BsHouseFill/>
          </h2>
        </div>
        <div className="site-name-container">
          <h1 style={{fontFamily: "freestyle script", fontSize: "40px", fontWeight: "bold"}}>Hi Neighbor!</h1>
        </div>
        <div className='top-bar-right' >
          <div className='username-container'>
            <h2 className='username'>
              Welcome {firstName}!
            </h2>
          </div>
          <div className='dropdown-button-container'>
            <UserDropdown setAuthenticated={props.setAuthenticated}/>
          </div>
        </div>
      </div>
    </>
  )
}


export default TopBar;
