import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Redirect } from 'react-router-dom'
import setUserCreds from '../../actions/userCredsAction'
import './login.css';


const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      // width: '25ch',
      width: '500px'
    },
  },
}));

const Login = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

  const handleSubmit = async () => {
    const body = {
      email,
      password
    }
    console.log(body)
    const res = await fetch('http://localhost:5000/api/users/token', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const { user } = await res.json()

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

  const logInDemoUser = async () => {
    const body = {
      email: 'testuser@test.com',
      password: 'password'
    }
    console.log(body)
    const res = await fetch('http://localhost:5000/api/users/token', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const { user } = await res.json()

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


  if(props.authenticated === true) {
    return <Redirect to="/" exact={true}/>
  }

  return (
    <div className="sign-in-container">
    <div className="sign-in-page">
      <div className="site-name-sign-in">
        <h1 className='site-name-text'>Hi Neighbor!</h1>
      </div>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField id="filled-basic" label="Email:" variant="filled" name="email-input" onChange={updateInput}/>
        <div className="password-field">
        <TextField id="filled-basic" label="Password:" type="password" variant="filled" name="password-input" fullWidth={true} onChange={updateInput}/>
        </div>
        <Button onClick={handleSubmit}  variant="contained" color="secondary">
          Submit
        </Button>
        <div>
        <Button onClick={logInDemoUser}  variant="contained" color="secondary" fullWidth={true}>
          Log in as Demo User
        </Button>
        </div>
      </form>
    </div>
    </div>
  )
}


export default Login;