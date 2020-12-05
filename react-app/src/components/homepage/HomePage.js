import React, { useState } from 'react';
import './homepage.css';
import PriceRange from './PriceRange';
import Distance from './Distance';
import OfferType from './OfferType';
import SearchBar from './SearchBar';
import Category from './Category'
import { useDispatch, useSelector } from "react-redux";
import setUserCreds from '../../actions/userCredsAction'
// import setUserCredsReducer from '../../reducers/userCredsReducer';

// const userId = 1
// const payload = {
//   currentUserId: 1,
//   currentUsername: 'rmatusza',
//   currentUserFirstName: 'Ryan',
//   currentUserLastName: 'Matuszak'
// }

const HomePage = () => {
  // const dispatch = useDispatch();
  // (async()=> {
  //   dispatch(setUserCreds(payload))
  // })()
  // const username = useSelector((store) => store.session.currentUsername)
  // console.log(username)

  return (
    <>
      <div className='category-container'>
        <Category />
      </div>
      <div className='search-container'>
        <div className='toggles'>
          <div className='price-range-container'>
            <h4>
              <PriceRange />
            </h4>
          </div>
          <div className='distance-container'>
            <h4>
              <Distance />
            </h4>
          </div>
          <div className='offer-type-container'>
            <h4>
              <OfferType />
            </h4>
          </div>
        </div>
        <div className='search-bar-container'>
          <h4>
            <SearchBar />
          </h4>
        </div>
      </div>
    </>
  )
}


export default HomePage;
