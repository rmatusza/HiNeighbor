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
import { BsInfoSquare } from "react-icons/bs";
import './signup.css';


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


const SignUp = (props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [formErrors, setFormErrors] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [infoDialogOpen, setInfoDialogOpen] = useState(false);
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const updateInput = (e) => {
        if(e.target.name === 'password-input') {
        setPassword(e.target.value)
        } else if(e.target.name === 'password-confirmation-input') {
            setConfirmPassword(e.target.value)
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

    const redirectToLoginPage = () => {
        history.replace('/login')
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
        <div className="top-bar-login-page-container">
          <div className="site-name">
            <h1 style={{fontFamily: "freestyle script", fontSize: "40px", fontWeight: "bold", color: "red", borderRadius: "5px"}} className="site-name-text">
              Hi Neighbor!
            </h1>
          </div>
          <div className="sign-up-and-info-icon-container">
            <div className="create-acount-container" onClick={redirectToLoginPage}>
                <h3 style={{fontFamily: "freestyle script", fontSize: "30px", fontWeight: "bold", color: "red", borderRadius: "5px"}} className="sign-up-text">
                  Login Page
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
            <TextField  color='primary' id="filled-basic" label="Email:"  variant="filled" name="email-input" onChange={updateInput}/>
            <div className="password-field">
              <TextField id="filled-basic" label="Password:" type="password" variant="filled" name="password-input" fullWidth={true} onChange={updateInput}/>
            </div>
            <TextField id="filled-basic" label="Confirm Password:" type="password" variant="filled" name="password-confirmation-input" fullWidth={true} onChange={updateInput}/>
            <TextField id="filled-basic" label="UserName:" type="password" variant="filled" name="password-confirmation-input" fullWidth={true} onChange={updateInput}/>
            <TextField id="filled-basic" label="First Name:" type="password" variant="filled" name="password-confirmation-input" fullWidth={true} onChange={updateInput}/>
            <TextField id="filled-basic" label="Last Name:" type="password" variant="filled" name="password-confirmation-input" fullWidth={true} onChange={updateInput}/>
            <Button onClick={validateForm}  variant="contained" color="primary">
                Create Account
            </Button>
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
          <p>Note: There are two demo logins which will allow you to see the results of certain actions from 
            multiple perspectives.
            For example, you can purchase an item from demo user 1 as demo user 2 and then see the 
            resulting change in demo user 1's user stats. 
            As another example, you can also post an item as one demo user 
            and then verify that it is searchable when logged in as the other demo user
          </p>
          <p>If you would like to checkout the code or have a look at the README file click the following link!</p>
          <a href="https://github.com/rmatusza/HiNeighbor" target="_blank">Show Me the Code!</a>
        </div>
      </Dialog>
    </>
  )
}


export default SignUp;