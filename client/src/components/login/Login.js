import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useDispatch } from "react-redux";
import { useHistory, Redirect } from 'react-router-dom'
import { setUserCreds } from '../../actions/userCredsAction'
import { BsInfoSquare } from "react-icons/bs";
import './login.css';
// export const ws = new WebSocket("ws://localhost:8082")

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '500px',
    },
    "& .MuiFormLabel-root": {
      color: "white"
    },
    "& .MuiButton-containedPrimary": {
      backgroundColor: "rgba(255,255,255,1)"
    },
    "& .MuiInputBase-input":{
      color: "white"
    },
  },
}));


const Login = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formErrors, setFormErrors] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const updateInput = (e) => {
    if(e.target.name === 'password-input') {
      setPassword(e.target.value)
    } else {
      setEmail(e.target.value)
    }
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleInfoDialogClose = () => {
    setInfoDialogOpen(false)
  }

  const openInfoDialog = () => {
    setInfoDialogOpen(true)
  }

  const handleSubmit = async () => {
    const body = {
      email,
      password
    }
    //(body)
    const res = await fetch('http://localhost:5000/api/users/token', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const response = await res.json()
    //('RESPONSE:', response)

    let errors = []
    if(response.errors) {
      response.errors.forEach(error => {
        errors.push(error.msg)
      })
      setFormErrors(errors)
      setDialogOpen(true)
      return
    }

    let user = response['user']

    if(user) {
      const payload = {
        id: user.id,
        username: user.userName,
        firstName: user.firstName,
        lastName: user.lastName
      }
      dispatch(setUserCreds(payload))
      props.setAuthenticated(true)
    }
  }

  const validateForm = (e) => {
    e.preventDefault()
    let discoveredErrors = []
    let requiredFields =
    [
      email,
      password
    ]
    let errorMessages =
    [
      'You Must Enter a Valid Email',
      'You Must Enter a Password',
    ]

    requiredFields.forEach((field, i) => {
      if(!field) {
        discoveredErrors.push(errorMessages[i])
      }
      setFormErrors(discoveredErrors)
    })
    if(discoveredErrors.length === 0) {
      handleSubmit()
    } else {
      setDialogOpen(true)
    }
  }

  const logInDemoUser = async (num) => {
    let body;
    if(num === 2) {
      body = {
        email:'ryan@test.com',
        password: 'password'
      }
    } else {
      body = {
        email: 'testuser@test.com',
        password: 'password'
      }
    }
    //(body)
    const res = await fetch('http://localhost:5000/api/users/token', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const { user } = await res.json()
    //(user)

    if(user) {
      const payload = {
        id: user.id,
        username: user.userName,
        firstName: user.firstName,
        lastName: user.lastName
      }
      dispatch(setUserCreds(payload))
      props.setAuthenticated(true)
    } 
  }
  
  const redirectToSignUpPage = () => {
    history.replace('/signup')
  }


  if(props.authenticated === true) {
    return <Redirect to="/" exact={true}/>
  }

  return (
    <>
      <div className="sign-in-container">
        <div className="background-img-container">
          <img className="background-img" alt="background-login-page" src={"https://hi-neighbor-item-photos.s3.amazonaws.com/community.jpg"} />
        </div>
        <div className="top-bar-login-page-container">
          <div className="site-name">
            <h1 style={{fontFamily: "freestyle script", fontSize: "40px", fontWeight: "bold", color: "red", borderRadius: "5px"}} className="site-name-text">
              Hi Neighbor!
            </h1>
          </div>
          <div className="sign-up-and-info-icon-container">
            <div className="create-acount-container" onClick={redirectToSignUpPage}>
              <h3 style={{fontFamily: "freestyle script", fontSize: "30px", fontWeight: "bold", color: "red", borderRadius: "5px"}} className="sign-up-text" >
                Sign Up
              </h3>
            </div>
            <div className="info-icon-container" onClick={openInfoDialog}>
              <BsInfoSquare className="info-icon"/>
            </div>
          </div>
        </div>
        <div className="sign-in-page">
          <div className="catch-phrase">
            <h1 style={{fontFamily: 'Arial Rounded MT Bold'}}>
              See What Your Community Has to Offer.
            </h1>
          </div>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField  color='primary' label="Email:"  variant="filled" name="email-input" onChange={updateInput}/>
            <div className="password-field">
              <TextField label="Password:" type="password" variant="filled" name="password-input" fullWidth={true} onChange={updateInput}/>
            </div>
              <Button onClick={validateForm}  variant="contained" color="primary">
                Login
              </Button>
              <div className="demo-user-1-container">
                <Button onClick={logInDemoUser}  variant="contained" color="primary" fullWidth={true}>
                  Log in as Demo User 1
                </Button>
              </div>
              <div>
                <Button onClick={() => logInDemoUser(2)}  variant="contained" color="primary" fullWidth={true}>
                  Log in as Demo User 2
                </Button>
              </div>
          </form>
        </div>
      </div>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
          {"There are missing fields or incorrect information:"}
        </DialogTitle>
        <List>
          {formErrors.map((error, idx) => (
            <ListItem key={idx}>
              <ListItemText>
                {error}
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Dialog>
      <Dialog
        open={infoDialogOpen}
        onClose={handleInfoDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <div className="info-box-content-container">
          <div className="info-box-title-container">
            <DialogTitle id="alert-dialog-title">
              {'Welcome to "Hi Neighbor!"'}
            </DialogTitle>
          </div>
          <p>
            Hi Neighbor is a full stack web application that seeks to replicate a simplified version of an ecommerce 
            site and is a sort of combination of craigslist and ebay. The application is intended to showcase my ability 
            to create a dynamic single-page web application as well as demonstrate an understanding of the technologies used in its 
            creation.
          </p>
          <p>
            In its current form, all of the core functionality has been added and what remains to be implemented are stretch goals
            and code cleanup/making things more efficient. That being said, I still use this project as a means of practicing and 
            experimenting with different methods of building out certain functionalities, so even once all stretch goals have been
            added, I still wouldn't consider this project to be "finished".
          </p>
          <p>
            Note: There are two demo logins which will allow you to see the results of certain actions from 
            multiple perspectives.
            For example, you can purchase an item from demo user 1 as demo user 2 and then see the 
            resulting change in demo user 1's user stats. 
            As another example, you can also post an item as one demo user 
            and then verify that it is searchable when logged in as the other demo user
          </p>
          <p>If you would like to checkout the code or have a look at the README file click the following link!</p>
          <a href="https://github.com/rmatusza/HiNeighbor" target="_blank" rel="noopener noreferrer">Show Me the Code!</a>
        </div>
      </Dialog>
    </>
  )
}


export default Login;
