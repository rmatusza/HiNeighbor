import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Redirect } from 'react-router-dom'
import setUserCreds from '../../actions/userCredsAction'
import './login.css';


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

  const handleSubmit = async () => {
    const body = {
      email,
      password
    }
    //(body)
    const res = await fetch('/api/users/token', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const response = await res.json()
    console.log('RESPONSE:', response)

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

  const logInDemoUser = async () => {
    const body = {
      email: 'testuser@test.com',
      password: 'password'
    }
    //(body)
    const res = await fetch('/api/users/token', {
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
    <>
    <div className="sign-in-container">
      <div className="background-img-container">
        <img className="background-img" src={"https://hi-neighbor-item-photos.s3.amazonaws.com/community.jpg"} />
      </div>
      <div className="site-name">
        <h1 style={{fontFamily: "freestyle script", fontSize: "40px", fontWeight: "bold", color: "red", borderRadius: "5px"}}>
          Hey Neighbor!
        </h1>
      </div>
      <div className="sign-in-page">
        <div className="catch-phrase">
          <h1 style={{fontFamily: 'Arial Rounded MT Bold'}}>
            See What Your Community Has to Offer.
          </h1>
        </div>
        <form className={classes.root} noValidate autoComplete="off">
          <TextField  color='primary' id="filled-basic" label="Email:"  variant="filled" name="email-input" onChange={updateInput}/>
          <div className="password-field">
          <TextField id="filled-basic" label="Password:" type="password" variant="filled" name="password-input" fullWidth={true} onChange={updateInput}/>
          </div>
          <Button onClick={validateForm}  variant="contained" color="primary">
            Login
          </Button>
          <div>
          <Button onClick={logInDemoUser}  variant="contained" color="primary" fullWidth={true}>
            Log in as Demo User
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
          {"The Following Are Required:"}
        </DialogTitle>
        <List>
          {formErrors.map((error) => (
            <ListItem>
              <ListItemText>
                {error}
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Dialog>
    </>
  )
}


export default Login;
