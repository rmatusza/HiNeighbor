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

const useStyles = makeStyles((theme) => ({
  grid: {
    width: '100%',
    margin: '0px'
  },
  paper: {
    // padding: theme.spacing(2),
    textAlign: 'center',
    backgroundColor: theme.palette.secondary.light,
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
  }
}))




const Items = () => {
  let items = useSelector(store => store.entities.items_state.items)
  const currUserId = useSelector(store => store.session.currentUser.id)
  const [modalOpen, setModalOpen] = useState(false)
  const [currItemId, setCurrItemId] = useState(null)
  const [currBid, setCurrBid] = useState(null)
  const [currItemPrice, setCurrItemPrice] = useState(null)
  const [bidInput, setBidInput] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false);
  const classes = useStyles()
  const dispatch = useDispatch()
  const history = useHistory();




  console.log('ITEMS:', items)


  const updateBidInput = (e) => {
    setBidInput(e.target.value)
  }


  const updateItems = (updatedItem) => {
    console.log('CURRENT ITEM OBJECT:', updatedItem)
    const id = updatedItem.id
    console.log('ITEM ID:', id)
    items.forEach((item, i) => {
      console.log('UPDATING ITEMS')
      if(item.id === id) {
        // console.log('CURR ITEM:', currItems[i])
        items[i] = updatedItem
        // console.log('CURRITEMS:', items)
        dispatch(setItems(items))
        // setCurrItemsState(currItems)
      }
    })
  }

  const updateSoldItems = (id) => {
    let currItems = []
    console.log('SOLD ITEM ID:', id)
    items.forEach((item, i) => {
      console.log('CURRENT ITEMS ID:', id)
      // console.log('UPDATING ITEMS')
      if(Number(item.id) !== Number(id)) {
        console.log('IDS DO NOT MATCH')
        // console.log()
        // console.log('CURR ITEM:', currItems[i])
        currItems.push(item)
        console.log('CURRITEMS:', items)

        // setCurrItemsState(currItems)
      }
      dispatch(setItems(currItems))
    })
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogOpen = (itemData) => {
    console.log('ITEM DATA:', itemData)
    setCurrItemId(itemData.itemId)
    setDialogOpen(true)
  }

  const submitBid = async () => {
    const body = {
      bidInput,
      currUserId
    }

    const res = await fetch(`http://localhost:8080/api/items-and-services/${currItemId}/bid`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    const updatedItem = await res.json()

    console.log('RETURNED UPDATED ITEM:', updatedItem)

    updateItems(updatedItem)
    // alert(`bid of $${bidInput} was placed`)
  }

  const handlePurchase = async () => {
    const body = {
      currUserId
    }

    const res = await fetch(`http://localhost:8080/api/items-and-services/${currItemId}/purchase`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    const {soldItemId} = await res.json()
    console.log(soldItemId)

    updateSoldItems(soldItemId)
  }

  const handleClick = (sellerId) => {
    history.replace('/seller-profile')
    console.log(sellerId)
  }

  const openBidModal = (itemData) => {
    console.log('ITEM DATA:', itemData)
    setCurrItemId(itemData.itemId)
    setCurrBid(itemData.currentBid)
    setCurrItemPrice(itemData.itemPrice)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  return(
      <div className="items-body-container">
      <div className="items-container">
        <Grid container spacing={4} className={classes.grid} >
          {items.map((item) => {
            let ext = item.image_data
            console.log(ext)
            return (
              <Grid item xs={12} md={12}>
                <Link to={`/seller-profile/${item.seller_id}`}>
                <CardActionArea >
                  <Card className={classes.paper}>
                    <CardContent className={classes.image}>
                      <img className="item-image-homepage" src={`data:image/png;bas64`,require(`../../uploads/${ext}`).default} />
                    </CardContent>
                  </Card>
                </CardActionArea>
                </Link>
              </Grid>
            )
          })}
        </Grid>
      </div>
      <div className="item-data-container">
        <ul>
          {items.map((item, idx) => {
            // console.log(item)
            // <li>{item.name}</li>
            console.log('MAPPED ITEMS:',item)

            return(
              <>
                <li>{item.name}</li>
                <li>Buy Now for: ${item.price}</li>
                <li>Current Bid Amount: ${item.current_bid ? item.current_bid : 0}</li>
                <li>{item.num_bids} bidders</li>
                <li>**Days Remaining</li>
                <Button variant="contained" color="primary" onClick={() => {openBidModal({'itemId': item.id, 'currentBid': item.current_bid, 'itemPrice': item.price})}}>
                  Bid
                </Button>
                <Button variant="contained" color="primary" onClick={() => {handleDialogOpen({'itemId': item.id, 'currentBid': item.current_bid, 'itemPrice': item.price})}}>
                  Buy Now
                </Button>
              </>
            )
          })}
        </ul>

      </div>


      {/* BID MODAL */}


      <Modal
      open={modalOpen}
      onClose={closeModal}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      >
        <div className={classes.itemFormModal}>
          <h2 id="simple-modal-title">Place Your Bid:</h2>
          <div>
            <FormControl>
              <InputLabel htmlFor="bid-input">Bid Amount</InputLabel>
              <Input id="bid-input" onChange={updateBidInput} autoFocus />
            </FormControl>
          </div>
          <div>
          <Button
            variant="contained"
            color="primary"
            style={{ color: "white" }}
            size="small"
            className={classes.submitButton}
            onClick={() => {
              if(Number(bidInput) < currBid) {
                alert('Your bid must be larger than the current bid amount')
              } else if(Number(bidInput) > currItemPrice) {
                alert('Your bid must be less than the item sell price')
              } else {
                submitBid()
              }
            }}
            type="submit"
          >
            Submit Bid
          </Button>
          </div>
        </div>
      </Modal>


      {/* BUY NOW DIALOG BOX */}

      <Dialog
      open={dialogOpen}
      onClose={handleDialogClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure that you want to purchase this item at its full sale price?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button color="primary" autoFocus onClick={handlePurchase}>
            Purchase Item
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Items;
// onClick={() => {handleClick(item.seller_id)}}
