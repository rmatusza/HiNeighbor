import React, { useState, useEffect } from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  CardActionArea,
  Grid,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Input,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector, connect } from "react-redux";
import Modal from "@material-ui/core/Modal";
import { setItems } from '../../actions/itemsActions';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useHistory, Link, Switch } from "react-router-dom";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles((theme) => ({
  grid: {
    width: '50%',
    margin: '0px',
  },
  paper: {
    textAlign: 'center',
    backgroundColor: 'white',
    background: theme.palette.success.light,
    color: theme.palette.secondary.contrastText,
    height: '200px',
    width: '200px',
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
    backgroundColor: "whitesmoke",
    color: "black",
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
    backgroundColor: theme.palette.secondary.main
  },
  dialogBox: {
    width: '200px',
    heigth: '200px'
  },
  table: {
    minWidth: 650,
  },
  tableHead: {
    backgroundColor: "#000000",
    color: theme.palette.secondary.contrastText,
  },
  tableCell: {
    color: theme.palette.secondary.contrastText
  },
  tableRow: {
    backgroundColor: 'whitesmoke'
  },
  tableContainer: {
    paddingBottom: '0px',
    backgroundColor: 'white',
    height: '70px',
    width: '700px',
    height: '115px'
  },
  buyNow: {
    maxHeight: "50px"
  },
  cardActionArea: {
    width: '200px'
  },
  buttons: {
    width: '160px'
  },
  submitButton: {
    width: '160px',
    marginTop: '20px'
  },
  gridItem: {
    backgroundImage: 'url(../../static/memphis-mini.png)'
  }
}))



function createData(name, price, bid, num_bidders, days_remaining, item_id, current_bid, item_price, sellerId, description) {
  return { name, price, bid, num_bidders, days_remaining, item_id, current_bid, item_price, sellerId, description };
}


const ItemsGridVersion = () => {
  let items = useSelector(store => store.entities.items_state.saleItems)
  let rentItems = useSelector(store => store.entities.items_state.rentItems)
  //('ITEMS:', items)
  const currUserId = useSelector(store => store.session.currentUser.id)
  const [modalOpen, setModalOpen] = useState(false)
  const [currItemId, setCurrItemId] = useState(null)
  const [currBid, setCurrBid] = useState(null)
  const [currItemPrice, setCurrItemPrice] = useState(null)
  const [bidInput, setBidInput] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [enlargeImage, setEnlargeImage] = useState(false);
  const [image, setImage] = useState(null);
  const classes = useStyles()
  const dispatch = useDispatch()
  const history = useHistory();
  //('ITEMS:', items)

  const updateBidInput = (e) => {
    // //('BID INPUT:', e.target.value)
    setBidInput(e.target.value)
  }

  const updateItems = (updatedItem) => {
    // //('CURRENT ITEM OBJECT:', updatedItem)
    const id = updatedItem.id
    // //('ITEM ID:', id)
    items.forEach((item, i) => {
      // //('UPDATING ITEMS')
      if(item.id === id) {
        // //('CURR ITEM:', currItems[i])
        items[i] = updatedItem
        // //('CURRITEMS:', items)
        dispatch(setItems(items))
        // setCurrItemsState(currItems)
      }
    })
  }

  const updateSoldItems = (id) => {
    let currItems = []
    items.forEach((item, i) => {
      if(Number(item.id) !== Number(id)) {
        currItems.push(item)
      }
      dispatch(setItems(currItems))
    })
  }

  const closeImage = () => {
    setEnlargeImage(false)
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogOpen = (itemData) => {
    //('ITEM DATA:', itemData)
    setCurrItemId(itemData.itemId)
    setDialogOpen(true)
  }

  const submitBid = async () => {

    const body = {
      bidInput,
      currUserId
    }

    const res = await fetch(`http://localhost:5000/api/items-and-services/${currItemId}/bid`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    const updatedItem = await res.json()

    //('RETURNED UPDATED ITEM:', updatedItem)

    updateItems(updatedItem)
    // alert(`bid of $${bidInput} was placed`)
    setModalOpen(false)
  }

  const handlePurchase = async () => {

    const body = {
      currUserId
    }

    const res = await fetch(`http://localhost:5000/api/items-and-services/${currItemId}/purchase`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    const {soldItemId} = await res.json()
    //(soldItemId)

    updateSoldItems(soldItemId)
    handleDialogClose()
  }

  const handleClick = (sellerId) => {
    history.replace(`/seller-profile/${sellerId}`)
  }

  const handleEnlargeImage = (image) => {
    setImage(image)
    setEnlargeImage(true)
  }

  const openBidModal = (itemData) => {
    //('ITEM DATA:', itemData)
    setCurrItemId(itemData.itemId)
    setCurrBid(itemData.currentBid)
    setCurrItemPrice(itemData.itemPrice)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }
  let dataRows = []
  return(
    <>
    {items[0] === 'no_items' ?
      <div className="items-body-container-no-items">
        <h1 className="no-results-heading">No Results Found</h1>
      </div>
    :
    <div className="items-body-container_grid-version">
        
    </div>
    }
    </>
  )
}

export default ItemsGridVersion;
