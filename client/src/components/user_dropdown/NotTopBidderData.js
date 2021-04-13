import React, { useState } from 'react';
import { useSelector, connect } from 'react-redux';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Bid from '../bid_functionality/Bid';
import { setBidHistory } from '../../actions/itemsActions';

const useStyles = makeStyles((theme) => ({
    grid: {
      width: '100%',
      marginTop: '30px',
    },
    paper: {
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

  let arr = []

const NotTopBidderData = (props) => {
  const currUserId = useSelector(store => store.session.currentUser.id);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currItemId, setCurrItemId] = useState(null);
  const [propsItemDataArrayIdx, setPropsItemDataArrayIdx] = useState(null);
  const classes = useStyles();

  //('TOP BIDDER DATA:', props.topBids)

  const handleDialogOpen = (itemData) => {
    //('ITEM DATA:', itemData)
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

  //(props)
  if(props.items.length === 0){
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
          {props.items.map((data, idx) => {
            let chosenMonth = data.bid_date.slice(5, 7)
            let chosenDay = data.bid_date.slice(8, 10)
            let chosenYear = data.bid_date.slice(0, 4)
            let fullDate = chosenMonth + '-' + chosenDay + '-' + chosenYear
            return (
              <div className="top-bidder-inner-container" key={idx}>
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
                      <Bid dataRows={props.items} idx={idx} action={props.updateItems} arr={props.arr} bidderData={props.bidderData} topBidderItems={props.topBidderItems} onBidHistoryPage={props.onBidHistoryPage}/>
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

const mapStateToProps = state => {
  return {
    items: state.entities.bid_history.otherBids,
    topBidderItems: state.entities.bid_history.topBidder,
    arr,
    length: arr.length,
    onBidHistoryPage: true
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateItems: (items) => dispatch(setBidHistory(items))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotTopBidderData)

