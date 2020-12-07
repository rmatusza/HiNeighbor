import React, { useState } from 'react';
import './homepage.css';
import PriceRange from './PriceRange';
import Distance from './Distance';
import OfferType from './OfferType';
import SearchBar from './SearchBar';
import Category from './Category'
import { useDispatch, useSelector } from "react-redux";
import setUserCreds from '../../actions/userCredsAction'


const HomePage = () => {
  const imageData = '0f96255f8170d28e319c68ddbcf7236e'
  const items = useSelector(store => store.entities.items_state)
  console.log(items)

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

      {/* <img src={`data:image/png;bas64`,require(`../../uploads/${imageData}`).default} /> */}
    </>

  )
}


export default HomePage;
