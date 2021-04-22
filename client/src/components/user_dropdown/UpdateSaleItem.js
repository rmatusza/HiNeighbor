import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setPostItemFormStatus } from '../../actions/itemsActions';
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
  const [imageFile, setImageFile] = useState(null)
  const form_state = useSelector(store => store.entities.post_item_form_state.status)
  const userId = useSelector(store => store.session.currentUser.id)
  const username = useSelector(store => store.session.currentUser.username)
  const classes = useStyles()
  const dispatch = useDispatch();
  const [popupVisible, setPopupVisible] = useState(false)
  const[modalOpen, setModalOpen] = useState(false)
  const [formErrors, setFormErrors] = useState([]);
  let generatedImageURL;

	useEffect(() => {
		console.log(props)
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
	console.log('PROPS:', props)
	console.log('MODAL OPEN:', modalOpen)
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
		console.log(props)
		// props.itemData.clicked = false
		// setModalOpen(false)
		props.itemData.rerender_parent()
		console.log(props)
		// if(buttonName === 'close-button') {
		// 	dispatch(setPostItemFormStatus(false))
		// 	return
		// }
		// setPopupVisible(true)
		// setTimeout(() => {
		// setPopupVisible(false)
		// dispatch(setPostItemFormStatus(false))
		// }, 2500)
	}

  const openConfirmPostDialogBox = () => {
    setConfirmPostDialogBox(true)
  }

  const closeConfirmPostDialogBox = () => {
    setConfirmPostDialogBox(false)
  }

	const postItem = async() => {
		const expiryDate = new Date()
		expiryDate.setDate(expiryDate.getDate() + 30);

		const body = {
			userId,
			username,
			itemName,
			itemDescription,
			itemCategory,
			itemPrice,
			generatedImageURL,
			expiryDate
		}


		const res = await fetch('http://localhost:5000/api/items-and-services/post-item', {
			method: 'POST',
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
		}
		handleCloseModal()
  }

  const uploadPhoto = async () => {
    closeConfirmPostDialogBox()
    const fd = new FormData();
    fd.append('file', imageFile)
    try {
      const res = await fetch('http://localhost:5000/api/items-and-services/upload-photo', {
        method: 'POST',
        body: fd
      })
      const { imageURL } = await res.json()
      generatedImageURL = imageURL
      postItem()
    } catch(e) {
      alert(e)
      return
    }
  }

  const validateForm = (e) => {
    e.preventDefault()
    let discoveredErrors = []
    let requiredFields =
    [
    imageFile,
    itemName,
    itemDescription,
    itemCategory,
    itemPrice,
    ]
    let errorMessages =
    [
      'You Must Upload an Image',
      'You Must Enter an Item Name',
      'You Must Enter an Item Description',
      'You Must Pick a Category',
      'You Must Enter an Item Price',
    ]

    requiredFields.forEach((field, i) => {
      if(!field) {
        discoveredErrors.push(errorMessages[i])
      }
      setFormErrors(discoveredErrors)
    })
    if(discoveredErrors.length === 0) {
      openConfirmPostDialogBox()
    } else {
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
      <div>
        <FormControl>
          <InputLabel htmlFor="sell-price-input" style={{color: "black"}}>Sell Price</InputLabel>
          <Input id="sell-price-input" onChange={handleInputChange} style={{color: "black"}}/>

        </FormControl>
      </div>
      <div className="photo-upload-container">
        <form onChange={(e) => setImageFile(e.target.files[0])}>
          <input type="file" id="upload-image-input" name='image'/>
        </form>
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
          Post Item
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
          {"Are you sure that you want to post this item for sale?"}
        </DialogTitle>
        <div className="confirmation-buttons-post-sale-item">
          <div className="cancel-button__post-item">
            <Button onClick={closeConfirmPostDialogBox} className={classes.buttons} color="secondary" variant="contained">
              Cancel
            </Button>
          </div>
          <div className="confirm-button__post-item">
            <Button className={classes.buttons} color="secondary" variant="contained" autoFocus onClick={uploadPhoto}>
              Confirm
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default UpdateSaleItem;