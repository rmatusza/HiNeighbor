import { React, useState, useEffect } from 'react';
import { useDispatch, useSelector, connect } from "react-redux";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { 
  Grid, 
  Button, 
  Modal, 
  FormControl, 
  InputLabel, 
  Input,
  Dialog,
  DialogTitle,
  DialogActions

} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import './sellerProfile.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
  grid: {
    width: '100%',
    margin: '0px',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    backgroundColor: 'white',
    background: 'white',
    color: theme.palette.secondary.contrastText,
    height: '300px',
    width: '300px',
    marginLeft: '20px',
    paddingTop: '50px',
    paddingBottom: '50px',
    paddingLeft: '20px'
  },
  typography: {
    fontSize: theme.typography.fontSize
  },
  image: {
    display: "flex",
    justifyContent: "center",
    alignSelf: 'center',
    alignItems: "center",
    padding: '10px',
    height: '300px',
    width: '300px',
    marginBottom: '200px',
    paddingRight: '50px'
  },
  paper_large_screen: {
    padding: theme.spacing(2),
    textAlign: 'center',
    backgroundColor: 'white',
    background: 'white',
    color: theme.palette.secondary.contrastText,
    height: '200px',
    width: '200px',
    marginLeft: '20px',
    paddingTop: '50px',
    paddingBottom: '50px',
    paddingLeft: '20px'
  },
  image_large_screen: {
    display: "flex",
    justifyContent: "center",
    alignSelf: 'center',
    alignItems: "center",
    padding: '10px',
    height: '200px',
    width: '200px',
    marginBottom: '200px',
    paddingRight: '50px'
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
    // minWidth: 650,
    minWidth: 350,
  },
  tableHead: {
    backgroundColor: theme.palette.secondary.main
  },
  tableRow: {
    backgroundColor: 'whitesmoke'
  },
  tableContainer: {
    paddingBottom: '0px',
    backgroundColor: 'white',
    height: '70px',
    width: '400px',
    height: '94px'
  },
  tableCell: {
    color: theme.palette.secondary.contrastText
  },
  gridItem: {
    width: '100%',
    // border: '2px solid black',
    borderRadius: '5px'
  },
  buttons: {
    width: '160px'
  },
}))
// rgb(206, 204, 204)

const SellerProfileForSale = (props) => {
  const currUserId = useSelector(store => store.session.currentUser.id);
  // let items = useSelector(store => store.entities.items_state.saleItems);
  let itemData = props.itemData['user_data']['items_for_sale'];
  let tableData = props.itemData['table_data'];
  let user = props.itemData['user_data']['user']['username'];
  const [bidInfo, setBidInfo] = useState({})
  const [bidInput, setBidInput] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currItemId, setCurrItemId] = useState(null);
  const [currBid, setCurrBid] = useState(null);
  const [currItemPrice, setCurrItemPrice] = useState(null);
  const [propsItemDataArrayIdx, setPropsItemDataArrayIdx] = useState(null)
  const classes = useStyles();
  const dispatch = useDispatch();
  const largeScreen = useMediaQuery('(min-width:1870px)');

  // console.log('TABLE DATA:', tableData)

  const handleDialogOpen = (itemData) => {
    // console.log('ITEM DATA:', itemData)
    setCurrItemId(itemData.itemId)
    setPropsItemDataArrayIdx(itemData.idx)
    setDialogOpen(true)
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const openBidModal = (itemData) => {
    setCurrItemId(itemData.itemId)
    setCurrBid(itemData.currentBid)
    setCurrItemPrice(itemData.itemPrice)
    setPropsItemDataArrayIdx(itemData.idx)
    setModalOpen(true)
  };

  const closeModal = () => {
    setModalOpen(false)
  };

  const updateBidInput = (e) => {
    setBidInput(e.target.value)
  };

  const updateItems = (updatedItem) => {
    props.itemData['table_data'][propsItemDataArrayIdx].current_bid = updatedItem.current_bid
  };

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
    updateItems(updatedItem)
    setModalOpen(false)
  };

  const updateSoldItems = () => {
    props.itemData['table_data'].splice(propsItemDataArrayIdx, 1)
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
    updateSoldItems()
    handleDialogClose()
  };

  return(
    <>
      <div className="divider">
      </div>
      {tableData.length > 0 ?
            <Grid container spacing={3} className={classes.grid} >
              {tableData.map((item, idx) => {
                // console.log(item)
                bidInfo[item.id] = item.current_bid
                let url = item.image_url
                return (
                  <>
                  <Grid item xs={12} md={12} lg={largeScreen ? 6 : 12} className={classes.gridItem} key={idx}>
                    <div className="seller-items-body-container">
                        <div className="seller-page-item-cards">
                          <div className="image-container-seller-profile">
                          <div className="item-name-seller-profile"><h2 className="item-text">{item.name}</h2></div>
                            <Card className={largeScreen ? classes.paper_large_screen : classes.paper}>
                              <CardContent className={largeScreen ? classes.image_large_screen : classes.image}>
                                <img className="item-image" src={url} />
                              </CardContent>
                            </Card>
                          </div>
                          <div className="description-table-container">
                            <div className="table-container">
                              <TableContainer className={classes.tableContainer}>
                                <Table className={classes.table} size="small" aria-label="a dense table">
                                  <TableHead className={classes.tableHead}>
                                    <TableRow>
                                      {/* <TableCell align="right">Item Name</TableCell> */}
                                      <TableCell align="center" className={classes.tableCell}>Full Sale Price</TableCell>
                                      <TableCell align="center" className={classes.tableCell}>Current Bid</TableCell>
                                      <TableCell align="center" className={classes.tableCell}>Number of Bidders</TableCell>
                                      <TableCell align="center" className={classes.tableCell}>Days Remaining</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    <TableRow key={tableData[idx].name}>
                                      <TableCell align="center">${item.price}</TableCell> 
                                      <TableCell align="center">${item.current_bid}</TableCell>
                                      <TableCell align="center">{item.num_bidders}</TableCell>
                                      <TableCell align="center">{item.days_remaining}</TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </div>
                            <div className="item-description-conatiner">
                              {item.description}
                            </div>
                          </div>
                          <div className="bid-buy-buttons-container-seller-profile">
                            <div className="bid-button">
                              <Button color="secondary" variant="contained" onClick={() => {openBidModal({'itemId': item.item_id, 'currentBid': item.current_bid, 'itemPrice': item.price, 'idx': idx})}} className={classes.buttons}>
                                Bid
                              </Button>
                            </div>
                            <div className="divider-container">
                              <div className="bid-purchase-divider"></div>
                            </div>
                            <div className="buy-button">
                              <Button color="secondary" size="medium" variant="contained" onClick={() => {handleDialogOpen({'itemId': item.item_id, 'currentBid': item.current_bid, 'itemPrice':item.price, 'idx': idx})}} className={classes.buttons}>
                                Purchase
                              </Button>
                            </div>
                          </div>
                        </div>
                        </div>
                    </Grid>
                    {/* <div className="divider">
                    </div> */}
                  </>
                )
              })}
            </Grid>
       :
       <div className="no-items-message-seller-profile">
         <h1>No Items Have Been Posted For Sale by This User</h1>
       </div>
      }

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
              <InputLabel htmlFor="bid-input" style={{color: "black"}}>Bid Amount:</InputLabel>
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
};

export default SellerProfileForSale;
