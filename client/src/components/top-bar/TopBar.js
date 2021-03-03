import React from 'react';
import './top-bar.css'
import UserDropdown from '../user_dropdown/UserDropdown'
import { GiClawSlashes, GiCrackedMask, GiAbstract017 } from "react-icons/gi";
import { makeStyles } from "@material-ui/core/styles";
import holyGrail from '../../images/holy_grail.PNG';
import { useDispatch, useSelector } from "react-redux";
import setUserCreds from '../../actions/userCredsAction'
import { useHistory,  Redirect } from 'react-router-dom'
import { BsHouseFill } from "react-icons/bs"



const useStyles = makeStyles((theme) => ({

  topBar: {
    backgroundColor: "black",
    display: 'flex',
    justifyContent: 'space-between',
    height: '100px',
  },
  topBarRight: {
    display: 'flex'
  }
}))
// {classes.backgroundColor}
const TopBar = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const firstName = useSelector((store) => store.session.currentUser.firstName)
  const history = useHistory();

  const redirectToHome = () => {
    const today = new Date()
    // today.toLocalDateString()
    // today.setDate(today.getDate())
    //('TODAY:', today)
    history.replace('/')
  }
  return (
    <>
      <div className="top-bar-container">
        <div className='home-icon-container' onClick={redirectToHome}>
          <h2 className="house-icon">
            <BsHouseFill />
          </h2>
        </div>
        <div className="site-name-container">
          <h1 style={{fontFamily: "freestyle script", fontSize: "40px", fontWeight: "bold"}}>Hey Neighbor!</h1>
        </div>
        <div className='top-bar-right'>
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
