import React from 'react';
import './top-bar.css'
import UserDropdown from './UserDropdown'
import { GiClawSlashes, GiCrackedMask, GiAbstract017 } from "react-icons/gi";
import { makeStyles } from "@material-ui/core/styles";
import holyGrail from '../../images/holy_grail.PNG';
import { useDispatch, useSelector } from "react-redux";
import setUserCreds from '../../actions/userCredsAction'

const useStyles = makeStyles((theme) => ({

  topBar: {
    backgroundColor: theme.palette.secondary.light,
    display: 'flex',
    justifyContent: 'space-between'
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

  return (
    <>
      <div className={classes.topBar}>
        <div className='site-name-container'>
          <h2>
            Hi Neighbor!
          </h2>
        </div>
        <div className='top-bar-right'>
          <div className='username-container'>
            <h3 className='username'>
             Hello {firstName}!
            </h3>
          </div>
          <div className='user-icon'>
            <h2>
              <GiCrackedMask />
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
