import React, { useState, useEffect } from 'react';
import './homepage.css';
import PriceRange from './PriceRange';
import Distance from './Distance';
import OfferType from './OfferType';
import SearchBar from './SearchBar';
import Category from './Category'
import RentableItemTable from './RentableItemTable';
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-ui/core";
// import { view, Animated, TouchableOpacity, Text } from 'react-native';
import Items from './Items';

const HomePage = () => {
  const items = useSelector(store => store.entities.items_state.saleItems)
  const rentItems = useSelector(store => store.entities.items_state.rentItems)
  const search_params = useSelector((store) => store.entities.search_params)

  const [popupVisible, setPopupVisible] = useState(false)
  const [itemComponent, setItemComponent] = useState(null)
  console.log(items)

  const handlePopUp = () => {
    setPopupVisible(true)
    setTimeout(() => {
      setPopupVisible(false)
    }, 3900);
  }

  // WAS TESTING THE INCLUDES FUNCTIONALITY OF SEQUELIZE ON THE SELLER PROFILE
  // HERE SO THAT I COULD AVIOD A FEW CLICKS

  // useEffect(() => {
  //   (async() => {
  //     const res = await fetch(`http://localhost:5000/api/users/${2}/get-seller-info`)
  //     const sellerInfo = await res.json()
  //     // items = postedItems
  //     console.log('RETURNED ITEMS:', sellerInfo)
  //     // setPostedItems(postedItems)
  //   })()
  // }, [])

  return (
    <>
      {popupVisible ? <div className="fade-test" style={{display:"block"}}><h2>Your purchase was successful</h2></div> : <></>}
        <div className='category-contents-container'>
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

     {(() => {
       if(items.length > 0) {
        return(<Items />)
      } else if(rentItems.length > 0) {
        return(<RentableItemTable />)
      } else {
        return(<div className="items-area"></div>)
      }
     })()}
    </>
  )
}


export default HomePage;
