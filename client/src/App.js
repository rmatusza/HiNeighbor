import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route } from "react-router-dom";
import TopBar from './components/top-bar/TopBar';
import HomePage from './components/homepage/HomePage';
import Login from './components/login/Login';
import { setUserCreds } from './actions/userCredsAction';
import { useDispatch } from "react-redux";
import ProtectedRoute from './components/ProtectedRoute';
import PostedItems from './components/user_dropdown/PostedItems';
import SellerProfileMain from './components/seller_profile/SellerProfileMain';
import UserStats from './components/user_dropdown/UserStats';
import History from './components/user_dropdown/History';
import SignUp from './components/signup/SignUp';
import BidHistory from './components/user_dropdown/BidHistory';
import './index.css';
import Inbox from './components/user_dropdown/Inbox';
import { io } from 'socket.io-client';
export const socket = io.connect('http://localhost:8082')

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null)
  const [conversations, setConversations] = useState([])
  const dispatch = useDispatch();
  const inboxVisible = useSelector(store => store.entities.inbox_visibility.visible);


  useEffect(() => {
    (async () => {
      // let UserId;
      console.log('use effect: App component')
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
        dispatch(setUserCreds(payload))
        setAuthenticated(true)
        setUserId(payload.id)
        setUsername(payload.username)
        // await fetch('http://localhost:5000/api/init-websockets')
        let fetchConversations = await fetch(`http://localhost:5000/api/users/${payload.id}/find-conversations`)
        const conversations = await fetchConversations.json()
        setConversations(conversations)
        console.log('payload id:', payload.id)
        socket.emit('add_user_to_room', payload.id)
      } catch(err) {

      }

    })()
  }, [authenticated])

  return (
    <>
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
        <ProtectedRoute path="/" authenticated={authenticated} exact={false}>
          <div className={inboxVisible ? 'inboxContainer__visible' : 'inboxContainer__invisible'}>
            <Inbox userInfo={{userId, username, conversations}}/>
          </div>
        </ProtectedRoute>
      </BrowserRouter>
      
      
    </>
  );
}

export default App;