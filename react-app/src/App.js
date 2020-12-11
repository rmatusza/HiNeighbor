import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Redirect, useHistory } from "react-router-dom";
import TopBar from './components/top-bar/TopBar'
import HomePage from './components/homepage/HomePage';
import Login from './components/login/Login';
import setUserCreds from './actions/userCredsAction'
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from './components/ProtectedRoute';
import Items from './components/homepage/Items';
import PostItem from './components/top-bar/PostItem';
import PostedItems from './components/user_dropdown/PostedItems';
import PurchaseHistory from './components/user_dropdown/PurchaseHistory';
import SellerProfile from './components/seller_profile/SellerProfile';


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
        <PurchaseHistory />
      </ProtectedRoute>
      <ProtectedRoute path="/seller-profile/:id" authenticated={authenticated} exact={true}>
        <TopBar setAuthenticated={setAuthenticated}/>
        <SellerProfile />
      </ProtectedRoute>
      <Route path="/login" exact={true} >
        <Login authenticated={authenticated} setAuthenticated={setAuthenticated}/>
      </Route>
    </BrowserRouter>
  );
}

export default App;
