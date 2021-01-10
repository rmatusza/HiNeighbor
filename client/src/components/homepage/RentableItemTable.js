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
import { setRentItems } from '../../actions/itemsActions';
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
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  grid: {
    width: '50%',
    margin: '0px'
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
    // border: '2px solid black'
  },
  submitButton: {
    marginTop: "2rem",
  },
  dialogBox: {
    width: '200px',
    heigth: '200px'
  },
  table: {
    minWidth: 650,
  },
  tableHead: {
    backgroundColor: theme.palette.secondary.dark,
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
    height: '70px'
  },
  buyNow: {
    maxHeight: "50px"
  },
  cardActionArea: {
    width: '200px'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  rentDialog: {
    width: '300px',
    height: '200px'
  },
  confirmButton: {
    marginBottom: '5px',
  },
  cancelButton: {
    marginBottom: '5px'
  }
}))

function createData(name, rate, available) {
  return { name, rate, available};
}

// sets the current date as the default date for the date picker

const date = new Date()
const day = date.getDate()
const month = date.getMonth() + 1
const year = date.getFullYear()
console.log(year)
console.log(day)
console.log(month)
const today = new Date(month+'-'+day+'-'+year)

const RentableItemTable = () => {
  let rentItems = useSelector(store => store.entities.items_state.rentItems);
  const currUserId = useSelector(store => store.session.currentUser.id);
  const [currItem, setCurrItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmRentDialog, setConfirmRentDialog] = useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date(today));
  const [selectedDateString, setSelectedDateString] = useState(null)
  const [rentTotal, setRentTotal] = useState(null)
  const classes = useStyles();
  const dispatch = useDispatch();

  const updateItems = (updatedItem) => {
    // console.log('CURRENT ITEM OBJECT:', updatedItem)
    const id = updatedItem.id
    // console.log('ITEM ID:', id)
    rentItems.forEach((item, i) => {
      // console.log('UPDATING ITEMS')
      if(item.id === id) {
        // console.log('CURR ITEM:', currItems[i])
        rentItems[i] = updatedItem
        // console.log('CURRITEMS:', items)
        dispatch(setRentItems(rentItems))
        // setCurrItemsState(currItems)
      }
    })
  }

  const updateSoldItems = (id) => {
    let currItems = []
    rentItems.forEach((item, i) => {
      if(Number(item.id) !== Number(id)) {
        currItems.push(item)
      }
      dispatch(setRentItems(currItems))
    })
  }
  const handleUpdateDate = (e) => {
    let chosenDate = e.target.value
    let chosenMonth = chosenDate.slice(5, 7)
    let chosenDay = chosenDate.slice(8)
    let chosenYear = chosenDate.slice(0, 4)
    let chosenDateObj = new Date(chosenMonth + '-' + chosenDay + '-' + chosenYear)
    let chosenDateString = chosenMonth + '-' + chosenDay + '-' + chosenYear
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const rentPeriod = Math.round(Math.abs((chosenDateObj - today) / oneDay));
    const total = rentPeriod * currItem.rate
    console.log(total)
    setRentTotal(total)
    setSelectedDateString(chosenDateString)

  }
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogOpen = (itemData) => {
    console.log('ITEM DATA:', itemData)
    setCurrItem(itemData)
    setDialogOpen(true)
  }

  const handleConfirmRentDialog = () => {
    let rate = currItem.rate

    setConfirmRentDialog(true)
  }

  const handleCloseConfirmRentDialog = () => {
    setConfirmRentDialog(false)
  }

  // const handlePurchase = async () => {

  //   const body = {
  //     currUserId
  //   }

  //   const res = await fetch(`http://localhost:5000/api/items-and-services/${currItemId}/purchase`, {
  //     method: 'PATCH',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(body)
  //   })
  //   const {soldItemId} = await res.json()
  //   console.log(soldItemId)

  //   updateSoldItems(soldItemId)
  //   handleDialogClose()
  // }

  let dataRowsRent = []
  return(
    <div className="items-body-container">
      <div className="items-container">
        <Grid container spacing={4} className={classes.grid} >
          {rentItems.map((item) => {
            console.log('ITEM:', item)
            let url = item.image_url
            return (
              <Grid item xs={12} md={12}>
                <Link to={`/seller-profile/${item.seller_id}`}>
                <CardActionArea className={classes.cardActionArea}>
                  <Card className={classes.paper}>
                    <CardContent className={classes.image}>
                      <img className="item-image-homepage" src={url} />
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
        {rentItems.forEach((item, idx) => {
          dataRowsRent.push(createData(item.name, item.rate, item.sold))
        })}
          {/* console.log(dataRows) */}
        {dataRowsRent.map((item, idx) => {
          return(
            <div className="main-page-rent-items-table-container">
                <TableContainer className={classes.tableContainer}>
                  <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead className={classes.tableHead}>
                      <TableRow className={classes.tableHead}>
                        {/* <TableCell align="right">Item Name</TableCell> */}
                        <TableCell align="right" className={classes.tableCell}>Item Name</TableCell>
                        <TableCell align="right" className={classes.tableCell}>Rate per Day</TableCell>
                        <TableCell align="right" className={classes.tableCell}>Available</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>

                      <TableRow key={dataRowsRent[idx].name}>
                        <TableCell align="right">{dataRowsRent[idx].name}</TableCell>
                        <TableCell align="right">${dataRowsRent[idx].rate}</TableCell>
                        <TableCell align="right">{dataRowsRent[idx].sold === false ? 'False' : 'True'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              <div className="bid-buy-buttons-container">
                {/* <div className="bid-button">
                <Button variant="contained" color="primary" variant="outlined" onClick={() => {openBidModal({'itemId': dataRowsRent[idx].item_id, 'currentBid': dataRowsRent[idx].current_bid, 'itemPrice': dataRowsRent[idx].item_price})}}>
                  Bid
                </Button>
                </div> */}
                {/* <div className="bid-purchase-divider"></div> */}
                <div className="buy-button">
                <Button variant="contained" color="primary" size="medium" variant="outlined" onClick={() => {handleDialogOpen(dataRowsRent[idx])}}>
                  Rent
                </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Dialog
      open={dialogOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      scroll='body'
      fullWidth={true}
      maxWidth='xs'
      // className={classes.rentDialog}
      >
        <div className="rent-item-dbox-content-container">
          <div className="date-picker-container">
            <div>
              <h3 className="select-return-date-heading">Select a Return Date:</h3>
              <form className={classes.container} noValidate>
                <TextField
                  id="date"
                  type="date"
                  defaultValue={selectedDate}
                  className={classes.textField}
                  onChange={handleUpdateDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </form>
            </div>
          </div>
          <div className="rent-item-buttons-container">
            <div className="rent-item-buttons">
              <Button
              variant="contained"
              color="primary"
              style={{ color: "white" }}
              size="small"
              className={classes.confirmButton}
              onClick={handleConfirmRentDialog}
              type="submit"
              name="confirm-button">
                Confirm
              </Button>
              <Button
              variant="contained"
              color="primary"
              style={{ color: "white" }}
              size="small"
              className={classes.cancelButton}
              onClick={handleDialogClose}
              type="submit"
              name="cancel-button">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
      open={confirmRentDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      scroll='body'
      fullWidth={true}
      maxWidth='xs'
      // className={classes.rentDialog}
      >
        <DialogTitle id="alert-dialog-title">
          {`Are you sure that you want to rent the selected item, which is to be returned on ${selectedDateString} for a total of $${rentTotal}?`}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseConfirmRentDialog} color="primary">
            Cancel
          </Button>
          <Button color="primary">
            Purchase Item
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default RentableItemTable;
