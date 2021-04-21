import React, { useState, useEffect } from 'react';
import { Button } from "@material-ui/core";
import { useSelector } from "react-redux";
import PurchaseHistory from './PurchaseHistory';
import RentHistory from './RentHistory';
import { makeStyles } from "@material-ui/core/styles";


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
      const res = await fetch(`/api/users/${currUserId}/get-purchase-history`)
      const postedItems = await res.json()
      //('PURCHASED ITEMS:', postedItems)
      // //(postedItems)
      setPurchasedItems({'purchased_items': postedItems.purchased_items, 'users': postedItems.users, 'reviews': postedItems.reviews})
      const getRentHistory = await fetch(`/api/users/${currUserId}/get-rent-history`)
      const returnedItems = await getRentHistory.json()
      //('RENTED ITEMS:', returnedItems)
      setRentedItems({'rented_items': returnedItems.rent_items, 'rent_reviews': returnedItems.reviews, 'returned_rented_items': returnedItems.returned_rented_items})
    })()
  }, [])

  //(purchasedItems)

  return (
    <>
      <div className={divClass} key={0}>
        <div key={1}>
          <Button className={classes.Buttons} aria-controls="simple-menu" aria-haspopup="true"  variant={purchasedButtonState ? 'contained' : 'outlined'} color="secondary" onClick={handleClick} name="purchased" key={2}>
          Purchased
          </Button>
        </div>
        <div className="purchase-rent-toggle-buttons-divider" key={3}></div>
        <div key={4}>
          <Button className={classes.Buttons} aria-controls="simple-menu" aria-haspopup="true"  variant={rentedButtonState ? 'contained' : 'outlined'} color="secondary" onClick={handleClick} name="rented" key={5}>
          Rented
          </Button>
        </div>
      </div>
      <div key={6}>
        {purchasedButtonState ? <PurchaseHistory postedItems={purchasedItems} key={7}/> : <RentHistory postedItems={rentedItems} key={8}/>}
      </div>
    </>
  )
}


export default History;
