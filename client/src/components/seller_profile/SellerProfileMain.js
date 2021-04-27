import React, { useState, useEffect } from 'react';
import { Button } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import SellerProfileForSale from './SellerProfileForSale';
import SellerProfileForRent from './SellerProfileForRent';
import { useParams } from 'react-router';
import { setSellerProfileItemsForSale } from '../../actions/itemsActions';

function createData(id, current_bid, image_url, description, name, price, bid, num_bids, days_remaining, category) {
  return { id, current_bid, image_url, description, name, price, bid, num_bids, days_remaining, category };
}

function createRentData(name, rate, rented, expiry_date, category, image_url, description) {
  return { name, rate, rented, expiry_date, category, image_url, description };
}


const SellerProfileMain = () => {
  const { id } = useParams()
  const currUserId = useSelector(store => store.session.currentUser.id);
  const [userData, setUserData] = useState({})
  const [forSaleItems, setForSaleItems] = useState([])
  const [forRentItems, setForRentItems] = useState([])
  const [forSale, setForSale] = useState(true)
  const [forRent, setForRent] = useState(false)
  const dispatch = useDispatch()

  const setButtonState = (e) => {
    if(e.target.name === 'for-sale') {
      if(forSale === false) {
        setForSale(true)
        setForRent(false)
      } else {
        setForSale(false)
        setForRent(true)
      }
    } else {
      if(forRent === false) {
        setForRent(true)
        setForSale(false)
      }else {
        setForRent(false)
        setForSale(true)
      }
    }
  }

  useEffect(() => {
    (async() => {
      let forSaleItemData = []
      let forRentItemData = []

      const res = await fetch(`http://localhost:5000/api/users/${id}/get-seller-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({currUserId, 'sellerId': id})
      })

      const sellerInfo = await res.json()
      sellerInfo.user['items_sold'] = sellerInfo.items_sold
      setUserData(sellerInfo.user)

      sellerInfo.items.forEach((item, idx) => {
        if(item.for_sale === true) {

          const d1 = new Date(item.expiry_date)
          const today = new Date()
          today.setDate(today.getDate()+0)
          const oneDay = 24 * 60 * 60 * 1000;
          const days_remaining = Math.round(Math.abs((today - d1) / oneDay));

          if(item.current_bid === null) {
            forSaleItemData.push(createData(item.id, item.current_bid, item.image_url, item.description, item.name, item.price, 0, item.num_bids, days_remaining, item.category))
          } else {
            forSaleItemData.push(createData(item.id, item.current_bid, item.image_url, item.description, item.name, item.price, item.current_bid, item.num_bids, days_remaining, item.category))
          }
        } else {
          let date;
          if(item.expiry_date){
            let month = item.expiry_date.slice(5,7)
            let day = item.expiry_date.slice(8,10)
            let year = item.expiry_date.slice(0, 4)
            date = month+'-'+day+'-'+year
          }
          forRentItemData.push(createRentData(item.name, item.rate, item.rented, date, item.category, item.image_url, item.description))
        }
      })
      setForSaleItems(forSaleItemData)
      setForRentItems(forRentItemData)
      dispatch(setSellerProfileItemsForSale(forSaleItemData))
    })()
  },[])


  return (
    <>
      {userData.username ?
      <div className='seller-info-and-current-items-container'>
        <h1 className="seller-info-heading">Seller Info:</h1>
        <div className="seller-info">
          <div className="seller-username">
            <h3> Seller: </h3><h4 className="username">{userData.username}</h4>
          </div>
          <div className="seller-sold-items-count">
            <h3> Items sold:</h3><h4 className="sell-count">{userData.items_sold}</h4>
          </div>
          <div className="seller-sold-items-count">
            <h3> Average Rating:</h3><h4 className="average-ratings">{userData.average_rating === null ? 'No Ratings' : `${Number(userData.reviews.average).toFixed(2)} Stars`}</h4>
          </div>
          <div className="num-seller-ratings">
            <h3>Ratings:</h3><h4 className="num-ratings">{userData.num_ratings === 0 ? <p> No Ratings</p> : <p>{userData.reviews.num_ratings}</p>}</h4>
          </div>
        </div>
        <div className="current-items-heading-container">
          <h1 className="current-items-heading">
          {userData.username} is Currently Offering the Following Items:
          </h1>
        </div>
        <div className="buttons-container">
          <div className="for-sale-button-container">
            <Button color="secondary" name="for-sale" onClick={setButtonState} variant={forSale ? 'contained' : 'outlined'}>For Sale</Button>
          </div>
          <div className="for-rent-button-container">
            <Button color="secondary" onClick={setButtonState} variant={forRent ? 'contained' : 'outlined'}>For Rent</Button>
          </div>
        </div>
      </div>
      :
      <>
      </>
      }
      <div>
        {forSale ? <SellerProfileForSale itemData={ forSaleItems} /> : <SellerProfileForRent itemData={ forRentItems } />}
      </div>
    </>
  )
}

export default SellerProfileMain;
