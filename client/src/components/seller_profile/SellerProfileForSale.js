import { React, useState } from 'react';
import { useSelector, connect } from "react-redux";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { 
  Grid, 
  Button, 
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
import Bid from '../bid_functionality/Bid';
import { setSellerProfileItemsForSale } from '../../actions/itemsActions';


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
    backgroundColor: '#ff5e00'
  },
  tableRow: {
    backgroundColor: 'whitesmoke'
  },
  tableContainer: {
    paddingBottom: '0px',
    backgroundColor: 'white',
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

let test = []


const SellerProfileForSale = (props) => {

  const currUserId = useSelector(store => store.session.currentUser.id);
  let tableData = props.itemData['table_data'];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currItemId, setCurrItemId] = useState(null);
  const [propsItemDataArrayIdx, setPropsItemDataArrayIdx] = useState(null)
  const classes = useStyles();
  const largeScreen = useMediaQuery('(min-width:1870px)');

  const handleDialogOpen = (itemData) => {
    setCurrItemId(itemData.itemId)
    setPropsItemDataArrayIdx(itemData.idx)
    setDialogOpen(true)
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const updateSoldItems = () => {
    props.itemData['table_data'].splice(propsItemDataArrayIdx, 1)
  }

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

  return(
    <>
      <div className="divider">
      </div>
      {tableData.length > 0 ?
            <Grid container spacing={3} className={classes.grid} >
              {tableData.map((item, idx) => {
                let url = item.image_url
                return (
                  <Grid item xs={12} md={12} lg={largeScreen ? 6 : 12} className={classes.gridItem} key={idx}>
                    <div className="seller-items-body-container">
                      <div className="seller-page-item-cards">
                      <div className="item-name-seller-profile"><h2 className="item-text">{item.name}</h2></div>
                        <div className="image-container-seller-profile">
                          <Card className={largeScreen ? classes.paper_large_screen : classes.paper}>
                            <CardContent className={largeScreen ? classes.image_large_screen : classes.image}>
                              <img alt="for-sale-item-seller-profile" className="item-image" src={url} />
                            </CardContent>
                          </Card>
                          <div className="bid-buy-buttons-container-seller-profile">
                            <Bid dataRows={props.items} idx={idx} action={props.updateItems} arr={props.arr}/>
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
                                    <TableCell align="center">${item.current_bid ? item.current_bid : 0}</TableCell>
                                    <TableCell align="center">{item.num_bids}</TableCell>
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
                      </div>
                    </div>
                  </Grid>
                )
              })}
            </Grid>
       :
       <div className="no-items-message-seller-profile">
         <h1>No Items Have Been Posted For Sale by This User</h1>
       </div>
      }

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

const mapStateToProps = state => {
  return {
    items: state.entities.seller_profile.saleItems,
    arr: test,
    length: test.length
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateItems: (items) => dispatch(setSellerProfileItemsForSale(items))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SellerProfileForSale)
