import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Redirect, useHistory } from "react-router-dom";
import TopBar from './components/top-bar/TopBar'
import HomePage from './components/homepage/HomePage';
import Login from './components/login/Login';
import setUserCreds from './actions/userCredsAction'
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from './components/ProtectedRoute';
import Items from './components/homepage/Items';
import PostItem from './components/user_dropdown/PostItem';
import PostedItems from './components/user_dropdown/PostedItems';
import PurchaseHistory from './components/user_dropdown/PurchaseHistory';
import SellerProfileMain from './components/seller_profile/SellerProfileMain';
import UserStats from './components/user_dropdown/UserStats';
import History from './components/user_dropdown/History';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const items = useSelector(store => store.entities.items_state)
  const form_state = useSelector(store => store.entities.post_item_form_state.status)

  // const[items, setItems] = useState([])
  const dispatch = useDispatch();
  const history = useHistory()


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
        const res = await fetch('/api/users/authenticate', {
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
  }, [])

  return (
    <BrowserRouter>
      {/* {form_state === true ? <PostItem /> : <> </>} */}
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
        {/* <PurchaseHistory /> */}
        <History />
      </ProtectedRoute>
      <ProtectedRoute path="/seller-profile/:id" authenticated={authenticated} exact={true}>
        <TopBar setAuthenticated={setAuthenticated}/>
        <SellerProfileMain />
      </ProtectedRoute>
      <Route path="/login" exact={true} >
        <Login authenticated={authenticated} setAuthenticated={setAuthenticated}/>
      </Route>
      <ProtectedRoute path="/user-stats" authenticated={authenticated} exact={true} >
        <TopBar setAuthenticated={setAuthenticated}/>
        <UserStats />
      </ProtectedRoute>
    </BrowserRouter>
  );
}

export default App;
