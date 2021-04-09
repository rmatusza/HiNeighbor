import React from 'react';
import './top-bar.css'
import UserDropdown from '../user_dropdown/UserDropdown'
import { useSelector } from "react-redux";
import { useHistory } from 'react-router-dom'
import { BsHouseFill } from "react-icons/bs"


const TopBar = (props) => {
  const firstName = useSelector((store) => store.session.currentUser.firstName)
  const history = useHistory();
  const redirectToHome = () => {
    history.replace('/')
  }
  
  return (
    <>
      <div className="top-bar-container">
        <div className='home-icon-container' onClick={redirectToHome}>
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
