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
import { CgArrowsExpandLeft } from "react-icons/cg";
import './homepage.css'

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
    width: '100%',
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


const Items = () => {
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

  {if(items[0] === 'no_items') {
      return(
        <div className="items-body-container-no-items">
          <h1 className="no-results-heading">No Results Found</h1>
        </div>
      )
    }else {
      return(
        <div className="home-page-sale-items-container">
          <div className="home-page-sale-items-container__photos-outer-container">
            {items.map((item) => {
              let url = item.image_url
              return (
                <div className="home-page-sale-items-container__photos-inner-container">
                  <CardActionArea className={classes.cardActionArea} onClick={() => handleEnlargeImage(item.image_url)}>
                    <Card className={classes.paper}>
                      <div className="home-page-sale-items-container__photos-inner-container__expand-icon-outer-container">
                        <div className="home-page-sale-items-container__photos-inner-container__expand-icon-inner-container">
                          <CgArrowsExpandLeft className="expand-icon"/>
                        </div>
                      </div>
                      <CardContent className={classes.image}>
                        <img className="item-image-homepage" src={url} />
                      </CardContent>
                    </Card>
                  </CardActionArea>
                </div>
              )
            })}
          </div>
          <div className="home-page-sale-items-container__item-table-and-description-outer-container">
            {items.forEach((item, idx) => {
              const d1 = new Date(item.expiry_date)
              const today = new Date()
              today.setDate(today.getDate()+0)
              const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
              const days_remaining = Math.round(Math.abs((today - d1) / oneDay));
              if(item.current_bid === null) {
                dataRows.push(createData(item.name, item.price, 0, item.num_bids, days_remaining, item.id, item.current_bid, item.price, item.seller_id, item.description))
              } else {
                dataRows.push(createData(item.name, item.price, item.current_bid, item.num_bids, days_remaining, item.id, item.current_bid, item.price, item.seller_id, item.description))
              }

            })}
            {dataRows.map((item, idx) => {
              return(
                <div className="home-page-sale-items-container__item-table-and-description-inner-container">
                  <TableContainer className="home-page-sale-items-container__item-table-and-description-inner-container__table-container">
                    <Table className="home-page-sale-items-container__item-table-and-description-inner-container__table-container__table"
                    size="small" aria-label="a dense table"
                    >
                      <TableHead className={classes.tableHead}>
                        <TableRow className={classes.tableHead}>
                          {/* <TableCell align="right">Item Name</TableCell> */}
                          <TableCell align="center" className={classes.tableCell}>Item Name</TableCell>
                          <TableCell align="center" className={classes.tableCell}>Full Sale Price</TableCell>
                          <TableCell align="center" className={classes.tableCell}>Current Bid</TableCell>
                          <TableCell align="center" className={classes.tableCell}>Number of Bidders</TableCell>
                          <TableCell align="center" className={classes.tableCell}>Days Remaining</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>

                        <TableRow key={dataRows[idx].name}>
                          <TableCell align="center">{dataRows[idx].name}</TableCell>
                          <TableCell align="center">${dataRows[idx].price}</TableCell>
                          <TableCell align="center">${dataRows[idx].bid}</TableCell>
                          <TableCell align="center">{dataRows[idx].num_bidders}</TableCell>
                          <TableCell align="center">{dataRows[idx].days_remaining}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <div className="home-page-sale-items-container__item-table-and-description-inner-container__description-container">
                    <p>
                      {dataRows[idx].description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="home-page-sale-items-container__buttons-outer-container">
            {dataRows.map((item, idx) => {
              return(
                <div className="home-page-sale-items-container__buttons-inner-container">
                  <div className="bid-button">
                    <Button color="secondary" variant="contained" onClick={() => {openBidModal({'itemId': dataRows[idx].item_id, 'currentBid': dataRows[idx].current_bid, 'itemPrice': dataRows[idx].item_price})}} className={classes.buttons}>
                      Bid
                    </Button>
                  </div>
                  <div className="divider-container">
                    <div className="bid-purchase-divider"></div>
                  </div>
                  <div className="buy-button">
                    <Button color="secondary" size="medium" variant="contained" onClick={() => {handleDialogOpen({'itemId': dataRows[idx].item_id, 'currentBid': dataRows[idx].current_bid, 'itemPrice': dataRows[idx].item_price})}} className={classes.buttons}>
                      Purchase
                    </Button>
                  </div>
                  <div className="divider-container">
                    <div className="bid-purchase-divider"></div>
                  </div>
                  <div className="seller-profile-button">
                    <Button color="secondary" size="medium" variant="contained" onClick={() => {handleClick(dataRows[idx].sellerId)}} className={classes.buttons}>
                      View Seller Info
                    </Button>
                  </div>
                </div>
              )
            })}
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
                  <InputLabel htmlFor="bid-input" style={{color: "black"}}>Bid Amount</InputLabel>
                  <Input id="bid-input" onChange={updateBidInput} autoFocus style={{color: "black"}}/>
                </FormControl>
              </div>
              <div>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ color: "white" }}
                  size="small"
                  className={classes.submitButton}
                  onClick={() => {
                    if(Number(bidInput) <= currBid) {
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
              <Button onClick={handleDialogClose} className={classes.buttons} color="secondary" variant="contained">
                Cancel
              </Button>
              <Button className={classes.buttons} color="secondary" variant="contained" autoFocus onClick={handlePurchase}>
                Purchase Item
              </Button>
            </DialogActions>
          </Dialog>

        {/* ENLARGED IMAGE DIALOG BOX */}

          <Dialog
          open={enlargeImage}
          onClose={closeImage}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          >
            <img className="item-image-enlarged" src={image} />

          </Dialog>

        </div>
      )
    }
  }
}









export default Items;
