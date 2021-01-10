import React, { useState, useEffect } from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  CardActionArea,
  Grid,
  Button,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector, connect } from "react-redux";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import PurchaseHistory from './PurchaseHistory';
import RentHistory from './RentHistory';


const History = () => {
  const currUserId = useSelector(store => store.session.currentUser.id)
  const [postedItems, setPostedItems] = useState({'items': [], 'users': []})
  const [dataRows, setDataRows] = useState([])
  const [ratingVisibility, setRatingVisibility] = useState({})
  const [currItem, setCurrItem] = useState(null)
  const [itemRating, setItemRating] = useState(null)
  const [selectedRatingButton, setSelectedRatingButton] = useState(null)
  const [purchasedButtonState, setPurchasedButtonState] = useState(true)
  const [rentedButtonState, setRentedButtonState] = useState(false)
  const [purchasedItems, setPurchasedItems] = useState({'purchased_items': [], 'users': [], 'reviews': []})

  // let purchasedItems;
  let rentedItems = []
  let ratingState = {}


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
        setPurchasedButtonState(false)
        setRentedButtonState(true)
      }
    }
  }

  useEffect(() => {
    (async() => {
      let rows = []
      const res = await fetch(`http://localhost:5000/api/users/${currUserId}/get-purchase-history`)
      const postedItems = await res.json()
      console.log(postedItems.purchased_items)
      // let obj = {'purchased_items': postedItems.purchased_items, 'users': postedItems.users}
      setPurchasedItems({'purchased_items': postedItems.purchased_items, 'users': postedItems.users, 'reviews': postedItems.reviews})
      rentedItems = postedItems.rented_items
    })()
  }, [])

  console.log(purchasedItems)

  return (
    <>
      <div className="stats-buttons">
        <div>
        <Button aria-controls="simple-menu" aria-haspopup="true"  variant={purchasedButtonState ? 'contained' : 'outlined'} color="primary" onClick={handleClick} name="purchased">
         Purchased
        </Button>
        </div>
        <div className="button-divider"></div>
        <div>
        <Button aria-controls="simple-menu" aria-haspopup="true"  variant={rentedButtonState ? 'contained' : 'outlined'} color="primary" onClick={handleClick} name="rented">
         Rented
        </Button>
        </div>
      </div>
      <div>
        {purchasedButtonState ? <PurchaseHistory props={purchasedItems}/> : <RentHistory />}
      </div>
    </>
  )
}


export default History;
