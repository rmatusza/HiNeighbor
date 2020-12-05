import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Redirect, useHistory } from "react-router-dom";
import TopBar from './components/top-bar/TopBar'
import HomePage from './components/homepage/HomePage';
import Login from './components/login/Login';
import setUserCreds from './actions/userCredsAction'
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from './components/ProtectedRoute';
const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory()

  useEffect(() => {
    (async () => {
      try{
        let token;
        const cookieArr = document.cookie.split('=')
        cookieArr.forEach((el, idx) => {
          if(el === 'access_token') {
            token = cookieArr[idx + 1]
          }
        })
        if(!token) {
          return
        }
        const res = await fetch('http://localhost:8080/api/users/authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({'access_token': token})
        })
        if(res.status >= 400 && res.status < 500) {
          return
        }
        const payload = await res.json()
        console.log(payload)
        dispatch(setUserCreds(payload))
        setAuthenticated(true)
      } catch(err) {
        console.log(err)
      }

    })()
  }, [])

  return (
    <BrowserRouter>
      <ProtectedRoute path="/" authenticated={authenticated} exact={true}>
        <TopBar setAuthenticated={setAuthenticated}/>
        <HomePage />
      </ProtectedRoute>
      <Route path="/login" exact={true} >
        <Login authenticated={authenticated} setAuthenticated={setAuthenticated}/>
      </Route>
    </BrowserRouter>
  );
}

export default App;
