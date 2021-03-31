import React, { useState, useEffect } from 'react';
import {
  CardActionArea,
  Grid,
  Button,
} from "@material-ui/core";
import { useDispatch, useSelector, connect } from "react-redux";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import SellerProfileForSale from './SellerProfileForSale';
import SellerProfileForRent from './SellerProfileForRent';
import { useParams } from 'react-router';

const useStyles = makeStyles((theme) => ({
  Buttons: {
    minWidth: '177px;',
    maxWidth: '177px;',
  }
}))

function createData(item_id, current_bid, image_url, description, name, price, bid, num_bidders, days_remaining) {
  return { item_id, current_bid, image_url, description, name, price, bid, num_bidders, days_remaining };
}

function createRentData(name, rate, rented, expiry_date) {
  return { name, rate, rented, expiry_date };
}

const SellerProfileMain = () => {
  const { id } = useParams()
  const [userData, setUserData] = useState({'items_for_sale': [], 'items_for_rent': [], 'user': {}, 'sold': {}, 'reviews': {}})
  const [dataRows, setDataRows] = useState([])
  const [dataRowsRentItems, setDataRowsRentItems] = useState([])
  const [itemType, setItemType] = useState([])
  const [forSale, setForSale] = useState(true)
  const [forRent, setForRent] = useState(false)
  const [forSaleItems, setForSaleItems] = useState([])
  const [forRentItems, setForRentItems] = useState([])
  const classes = useStyles()

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
      let rows = []
      let rentRows = []
      const res = await fetch(`http://localhost:5000/api/users/${id}/get-seller-info`)
      const sellerInfo = await res.json()
      //('RETURNED ITEMS:', sellerInfo.items_for_sale)
      sellerInfo.items.forEach(item => {
        //('ITEM FOR SALE?:', item.for_sale)
        console.log('ITEMS:', item.image_url)
        if(item.for_sale === true) {
          const d1 = new Date(item.expiry_date)
          const today = new Date()
          today.setDate(today.getDate()+0)
          const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
          const days_remaining = Math.round(Math.abs((today - d1) / oneDay));
          if(item.current_bid === null) {
            rows.push(createData(item.id, item.current_bid, item.image_url, item.description, item.name, item.price, 0, item.num_bids, days_remaining))
          } else {
            rows.push(createData(item.id, item.current_bid, item.image_url, item.description, item.name, item.price, item.current_bid, item.num_bids, days_remaining))
          }
        } else {
          let date;
          if(item.expiry_date){
            let month = item.expiry_date.slice(5,7)
            let day = item.expiry_date.slice(8,10)
            let year = item.expiry_date.slice(0, 4)
            date = month+'-'+day+'-'+year
          }
          //('RENT ITEM:', item)
          rentRows.push(createRentData(item.name, item.rate, item.rented, date))
        }
      })
      setDataRows(rows)
      setDataRowsRentItems(rentRows)
      setUserData(sellerInfo)
      setForSaleItems(sellerInfo.items_for_sale)
      setForRentItems(sellerInfo.items_for_rent)
    })()
  },[])


  //(purchasedItems)

  return (
    <>
      {userData ?
      <div className='seller-info-and-current-items-container'>
        <h1 className="seller-info-heading">Seller Info:</h1>
        <div className="seller-info">
          <div className="seller-username">
            <h3> Seller: </h3><h4 className="username">{userData.user.username}</h4>
          </div>
          <div className="seller-sold-items-count">
            <h3> Items sold:</h3><h4 className="sell-count">{userData.sold.count}</h4>
          </div>
          <div className="seller-sold-items-count">
            <h3> Average Rating:</h3><h4 className="average-ratings">{userData.reviews.average === 0 ? 'No Ratings' : `${Number(userData.reviews.average).toFixed(2)} Stars`}</h4>
          </div>
          <div className="num-seller-ratings">
            <h3>Ratings:</h3><h4 className="num-ratings">{userData.reviews.num_ratings === 0 ? <p> No Ratings</p> : <p>{userData.reviews.num_ratings}</p>}</h4>
          </div>
        </div>
        <div className="current-items-heading-container">
          <h1 className="current-items-heading">
          {userData.user.username} is Currently Offering the Following Items:
          </h1>
        </div>
        <div className="buttons-container">
          <div className="for-sale-button-container">
            <Button variant="contained" color="secondary" name="for-sale" onClick={setButtonState} variant={forSale ? 'contained' : 'outlined'}>For Sale</Button>
          </div>
          <div className="for-rent-button-container">
            <Button variant="contained" color="secondary" onClick={setButtonState} variant={forRent ? 'contained' : 'outlined'}>For Rent</Button>
          </div>
        </div>
      </div>
      :
      <>
      </>
      }
      <div>
        {forSale ? <SellerProfileForSale itemData={ {'user_data': userData, 'table_data': dataRows} }/> : <SellerProfileForRent itemData={ {'user_data': userData, 'table_data': dataRowsRentItems} }/>}
      </div>
    </>
  )
}

export default SellerProfileMain;
