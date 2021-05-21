import React, { useState } from 'react';
import UpdateSaleItem from './UpdateSaleItem';
import {
  Card,
  CardContent,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  Button
} from '@material-ui/core';
import { AiOutlineEdit } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";

const useStyles = makeStyles((theme) => ({
  grid: {
    width: '100%',
    marginTop: "30px"
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
  table: {
    minWidth: 650,
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
  tableContainer: {
    paddingBottom: '0px',
    backgroundColor: 'white',
    height: '70px'
  }
}))

function createData(name, price, bid, num_bidders, days_remaining, description, category) {
  return { name, price, bid, num_bidders, days_remaining, description, category};
}

const PostedSaleItems = (props) => {
  const [itemToEditData, setItemToEditData] = useState({'clicked': false, 'data:': {}});
  const [confirmDeleteDialogBox, setConfirmDeleteDialogBox] = useState(false);
  const [errorDialogBox, setErrorDialogBox] = useState(false);
  const [seedDataErrorDialogBox, setSeedDataErrorDialogBox] = useState(false);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState({})
  const [selectedItemToDeleteIdx, setSelectedItemToDeleteIdx] = useState(null)
  const [selectedItemToUpdate, setSelectedItemToUpdate] = useState({})
  const classes = useStyles();

  const closeErrorDialogBox = () => {
    setErrorDialogBox(false)
  }

  const openErrorDialogBox = () => {
    setErrorDialogBox(true)
  }

  const closeSeedDataErrorDialogBox = () => {
    setSeedDataErrorDialogBox(false)
  }

  const openSeedDataErrorDialogBox = () => {
    setSeedDataErrorDialogBox(true)
  }

  const closeConfirmDeleteDialogBox = () => {
    setConfirmDeleteDialogBox(false);
  };

  const openConfirmDeleteDialogBox = (item, idx) => {
    if(item.image_key === null){
      openSeedDataErrorDialogBox()
    } else if(item.num_bids !== 0){
      openErrorDialogBox()
    } else {
      setSelectedItemToDelete(item)
      setSelectedItemToDeleteIdx(idx)
      setConfirmDeleteDialogBox(true)
    }
  }

  let rows = []

  props.postedItems.items_for_sale.forEach((item, idx) => {
    const d1 = new Date(item.expiry_date)
    const today = new Date()
    today.setDate(today.getDate()+0)
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const days_remaining = Math.round(Math.abs((today - d1) / oneDay));
    if(item.current_bid === null) {
      rows.push(createData(item.name, item.price, 0, item.num_bids, days_remaining, item.description, item.category))
    } else {
      rows.push(createData(item.name, item.price, item.current_bid, item.num_bids, days_remaining, item.description, item.category))
    }
  })

  const handleSetItemToEditData =(data, idx) => {
    let itemToUpdateObj = {...selectedItemToUpdate}
    itemToUpdateObj[idx] = true
    setSelectedItemToUpdate(itemToUpdateObj)
    setItemToEditData({'clicked': true, 'data': data, 'rerender_parent': () => {setItemToEditData({'clicked': false, 'data:': {}}); setSelectedItemToUpdate({})}})
	}

  const deleteItem = async() => {
    let image_key = selectedItemToDelete.image_key
    const res = await fetch(`http://localhost:5000/api/items-and-services/delete-posted-sale-item/${selectedItemToDelete.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({image_key})
    })

    const response = await res.json()
    if(response.errors) {
      alert('There was an unexpected error')
      return
    } else if(response.error){
      closeConfirmDeleteDialogBox()
      alert(`${response.status ? response.status : 'Error'}: ${response.error.message ? response.error.message: response.error.name}`)
    } else {
      props.postedItems.items_for_sale.splice(selectedItemToDeleteIdx, 1)
      closeConfirmDeleteDialogBox()
    }
  }

  return(
    <>
      {props.postedItems.items_for_sale.length === 0 ?
        <>
          <h1 className="no-items-posted-heading">No Items Posted for Sale...</h1>
          <h5 className="no-items-posted-heading">HINT: If you would like to post something click on the dropdown menu located at the
            top right of the page and choose either "post an item for rent" or "post an item for sale"
          </h5>
          <div className="items-body-container-user-dropdown">
          </div>
        </>
      :
      <>
        <div className="items-for-sale-heading-container">
          <h1 className="items-for-sale-heading">
            Your Items for Sale:
          </h1>
        </div>
        <div className="body-container-posted-sale-items">
          {props.postedItems.items_for_sale.map((item, idx) => {
            let url = item.image_url
            return (
              <div className="posted-sale-item-outer-container" key={idx}>
                <div className="body-container-posted-sale-items__photos-container">
                  <div className="item-photo-container-posted-sale-items">
                    <Card className={classes.paper}>
                      <CardContent className={classes.image}>
                        <img alt={item.name} className="item-image" src={url} />
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <div className="body-container-posted-sale-items__for-sale-table-container">
                  <div className="body-container-posted-sale-items__for-sale-table-container__for-sale-table">
                    <TableContainer className={classes.tableContainer}  style={{marginRight: "20px"}}>
                      <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead className={classes.tableHead}>
                          <TableRow>
                            <TableCell align="center" className={classes.tableCell}>Item Name</TableCell>
                            <TableCell align="center" className={classes.tableCell}>Category</TableCell>
                            <TableCell align="center" className={classes.tableCell}>Full Sale Price</TableCell>
                            <TableCell align="center" className={classes.tableCell}>Current Bid</TableCell>
                            <TableCell align="center" className={classes.tableCell}>Number of Bidders</TableCell>
                            <TableCell align="center" className={classes.tableCell}>Days Remaining</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow key={rows[idx].name}>
                            <TableCell align="center">{rows[idx].name}</TableCell>
                            <TableCell align="center">{rows[idx].category}</TableCell>
                            <TableCell align="center">${rows[idx].price}</TableCell>
                            <TableCell align="center">${rows[idx].bid}</TableCell>
                            <TableCell align="center">{rows[idx].num_bidders}</TableCell>
                            <TableCell align="center">{rows[idx].days_remaining}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <div className="posted-sale-items-description-container">
                      <p>
                        {rows[idx].description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="edit-and-delete-button-container__posted-sale-items">
                  <div className="edit-icon-outer-container">
                    <div className="edit-icon-inner-container" onClick={() => handleSetItemToEditData(item, idx)}>
                      <AiOutlineEdit className="edit-icon-posted-sale-items"/>
                    </div>
                  </div>
                  <div className="delete-icon-outer-container">
                    <div className="delete-icon-inner-container" onClick={() => openConfirmDeleteDialogBox(item, idx)}>
                      <AiOutlineDelete className="delete-icon-posted-sale-items"/>
                    </div>
                  </div>
                </div>
                {selectedItemToUpdate[idx] ? <UpdateSaleItem itemData={itemToEditData}/> : <></>}
              </div>
            )
          })}
        </div>

         {/* DIALOG BOX ASKING USER TO CONFIRM THAT THEY WANT TO DELETE THE ITEM */}

         <Dialog
          open={confirmDeleteDialogBox}
          onClose={closeConfirmDeleteDialogBox}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure that you want to delete this item?"}
          </DialogTitle>
          <div className="confirmation-buttons-post-sale-item">
            <div className="cancel-button__post-item">
              <Button onClick={closeConfirmDeleteDialogBox} className={classes.buttons} color="secondary" variant="contained">
                Cancel
              </Button>
            </div>
            <div className="confirm-button__post-item">
              <Button className={classes.buttons} color="secondary" variant="contained" autoFocus onClick={deleteItem}>
                Confirm
              </Button>
            </div>
          </div>
        </Dialog>

        {/* DIALOG BOX FOR WHEN USER TRIES TO DELETE AN ITEM THAT ALREADY HAS BIDS */}

        <Dialog
          open={errorDialogBox}
          onClose={closeErrorDialogBox}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"This item cannot be deleted because it already has one or more bidders"}
          </DialogTitle>
          <div className="confirmation-buttons-post-sale-item">
            <div className="confirm-button__post-item">
              <Button className={classes.buttons} color="secondary" variant="contained" autoFocus onClick={closeErrorDialogBox}>
                Close
              </Button>
            </div>
          </div>
        </Dialog>

        {/* DIALOG BOX FOR WHEN USER TRIES TO DELETE ONE OF THE SEED DATA ITEMS */}

        <Dialog
          open={seedDataErrorDialogBox}
          onClose={closeSeedDataErrorDialogBox}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"This item cannot be deleted because it is part of the seed data"}
          </DialogTitle>
          <div className="confirmation-buttons-post-sale-item">
            <div className="confirm-button__post-item">
              <Button className={classes.buttons} color="secondary" variant="contained" autoFocus onClick={closeSeedDataErrorDialogBox}>
                Close
              </Button>
            </div>
          </div>
        </Dialog>
      </>
      }
    </>
  )
}

export default PostedSaleItems;
