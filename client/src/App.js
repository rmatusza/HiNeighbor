import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import TopBar from './components/top-bar/TopBar'
import HomePage from './components/homepage/HomePage';
import Login from './components/login/Login';
import { setUserCreds } from './actions/userCredsAction'
import { useDispatch } from "react-redux";
import ProtectedRoute from './components/ProtectedRoute';
import PostedItems from './components/user_dropdown/PostedItems';
import SellerProfileMain from './components/seller_profile/SellerProfileMain';
import UserStats from './components/user_dropdown/UserStats';
import History from './components/user_dropdown/History';
import SignUp from './components/signup/SignUp';
import BidHistory from './components/user_dropdown/BidHistory';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const dispatch = useDispatch();
  
  // AUTHENTICATES THE USER BY CHECKING TO SEE IF THEY HAVE A VALID ACCESS TOKEN
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
        const res = await fetch('http://localhost:5000/api/users/authenticate', {
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
        //(payload)
        dispatch(setUserCreds(payload))
        setAuthenticated(true)
      } catch(err) {
        //(err)
      }

    })()
  }, /*[]*/)

  return (
    <BrowserRouter>
      <ProtectedRoute path="/" authenticated={authenticated} exact={true}>
        <TopBar setAuthenticated={setAuthenticated}/>
        <HomePage />
      </ProtectedRoute>
      <ProtectedRoute path="/posted-items" authenticated={authenticated} exact={true}>
        <TopBar setAuthenticated={setAuthenticated}/>
        <PostedItems />
      </ProtectedRoute>
      <ProtectedRoute path="/purchase-history" authenticated={authenticated} exact={true}>
        <TopBar setAuthenticated={setAuthenticated}/>
        <History />
      </ProtectedRoute>
      <ProtectedRoute path="/bid-history" authenticated={authenticated} exact={true}>
        <TopBar setAuthenticated={setAuthenticated}/>
        <BidHistory />
      </ProtectedRoute>
      <ProtectedRoute path="/seller-profile/:id" authenticated={authenticated} exact={true}>
        <TopBar setAuthenticated={setAuthenticated}/>
        <SellerProfileMain />
      </ProtectedRoute>
      <Route path="/login" exact={true} >
        <Login authenticated={authenticated} setAuthenticated={setAuthenticated}/>
      </Route>
      <Route path="/signup" exact={true} >
        <SignUp authenticated={authenticated} setAuthenticated={setAuthenticated}/>
      </Route>
      <ProtectedRoute path="/user-stats" authenticated={authenticated} exact={true} >
        <TopBar setAuthenticated={setAuthenticated}/>
        <UserStats />
      </ProtectedRoute>
    </BrowserRouter>
  );
}

export default App;
