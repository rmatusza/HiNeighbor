import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  Button,
  Modal,
  FormControl,
  Dialog,
  DialogActions,
  DialogTitle,
  Input,
  InputLabel
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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
    tableCell: {
      color: theme.palette.secondary.contrastText
    },
  }))

const NotTopBidderData = (props) => {
  const currUserId = useSelector(store => store.session.currentUser.id);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false)
  const [currItemId, setCurrItemId] = useState(null);
  const [bidInput, setBidInput] = useState(null);
  const [currBid, setCurrBid] = useState(null);
  const [currItemPrice, setCurrItemPrice] = useState(null);
  const [propsItemDataArrayIdx, setPropsItemDataArrayIdx] = useState(null);
  const classes = useStyles();

  console.log('TOP BIDDER DATA:', props.topBids)

  const handleDialogOpen = (itemData) => {
    console.log('ITEM DATA:', itemData)
    setCurrItemId(itemData.itemId)
    setPropsItemDataArrayIdx(itemData.idx)
    setDialogOpen(true)
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const updateSoldItems = () => {
    props.itemData.splice(propsItemDataArrayIdx, 1)
  };

  const handlePurchase = async () => {
    const body = {
      currUserId
    }
    await fetch(`http://localhost:5000/api/items-and-services/${currItemId}/purchase`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    updateSoldItems()
    handleDialogClose()
  };

  const openBidModal = (itemData) => {
    //('ITEM DATA:', itemData)
    setCurrItemId(itemData.itemId)
    setCurrBid(itemData.topBid)
    setCurrItemPrice(itemData.itemPrice)
    setPropsItemDataArrayIdx(itemData.idx)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const updateBidInput = (e) => {
    // //('BID INPUT:', e.target.value)
    setBidInput(e.target.value)
  }

  const updateItems = () => {
    let item = props.itemData.splice(propsItemDataArrayIdx, 1)
    props.topBids.push(...item)
  }

  const submitBid = async () => {

    const body = {
      bidInput,
      currUserId
    }

   await fetch(`http://localhost:5000/api/items-and-services/${currItemId}/bid`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    updateItems()
    setModalOpen(false)
  };

  //(props)
  if(props.itemData.length === 0){
    return(
      <>
        <div className="top-bidder-heading-container">
          <h2>Other Items You've Bid On:</h2>
        </div>
        <div className="no-bid-items">
          <h2>
            No Items Found
          </h2>
        </div>
      </>
    )
  }else{
    return(
      <>
        <div className="top-bidder-heading-container">
          <h2>Other Items You've Bid On:</h2>
        </div>
        <div className="top-bidder-outter-container">
          {props.itemData.map((data, idx) => {
            //(data.bid_date)
            let chosenMonth = data.bid_date.slice(5, 7)
            let chosenDay = data.bid_date.slice(8, 10)
            let chosenYear = data.bid_date.slice(0, 4)
            let fullDate = chosenMonth + '-' + chosenDay + '-' + chosenYear
            //(fullDate)
            return (
              <div className="top-bidder-inner-container">
                <div className="home-page-sale-items-container__photos-inner-container">
                  <Card className={classes.paper}>
                    <CardContent className={classes.image}>
                      <img alt={data.item_name} className="item-image-homepage" src={data.item_photo} />
                    </CardContent>
                  </Card>
                  <div className="bid-buy-buttons-container-other-bids-page">
                    <div className="buy-button-other-bids-page">
                      <Button color="secondary" size="medium" variant="contained" fullWidth={true} onClick={() => {handleDialogOpen({'itemId': data.item_id, 'itemPrice': data.full_price, 'idx': idx})}} >
                        Purchase
                      </Button>
                    </div>
                    <div className="bid-button-other-bids-page">
                      <Button color="secondary" size="medium" variant="contained" fullWidth={true} onClick={() => {openBidModal({'itemId': data.item_id, 'itemPrice': data.full_price, 'topBid': data.top_bid, 'idx': idx})}} className={classes.buttons}>
                        Bid
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="top-bidder-table-container">
                  <TableContainer style={{height: '100px', backgroundColor: 'white'}}>
                    <Table className="top-bidder-table" size="small" aria-label="a dense table">
                      <TableHead className={classes.tableHead}>
                        <TableRow>
                          <TableCell align="center" className={classes.tableCell}>Item Name</TableCell>
                          <TableCell align="center" className={classes.tableCell}>Full Price</TableCell>
                          <TableCell align="center" className={classes.tableCell}>Total Bidders</TableCell>
                          <TableCell align="center" className={classes.tableCell}>Top Bid</TableCell>
                          <TableCell align="center" className={classes.tableCell}>Your Bid</TableCell>
                          <TableCell align="center" className={classes.tableCell}>Bid Date</TableCell>
                          <TableCell align="center" className={classes.tableCell}>Days Remaining in Auction</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableCell align="center" style={{height: '63px'}}>{data.item_name}</TableCell>
                        <TableCell align="center">${data.full_price}</TableCell>
                        <TableCell align="center">{data.num_bidders}</TableCell>
                        <TableCell align="center">${data.top_bid}</TableCell>
                        <TableCell align="center">${data.user_bid}</TableCell>
                        <TableCell align="center">{fullDate}</TableCell>
                        <TableCell align="center">{data.days_remaining}</TableCell>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <div className="top-bid-item-description">
                    <p>
                    {data.item_description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
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
      </>
    )
  }
}

export default NotTopBidderData;
