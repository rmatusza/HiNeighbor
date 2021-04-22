import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { 
  Grid, 
  Button,
  Dialog,
  TextField,
  DialogActions,
  DialogTitle,
  useMediaQuery,
  Card,
  CardContent,
  makeStyles,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell
  } from "@material-ui/core";
import './sellerProfile.css';


const useStyles = makeStyles((theme) => ({
  grid: {
    width: '100%',
    margin: '0px',
  },
  paper: {
    marginLeft: "20px",
    display: "flex",
    justifyContent: "center"
  },
  image: {
    display: "flex",
    justifyContent: "center",
    height: '280px',
    width: '280px',
  },
  paper_large_screen: {
    marginLeft: "20px",
    display: "flex",
    justifyContent: "center"
  },
  image_large_screen: {
    display: "flex",
    justifyContent: "center",
    height: '280px',
    width: '280px',
  },
  typography: {
    fontSize: theme.typography.fontSize
  },
  itemFormModal: {
    position: "absolute",
    top: 100,
    left: 600,
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
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
    width: '400px',
    height: '94px'
  },
  tableCell: {
    color: theme.palette.secondary.contrastText
  },
  gridItem: {
    width: '100%',
    borderRadius: '5px'
  },
  image: {
    display: "flex",
    justifyContent: "center",
    height: '210px',
    width: '200px',
  },

}))

const date = new Date()
const day = date.getDate()
const month = date.getMonth() + 1
const year = date.getFullYear()
const today = new Date(month+'-'+day+'-'+year)

const SellerProfileForRent = (props) => {
  const currUserId = useSelector(store => store.session.currentUser.id);
  let itemData = props.itemData['user_data']['items_for_rent']
  let tableData = props.itemData['table_data']
  const [currItem, setCurrItem] = useState()
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [rentTotal, setRentTotal] = useState(null)
  const [selectedDateString, setSelectedDateString] = useState(null)
  const [confirmRentDialog, setConfirmRentDialog] = useState(false);
  const classes = useStyles()
  const largeScreen = useMediaQuery('(min-width:1870px)');

  const updateSoldItems = (id) => {
    tableData[id].expiry_date = selectedDateString
    tableData[id].rented = true
  }

  const handleDialogOpen = (itemData, idx) => {
    if(itemData.rented === true){
      alert(`This Item is Being Rented by Another User Until the Specified Return Date`)
      return
    }
    setCurrItem(itemData)
    setDialogOpen(true)
  };

  const handleCloseAll = () => {
    setDialogOpen(false)
    setConfirmRentDialog(false)
  }

  const handleUpdateDate = (e) => {
    setSelectedDate(e.target.value)
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

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
    setRentTotal(total)
    setSelectedDateString(chosenDateString)
    setConfirmRentDialog(true)
  };

  const handleCloseConfirmRentDialog = () => {
    setConfirmRentDialog(false)
  }

  const handleRentItem = async () => {
    let rate = currItem.rate
    let seller_name = currItem.seller_name
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

    await fetch(`http://localhost:5000/api/items-and-services/${currItem.id}/rent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    updateSoldItems(currItem.id)
    handleCloseAll()
  }

  return(
    <>
      <div className="divider"/>
      {itemData.length > 0 ?
        <Grid container spacing={3} className={classes.grid}>
          {itemData.map((item, idx) => {
            let url = item.image_url
            return (
                <Grid item xs={12} md={12} lg={largeScreen ? 6 : 12} className={classes.gridItem}>
                  <div className="seller-items-body-container">
                    <div className="seller-page-item-cards">
                      <div className="item-name-seller-profile"><h2 className="item-text">{item.name}</h2></div>
                      <div className="image-container-seller-profile">
                        <Card className={largeScreen ? classes.paper_large_screen : classes.paper}>
                          <CardContent className={largeScreen ? classes.image_large_screen : classes.image}>
                            <img alt="for-rent-item-seller-profile" className="item-image" src={url} />
                          </CardContent>
                        </Card>
                        <div className="rent-button-container-for-rent-seller-profile">
                          <Button color="secondary" style={{width: "158.03px"}} size="medium" variant="contained" onClick={() => {handleDialogOpen(item, idx)}}>
                            Rent
                          </Button>
                        </div>
                      </div>
                      <div className="description-table-container">
                        <div className="table-container">
                          <TableContainer className={classes.tableContainer}>
                            <Table className={classes.table} size="small" aria-label="a dense table">
                              <TableHead className={classes.tableHead}>
                                <TableRow>
                                  <TableCell align="center" className={classes.tableCell}>Category</TableCell>
                                  <TableCell align="center" className={classes.tableCell}>Daily Rate</TableCell>
                                  <TableCell align="center" className={classes.tableCell}>Availablity</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow key={tableData[idx].name}>
                                  <TableCell align="center">{tableData[idx].category}</TableCell>
                                  <TableCell align="center">${tableData[idx].rate}</TableCell>
                                  <TableCell align="center">{tableData[idx].rented === true ? `Unavailable Until: ${tableData[idx].expiry_date}` : 'Available'}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </div>
                        <div className="seller-profile-rent-item-description-conatiner">
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
         <h1>No Items Have Been Posted For Rent by This User</h1>
       </div>
      }
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
                  name="cancel-button"
                >
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

          {/* <Dialog
          open={enlargeImage}
          onClose={closeImage}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          >
            <img className="item-image-enlarged" src={image} />
          </Dialog> */}

    </>
  )
};

export default SellerProfileForRent;
