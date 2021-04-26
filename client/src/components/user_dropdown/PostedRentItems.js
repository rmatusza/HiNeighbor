import { useState } from 'react';
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
} from '@material-ui/core'
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

function createData(name, rate,rented, id, seller_username, image_url, category, description) {
  return { name, rate,rented, id, seller_username, image_url, category, description};
}

const PostedRentItems = (props) => {
  const classes = useStyles()
  const[selectedItemToUpdate, setSelectedItemToUpdate] = useState({})
  const [itemToEditData, setItemToEditData] = useState({})
  const [confirmDeleteDialogBox, setConfirmDeleteDialogBox] = useState(false);
  const [errorDialogBox, setErrorDialogBox] = useState(false);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState({})
  const [selectedItemToDeleteIdx, setSelectedItemToDeleteIdx] = useState(null)
 
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
      props.postedItems.items_for_rent.splice(selectedItemToDeleteIdx, 1)
      closeConfirmDeleteDialogBox()
    }
  }

  console.log(props)

  const closeErrorDialogBox = () => {
    setErrorDialogBox(false)
  }

  const openErrorDialogBox = () => {
    setErrorDialogBox(true)
  }

  const closeConfirmDeleteDialogBox = () => {
    setConfirmDeleteDialogBox(false);
  };

  const openConfirmDeleteDialogBox = (item, idx) => {
    if(item.rented === true){
      openErrorDialogBox()
    } else {
      setSelectedItemToDelete(item)
      setSelectedItemToDeleteIdx(idx)
      setConfirmDeleteDialogBox(true)
    }
  }

  let rows = []

  props.postedItems.items_for_rent.forEach((item, idx) => {
    const today = new Date()
    today.setDate(today.getDate()+0)
    rows.push(createData(item.name, item.rate, item.rented, item.id, item.seller_name, item.image_url, item.category, item.description, item.category))
  })

  return(
    <>
      {props.postedItems.items_for_rent.length === 0 ?
        <>
          <h1 className='no-items-posted-heading'>No Items Posted for Rent...</h1>
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
            Your Items for Rent:
          </h1>
        </div>
        <div className="body-container-posted-rent-items">
          {props.postedItems.items_for_rent.map((item, idx) => {
            let url = item.image_url
            return (
              <div className="posted-rent-items-outer-container">
                <div className="body-container-posted-rent-items__photos-container">
                  <div className="item-photo-container-posted-rent-items" key={idx}>
                    <Card className={classes.paper}>
                      <CardContent className={classes.image}>
                        <img alt={item.name} className="item-image" src={url} />
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <div className="body-container-posted-rent-items__for-rent-table-container">
                  <div className="body-container-posted-rent-items__for-rent-table-container__for-rent-table" key={idx}>
                    <TableContainer className={classes.tableContainer} style={{marginRight: "20px"}}>
                      <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead className={classes.tableHead}>
                          <TableRow className={classes.tableHead}>
                            <TableCell align="center" className={classes.tableCell}>Item Name</TableCell>
                            <TableCell align="center" className={classes.tableCell}>Category</TableCell>
                            <TableCell align="center" className={classes.tableCell}>Rate per Day</TableCell>
                            <TableCell align="center" className={classes.tableCell}>Item Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow key={rows[idx].name}>
                            <TableCell align="center">{rows[idx].name}</TableCell>
                            <TableCell align="center">{rows[idx].category}</TableCell>
                            <TableCell align="center">${rows[idx].rate}</TableCell>
                            <TableCell align="center">{rows[idx].rented === true ? 'Rented' : 'Posted'}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <div className="posted-rent-items-description-container">
                      <p>
                        {rows[idx].description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="edit-and-delete-button-container__posted-rent-items">
                  <div className="edit-button-outer-container__posted-rent-items">
                    <div className="edit-button-inner-container__posted-rent-items" onClick={() => handleSetItemToEditData(item, idx)}>
                      <AiOutlineEdit className="edit-icon__posted-rent-items"/>
                    </div>
                  </div>
                  <div className="delete-button-outer-container__posted-rent-items">
                    <div className="edit-button-inner-container__posted-rent-items" onClick={() => openConfirmDeleteDialogBox(item, idx)}>
                      <AiOutlineDelete className="delete-icon__posted-rent-items"/>
                    </div>
                  </div>
                </div>
                {selectedItemToUpdate[idx] ? <UpdateSaleItem itemData={itemToEditData}/> : <></>}
              </div>
            )
          })}
        </div>
      </>
      }
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


      <Dialog
        open={errorDialogBox}
        onClose={closeErrorDialogBox}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"This item cannot be deleted because it is already being rented. Please wait until the item is returned to delete it"}
        </DialogTitle>
        <div className="confirmation-buttons-post-sale-item">
          <div className="confirm-button__post-item">
            <Button className={classes.buttons} color="secondary" variant="contained" autoFocus onClick={closeErrorDialogBox}>
              Close
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default PostedRentItems;
