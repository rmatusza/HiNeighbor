import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Redirect } from 'react-router-dom'
import setUserCreds from '../../actions/userCredsAction'

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
    const res = await fetch('http://localhost:8080/api/users/token', {
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
        userId: user.id,
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
    <>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField id="filled-basic" label="Email:" variant="filled" name="email-input" onChange={updateInput}/>
        <TextField id="filled-basic" label="Password:" type="password" variant="filled" name="password-input" onChange={updateInput}/>
        <Button onClick={handleSubmit}  variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </>
  )
}


export default Login;
