import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  makeStyles,
  FormControl,
  InputLabel,
  Input,
  Button,
  TextareaAutosize,
  Modal,
  MenuItem,
  Select,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  itemFormModal: {
    width: '400px',
    margin: 'auto',
    marginTop: '14vh',
    backgroundColor: "whitesmoke",
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

  offerType: {
    margin: '10px',
    width: '100%'
  },

  formControl: {
    width: '181px',
    marginTop: '10px',
    marginBottom: '10px'
  },

  buttons: {
    width: '160px'
  },
}));

const UpdateSaleItem = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmPostDialogBox, setConfirmPostDialogBox] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const classes = useStyles()
  const [popupVisible, setPopupVisible] = useState(false)
  const[modalOpen, setModalOpen] = useState(false)
  const [formErrors, setFormErrors] = useState([]);

	useEffect(() => {
    setModalOpen(props.itemData.clicked)
  }, [props.itemData.clicked])

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleCloseCategory = () => {
  }

  const handleCategorySelection = (e) => {
    setItemCategory(e.target.value)
    handleCloseCategory()
  }
	
	const handleInputChange = (e) => {
		if (e.target.id === "name-input") {
			setItemName(e.target.value);
		} else if (e.target.id === "description-input") {
			setItemDescription(e.target.value);
		} else if(e.target.id === "sell-price-input") {
			setItemPrice(e.target.value)
		} else if(e.target.id === "quantitiy-input") {
		}
	};

	const handleCloseModal = (buttonName) => {
    setModalOpen(false)
		props.itemData.rerender_parent()
	}

  const openConfirmPostDialogBox = () => {
    setConfirmPostDialogBox(true)
  }

  const closeConfirmPostDialogBox = () => {
    setConfirmPostDialogBox(false)
  }

	const postItem = async() => {

    let item = props.itemData.data

    let item_name = itemName ? itemName: item.name
    let item_description = itemDescription ? itemDescription : item.description
    let item_category = itemCategory ? itemCategory : item.category

		const body = {
      item_name, 
			item_description,
			item_category,
		}

    const res = await fetch(`http://localhost:5000/api/items-and-services/update-posted-sale-item/${item.id}`, {
      method: 'PATCH',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const response = await res.json()
    let errors = [] 
    if(response.errors) {
      response.errors.forEach(error => {
        errors.push(error.msg)
      })
      setFormErrors(errors)
      setDialogOpen(true)
      return
    } else if(response.error){
      closeConfirmPostDialogBox()
      alert(`${response.status}: ${response.error.message}`)
    } else {
      item.name = item_name
      item.description = item_description
      item.category = item_category
      closeConfirmPostDialogBox()
      handleCloseModal()
    }
  }

  const validateForm = (e) => {
    e.preventDefault()
    let providedData = false
    let requiredFields =
    [
    itemName,
    itemDescription,
    itemCategory,
    ]
    let errorMessage =
    [
      'You Must Edit at Least One Of The Available Fields'
    ]

    requiredFields.forEach((field, i) => {
      if(field !== '') {
       providedData = true
      }
    })
    if(providedData === true) {
      openConfirmPostDialogBox()
    } else {
      setFormErrors(errorMessage)
      setDialogOpen(true)
    }
  }

  const postItemBody = (
    <div className={classes.itemFormModal}>
      <h2 id="simple-modal-title">Item Info:</h2>
      <div>
        <FormControl>
          <InputLabel htmlFor="name-input" style={{color: "black"}}>Name</InputLabel>
          <Input id="name-input" onChange={handleInputChange} autoFocus style={{color: "black"}} />
        </FormControl>
      </div>
      <div className="post-sale-item-description-input-container">
        <InputLabel htmlFor="description-input" style={{color: "black"}}>Description</InputLabel>
        <FormControl>
          <TextareaAutosize id="description-input" onChange={handleInputChange} rowsMax={4}/>
        </FormControl>
      </div>
      <div>
      <FormControl className={classes.formControl}>
          <InputLabel id="offer-type-select" style={{color: "black"}}>Category</InputLabel>
          <Select
            labelId="offer-type-select"
            id="offer-type"
            onChange={(e) => handleCategorySelection(e)}
          >
            <MenuItem value={"Books"}>Books</MenuItem>
            <MenuItem value={"Clothing"}>Clothing</MenuItem>
            <MenuItem value={"Electronics"}>Electronics</MenuItem>
            <MenuItem value={"Home Decor"}>Home Decor</MenuItem>
            <MenuItem value={"Kitchen"}>Kitchen</MenuItem>
            <MenuItem value={"Music"}>Music</MenuItem>
            <MenuItem value={"Video Games"}>Video Games</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="post-item-or-service-buttons">
        <Button
          variant="contained"
          color="secondary"
          style={{ color: "white" }}
          size="small"
          className={classes.submitButton}
          onClick={validateForm}
          type="submit"
          name="post-button"
        >
          Update Item
        </Button>
        <Button
          variant="contained"
          color="secondary"
          style={{ color: "white" }}
          size="small"
          className={classes.submitButton}
          onClick={()=>handleCloseModal('close-button')}
          type="submit"
          name="close-button"
        >
         Close
        </Button>
      </div>
    </div>
  );

  return(
    <>
      {popupVisible ? <div className="fade-test" style={{display:"block"}}><h2>Post Successful!</h2></div> : <></>}

      {/* Form for posting the item */}

      <Modal
        open={modalOpen}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {postItemBody}
      </Modal>

      {/* Dialog box that displays any errors in the user provided data */}

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"The Following Are Required:"}
        </DialogTitle>
        <List>
          {formErrors.map((error) => (
            <ListItem>
              <ListItemText>
                {error}
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Dialog>

      {/* Dialog box that that asks the user to confirm their provided data */}
      
      <Dialog
      open={confirmPostDialogBox}
      onClose={closeConfirmPostDialogBox}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure that you want to update this item?"}
        </DialogTitle>
        <div className="confirmation-buttons-post-sale-item">
          <div className="cancel-button__post-item">
            <Button onClick={closeConfirmPostDialogBox} className={classes.buttons} color="secondary" variant="contained">
              Cancel
            </Button>
          </div>
          <div className="confirm-button__post-item">
            <Button className={classes.buttons} color="secondary" variant="contained" autoFocus onClick={postItem}>
              Confirm
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default UpdateSaleItem;