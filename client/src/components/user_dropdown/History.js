import React, { useState, useEffect } from 'react';
import {
  CardActionArea,
  Grid,
  Button,
} from "@material-ui/core";
import { useDispatch, useSelector, connect } from "react-redux";
import PurchaseHistory from './PurchaseHistory';
import RentHistory from './RentHistory';
import { makeStyles, withStyles } from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
  Buttons: {
    minWidth: '177px;',
    maxWidth: '177px;',
  }
}))


const History = () => {
  const currUserId = useSelector(store => store.session.currentUser.id)
  const [purchasedButtonState, setPurchasedButtonState] = useState(true)
  const [rentedButtonState, setRentedButtonState] = useState(false)
  const [purchasedItems, setPurchasedItems] = useState({'purchased_items': [], 'users': [], 'reviews': []})
  const [rentedItems, setRentedItems] = useState({'rented_items': [], 'users': [], 'rent_reviews': [], 'returned_rented_items': []})
  const classes = useStyles()
  // let purchasedItems;
  // let rentedItems = []
  let ratingState = {}
  let divClass;
  if(purchasedButtonState){
    divClass = 'purchase-rent-toggle-buttons__purchased'
  } else {
    divClass = 'purchase-rent-toggle-buttons'
  }

  const handleClick = (e) => {
    if(e.target.name === 'purchased') {
      if(purchasedButtonState === false) {
        setPurchasedButtonState(true)
        setRentedButtonState(false)
      } else {
        setPurchasedButtonState(false)
        setRentedButtonState(true)

      }
    } else {
      if(rentedButtonState === false) {
        setRentedButtonState(true)
        setPurchasedButtonState(false)

      }else {
        setRentedButtonState(false)
        setPurchasedButtonState(true)
      }
    }
  }

  useEffect(() => {
    (async() => {
      let rows = []
      const res = await fetch(`http://localhost:5000/api/users/${currUserId}/get-purchase-history`)
      const postedItems = await res.json()
      console.log('RETURNED ITEMS:', postedItems)
      // //(postedItems)
      setPurchasedItems({'purchased_items': postedItems.purchased_items, 'users': postedItems.users, 'reviews': postedItems.reviews})
      const getRentHistory = await fetch(`http://localhost:5000/api/users/${currUserId}/get-rent-history`)
      const returnedItems = await getRentHistory.json()
      setRentedItems({'rented_items': returnedItems.rent_items, 'rent_reviews': returnedItems.reviews, 'returned_rented_items': returnedItems.returned_rented_items})
    })()
  }, [])

  //(purchasedItems)

  return (
    <>
      <div className={divClass}>
        <div>
        <Button className={classes.Buttons} aria-controls="simple-menu" aria-haspopup="true"  variant={purchasedButtonState ? 'contained' : 'outlined'} color="secondary" onClick={handleClick} name="purchased">
         Purchased
        </Button>
        </div>
        <div className="purchase-rent-toggle-buttons-divider"></div>
        <div>
        <Button className={classes.Buttons} aria-controls="simple-menu" aria-haspopup="true"  variant={rentedButtonState ? 'contained' : 'outlined'} color="secondary" onClick={handleClick} name="rented">
         Rented
        </Button>
        </div>
      </div>
      <div>
        {purchasedButtonState ? <PurchaseHistory postedItems={purchasedItems}/> : <RentHistory postedItems={rentedItems}/>}
      </div>
    </>
  )
}


export default History;
