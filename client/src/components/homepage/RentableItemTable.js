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
    backgroundColor: "black",
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
    color: theme.palette.secondary.main,
    marginBottom: '5px',
    color: "white"
  },
  cancelButton: {
    marginBottom: '5px',
    color: theme.palette.secondary.main,
    color: "white"
  }
}))

function createData(name, rate,rented, id, seller_username, image_url, category, description, seller_id, return_date) {
  return { name, rate,rented, id, seller_username, image_url, category, description, seller_id, return_date};
}
// sets the current date as the default date for the date picker

const date = new Date()
const day = date.getDate()
const month = date.getMonth() + 1
const year = date.getFullYear()
//(year)
//(day)
//(month)
const today = new Date(month+'-'+day+'-'+year)

const RentableItemTable = () => {
  let rentItems = useSelector(store => store.entities.items_state.rentItems);
  const currUserId = useSelector(store => store.session.currentUser.id);
  const [currItem, setCurrItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmRentDialog, setConfirmRentDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [rentTotal, setRentTotal] = useState(null)
  const [selectedDateString, setSelectedDateString] = useState(null)
  const [enlargeImage, setEnlargeImage] = useState(false);
  const [image, setImage] = useState(null);
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const updateItems = (updatedItem) => {
    const id = updatedItem.id
    rentItems.forEach((item, i) => {
      if(item.id === id) {
        rentItems[i] = updatedItem
        dispatch(setRentItems(rentItems))
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
    setSelectedDate(e.target.value)
  }
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogOpen = (itemData) => {
    if(itemData.rented === true){
      alert(`This Item is Being Rented by Another User Until the Specified Return Date`)
      return
    }
    setCurrItem(itemData)
    setDialogOpen(true)
  }

  const handleConfirmRentDialog = () => {
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const today = new Date(month+'-'+day+'-'+year)

    let chosenMonth = selectedDate.slice(5, 7)
    let chosenDay = selectedDate.slice(8)
    let chosenYear = selectedDate.slice(0, 4)
    let chosenDateObj = new Date(chosenMonth + '-' + chosenDay + '-' + chosenYear)

    if(chosenDateObj < today) {
      alert('Please Select a Future Date')
      return
    }

    let chosenDateString = chosenMonth + '-' + chosenDay + '-' + chosenYear
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const rentPeriod = Math.round(Math.abs((chosenDateObj - today) / oneDay));
    const total = rentPeriod * currItem.rate
    //(total)
    setRentTotal(total)
    // setSelectedDate(chosenDateObj)
    setSelectedDateString(chosenDateString)
    setConfirmRentDialog(true)
  }

  const handleEnlargeImage = (image) => {
    setImage(image)
    setEnlargeImage(true)
  }

  const closeImage = () => {
    setEnlargeImage(false)
  }

  const handleCloseAll = () => {
    setDialogOpen(false)
    setConfirmRentDialog(false)
  }

  const handleClick = (sellerId) => {
    history.replace(`/seller-profile/${sellerId}`)
  }

  const handleCloseConfirmRentDialog = () => {
    setConfirmRentDialog(false)
  }

  const handleRentItem = async () => {
    //(currItem)
    let rate = currItem.rate
    let seller_name = currItem.seller_username
    let itemName = currItem.name
    let imageURL = currItem.image_url
    let category = currItem.category
    let seller_id = currItem.seller_id
    const body = {
      currUserId,
      itemName,
      seller_name,
      today,
      selectedDateString,
      rentTotal,
      imageURL,
      category,
      rate,
      seller_id
    }

    const res = await fetch(`/api/items-and-services/${currItem.id}/rent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    const {new_rent_item} = await res.json()
    //(new_rent_item)
    updateSoldItems(currItem.id)
    handleCloseAll()
  }

  let dataRowsRent = []

    {if(rentItems[0] === 'no_items') {
      return(
        <div className="items-body-container">
        <h1 className="no-results-heading">No Results Found</h1>
      </div>
      )
    } else {
      return(
        <div className="home-page-rent-items-container">
          <div className="home-page-rent-items-container__photos-outer-container">
              {rentItems.map((item) => {
                let url = item.image_url
                return (
                  <div className="home-page-rent-items-container__photos-inner-container">
                    <CardActionArea className={classes.cardActionArea} onClick={() => handleEnlargeImage(url)}>
                      <Card className={classes.paper}>
                        <CardContent className={classes.image}>
                          <img className="item-image-homepage" src={url} />
                        </CardContent>
                      </Card>
                    </CardActionArea>
                  </div>
                )
              })}
          </div>
          <div className="home-page-rent-items-container__item-table-and-description-outer-container">
            {rentItems.forEach((item, idx) => {
              let date;
              if(item.expiry_date){
                let month = item.expiry_date.slice(5,7)
                let day = item.expiry_date.slice(8,10)
                let year = item.expiry_date.slice(0, 4)
                date = month+'-'+day+'-'+year
              }
              dataRowsRent.push(createData(item.name, item.rate, item.rented, item.id, item.seller_name, item.image_url, item.category, item.description, item.seller_id, date))
            })}
            {dataRowsRent.map((item, idx) => {
              return(
                <div className="home-page-rent-items-container__item-table-and-description-inner-container">
                  <TableContainer className="home-page-rent-items-container__item-table-and-description-inner-container__table-container">
                    <Table className="home-page-rent-items-container__item-table-and-description-inner-container__table-container__table" size="small" aria-label="a dense table">
                      <TableHead className={classes.tableHead}>
                        <TableRow className={classes.tableHead}>
                          {/* <TableCell align="right">Item Name</TableCell> */}
                          <TableCell align="right" className={classes.tableCell}>Seller Name</TableCell>
                          <TableCell align="right" className={classes.tableCell}>Item Name</TableCell>
                          <TableCell align="right" className={classes.tableCell}>Rate per Day</TableCell>
                          <TableCell align="right" className={classes.tableCell}>Availablity</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow key={dataRowsRent[idx].name}>
                          <TableCell align="right">{dataRowsRent[idx].seller_username}</TableCell>
                          <TableCell align="right">{dataRowsRent[idx].name}</TableCell>
                          <TableCell align="right">${dataRowsRent[idx].rate}</TableCell>
                          <TableCell align="right">{dataRowsRent[idx].rented === true ? `Unavailable Until: ${dataRowsRent[idx].return_date}` : 'Available'}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <div className="home-page-rent-items-container__item-table-and-description-inner-container__description-container">
                    <p>
                      {dataRowsRent[idx].description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="home-page-rent-items-container__buttons-outer-container">
            {dataRowsRent.map((item, idx) => {
              return(
                <div className="home-page-rent-items-container__buttons-inner-container">
                  <div className="buy-button">
                    <Button variant="contained" color="secondary" style={{width: "158.03px"}} size="medium" variant="contained" onClick={() => {handleDialogOpen(dataRowsRent[idx])}}>
                      Rent
                    </Button>
                  </div>
                  <div className="divider-container">
                    <div className="bid-purchase-divider"></div>
                  </div>
                  <div className="seller-profile-button">
                    <Button color="secondary" size="medium" variant="contained" onClick={() => {handleClick(dataRowsRent[idx].seller_id)}}>
                      View Seller Info
                    </Button>
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
          maxWidth='sm'
          // className={classes.rentDialog}
          >
            <div className="rent-item-dbox-content-container">
              <div className="date-picker-container">
                {/* <div className="rent-item-dbox-content-container__inner-container"> */}
                  <h5>Note: If you choose to rent this item, the beginning of the rent period will start today</h5>
                  <h3 className="select-return-date-heading">Please Select a Return Date:</h3>
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
                {/* </div> */}
              </div>
              <div className="rent-item-buttons-container">
                <div className="rent-item-buttons">
                  <Button
                  variant="contained"
                  color="secondary"
                  // style={{ color: "white" }}
                  size="small"
                  className={classes.confirmButton}
                  onClick={handleConfirmRentDialog}
                  type="submit"
                  name="confirm-button">
                    Confirm
                  </Button>
                  <Button
                  variant="contained"
                  color="secondary"
                  // style={{ color: "white" }}
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
              {`Are you sure that you want to rent the selected item, which is to be returned on ${selectedDateString}, for a total of $${rentTotal}?`}
            </DialogTitle>
            <DialogActions>
              <Button onClick={handleCloseConfirmRentDialog} color="secondary">
                Cancel
              </Button>
              <Button color="secondary" onClick={handleRentItem}>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

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

export default RentableItemTable;
