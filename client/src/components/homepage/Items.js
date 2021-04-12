import React, { useState } from 'react';
import { useDispatch, useSelector, connect } from "react-redux";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  CardActionArea,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { setItems } from '../../actions/itemsActions';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useHistory } from "react-router-dom";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { CgArrowsExpandLeft, /*CgGoogle*/ } from "react-icons/cg";
import Bid from '../bid_functionality/Bid';
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
    // height: '70px',
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

let test = []

const Items = (props) => {
  let items = useSelector(store => store.entities.items_state.saleItems)
  const currUserId = useSelector(store => store.session.currentUser.id)
  const [currItemId, setCurrItemId] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [enlargeImage, setEnlargeImage] = useState(false);
  const [image, setImage] = useState(null);
  const classes = useStyles()
  const dispatch = useDispatch()
  const history = useHistory();
  
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

  let dataRows = []

  if(items[0] === 'no_items') {
      return(
        <div className="items-body-container-no-items">
          <h1 className="no-results-heading">No Results Found</h1>
        </div>
      )
    }else {
      return(
        <div className="home-page-sale-items-container">
          <div className="home-page-sale-items-container__photos-outer-container">
            {props.items.map((item, idx) => {
              let url = item.image_url
              return (
                <div className="home-page-sale-items-container__photos-inner-container" key={idx}>
                  <CardActionArea className={classes.cardActionArea} onClick={() => handleEnlargeImage(item.image_url)}>
                    <Card className={classes.paper}>
                      <div className="home-page-sale-items-container__photos-inner-container__expand-icon-outer-container">
                        <div className="home-page-sale-items-container__photos-inner-container__expand-icon-inner-container">
                          <CgArrowsExpandLeft className="expand-icon"/>
                        </div>
                      </div>
                      <CardContent className={classes.image}>
                        <img alt="item" className="item-image-homepage" src={url} />
                      </CardContent>
                    </Card>
                  </CardActionArea>
                </div>
              )
            })}
          </div>
          <div className="home-page-sale-items-container__item-table-and-description-outer-container">
            {props.items.forEach((item, idx) => {
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
            {props.items.map((item, idx) => {
              return(
                <div className="home-page-sale-items-container__item-table-and-description-inner-container" key={idx}>
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
            {props.items.map((item, idx) => {
              return(
                <div className="home-page-sale-items-container__buttons-inner-container" key={idx}>
                  <Bid dataRows={props.items} idx={idx} action={props.updateItems} arr={props.arr}/>
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
            <img alt="enlarged-item" className="item-image-enlarged" src={image} />
          </Dialog>
        </div>
      )
    }
  
}

const mapStateToProps = state => {
  return {
    items: state.entities.items_state.saleItems,
    arr: test,
    length: test.length
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateItems: (items) => dispatch(setItems(items))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Items)