import React, { useState, useEffect } from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
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

const useStyles = makeStyles((theme) => ({
  grid: {
    width: '100%',
    marginTop: '30px',
    // marginLeft: '30px',
  },
  paper: {
    // padding: theme.spacing(2),
    textAlign: 'center',
    backgroundColor: theme.palette.primary.light,
    background: theme.palette.success.light,
    color: theme.palette.secondary.contrastText,
    height: '200px',
    width: '200px'
  },
  typography: {
    fontSize: theme.typography.fontSize
  },
  image: {
    display: "flex",
    justifyContent: "center",
    height: '210px',
    width: '200px',
  },
  itemFormModal: {
    // position: 'absolute',
    position: "absolute",
    // top: "20rem",
    top: 100,
    // left: 350,
    left: 600,
    // left: "20rem",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    // // border: '2px solid #000',
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(2, 4, 3),
    paddingLeft: "5rem",
    paddingRight: "5rem",
    paddingTop: "2rem",
    paddingBottom: "3rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid white",
  },

  submitButton: {
    marginTop: "2rem",
  },

  dialogBox: {
    width: '200px',
    heigth: '200px'
  },
  table: {
   maxWidth: '639px',
   overflow: 'auto'
  },
  tableHead: {
    backgroundColor: "black",
  },
  tableRow: {
    backgroundColor: 'whitesmoke'
  },
  tableContainer: {
    // width: '800px'
    paddingBottom: '0px',
    backgroundColor: 'white',
    height: '70px',
    maxWidth: '639px',
  },
  tableCell: {
    color: theme.palette.secondary.contrastText
  },
}))

function createData(name, seller, purchase_price, purchase_date) {
  return { name, seller, purchase_price, purchase_date };
}

function valuetext(value) {
  return `${value}°C`;
}

const BidHistory = (props) => {
  const currUserId = useSelector(store => store.session.currentUser.id)
  const [postedItems, setPostedItems] = useState({'items': [], 'users': []})
  const[ratingVisibility, setRatingVisibility] = useState({})
  const[currItem, setCurrItem] = useState(null)
  const[itemRating, setItemRating] = useState(null)
  const [selectedRatingButton, setSelectedRatingButton] = useState(null)
  const classes = useStyles()
  let items = []
  let ratingState = {}
  let dataRows = []

  let rows = []
    //   props.postedItems.purchased_items.forEach((item, i) => {
    //     ratingState[i] = false
    //     let month = item.date_sold.slice(5,7)
    //     let day = item.date_sold.slice(8,10)
    //     let year = item.date_sold.slice(0, 4)
    //     if(item.current_bid === null) {
    //       dataRows.push(createData(item.name, item.seller_name, item.price, month+'-'+day+'-'+year))
    //     } else {
    //       dataRows.push(createData(item.name, item.seller_name, item.price, month+'-'+day+'-'+year))
    //     }
    //   })

  useEffect(() => {
    (async() => {
      const res = await fetch(`http://localhost:5000/api/users/${currUserId}/get-bid-history`)
      const bidData = await res.json()
      console.log(bidData)
    })()
  }, [])

  const marks = [
    {
      value: 1,
      label: '1',
    },
    {
      value: 2,
      label: '2',
    },
    {
      value: 3,
      label: '3',
    },
    {
      value: 4,
      label: '4',
    },
    {
      value: 5,
      label: '5',
    },
  ];

  const updateItemRating = (e, value) => {
    setItemRating(value)
  }

  const enableRating = (itemId, idx) => {
    //(itemId)
    let statecpy = {...ratingVisibility}
    let value = ratingVisibility[idx]
    statecpy[idx] = !value
    if(selectedRatingButton !== null && selectedRatingButton !== idx) {
      statecpy[selectedRatingButton] = false
    }
    setCurrItem(itemId)
    setRatingVisibility(statecpy)
    setSelectedRatingButton(idx)
    // currItem = itemId
    // ratingVisibility = statecpy
    // selectedRatingButton = idx
  }

    const submitRating = async(itemId, idx, sellerId) => {
        const body = {
            currUserId,
            itemRating,
            sellerId
        }
        try {
        const res = await fetch(`http://localhost:5000/api/items-and-services/${currItem}/rate-item`, {
        method: 'PATCH',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(body)
        })

        const rating = await res.json()
        const status = await res.status
        if(!(status >= 200 && status <= 399)) {
        const err = new Error()
        err.message = status
        throw err
        }
        enableRating(itemId, idx)
        } catch(e) {
        alert(`Something went wrong. Error status: ${e.message}`)
        }
    }

  return(
    <>
     
    </>
  )
}

export default BidHistory;
