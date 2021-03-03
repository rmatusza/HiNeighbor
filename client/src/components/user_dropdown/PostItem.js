import React, { useState } from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import { setPostItemFormStatus } from '../../actions/itemsActions';
import { useDispatch, useSelector } from "react-redux";
import {
  FormControl,
  InputLabel,
  Input,
  Button
} from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import { useForm } from 'react-hook-form';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Select from "@material-ui/core/Select";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const fs = require('fs')

const useStyles = makeStyles((theme) => ({
  itemFormModal: {
    // position: "absolute",
    // top: '50rem',
    // left: '50vh',
    // top: '50vh',
    width: '400px',
    margin: 'auto',
    marginTop: '14vh',
    backgroundColor: "whitesmoke",
    // // border: '2px solid #000',
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(2, 4, 3),
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
  }
}));

const PostItem = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemOfferType, setItemOfferType] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  // const [imageURL, setImageURL] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [classTime, setClassTime] = useState("");
  const [modalClosed, setModalClosed] = useState('false')
  const [encodedImg, setEncodedImg] = useState({})
  const form_state = useSelector(store => store.entities.post_item_form_state.status)
  const userId = useSelector(store => store.session.currentUser.id)
  const username = useSelector(store => store.session.currentUser.username)
  //(userId)
  const { register, handleSubmit } = useForm()
  const classes = useStyles()
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false)
  const[modalOpen, setModalOpen] = useState(true)
  const [anchorElOffer, setAnchorElOffer] = useState(null);
  const [anchorElCategory, setAnchorElCategory] = useState(null);
  const [formErrors, setFormErrors] = useState([]);

  // //('CURRENT USER ID:', userId)
  let generatedImageURL;
  // const handleClick = (event) => {
  //   setAnchorElOffer(event.currentTarget);
  // };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogOpen = (itemData) => {
    setDialogOpen(true)
  }

  const handleCloseOffer = () => {
    setAnchorElOffer(null);
  };

  const handleCloseCategory = () => {
    setAnchorElCategory(null);
  }

  const handleOfferTypeSelection = (e) => {
    //(e.target.value)
    setItemOfferType(e.target.value)
    handleCloseOffer()
  }

  const handleCategorySelection = (e) => {
    //(e.target.value)
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
      setItemQuantity(e.target.value)
    }
  };

  const handleCloseModal = (buttonName) => {
    setModalOpen(false)
    // //(e)
    if(buttonName === 'close-button') {
      dispatch(setPostItemFormStatus(false))
      return
    }
    setPopupVisible(true)
    setTimeout(() => {
      setPopupVisible(false)
      dispatch(setPostItemFormStatus(false))
    }, 2500)
  }


  const postItem = async() => {


    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30);
    //(generatedImageURL)

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

    //('EXPIRY DATE:', body)

      const res = await fetch('http://localhost:5000/api/items-and-services/post-item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const response = await res.json()
    console.log('RESPONSE:', response)
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
    //(imageFile)
    // //(data.image[0].name)
    const fd = new FormData();
    fd.append('file', imageFile)
    // //(fd)
    try {
      const res = await fetch('http://localhost:5000/api/items-and-services/upload-photo', {
        method: 'POST',
        body: fd
      })
      const { imageURL } = await res.json()
      generatedImageURL = imageURL
      //(generatedImageURL)
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
      uploadPhoto()
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
      <div>
        <FormControl>
          <InputLabel htmlFor="description-input" style={{color: "black"}}>Description</InputLabel>
          <Input id="description-input" onChange={handleInputChange} style={{color: "black"}}/>
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
        {/* <FormControl>
          <InputLabel htmlFor="category-input">Category</InputLabel>
          <Input id="category-input" onChange={handleInputChange} />
        </FormControl> */}
      </div>
      {/* <div>
        <FormControl>
          <InputLabel htmlFor="quantitiy-input">Quantity</InputLabel>
          <Input id="quantitiy-input" onChange={handleInputChange} />
        </FormControl>
      </div> */}
      <div>
        <FormControl>
          <InputLabel htmlFor="sell-price-input" style={{color: "black"}}>Sell Price</InputLabel>
          <Input id="sell-price-input" onChange={handleInputChange} style={{color: "black"}}/>

        </FormControl>
      </div>
      {/* <div>
        <FormControl className={classes.formControl}>
          <InputLabel id="offer-type-select">Offer Type</InputLabel>
          <Select
            labelId="offer-type-select"
            id="offer-type"
            onChange={(e) => handleOfferTypeSelection(e)}
          >
            <MenuItem value={"Rent"}>Rent</MenuItem>
            <MenuItem value={"Sell"}>Sell</MenuItem>
          </Select>
        </FormControl>
      </div> */}
      <div className="photo-upload-container">
        <form onChange={(e) => setImageFile(e.target.files[0])}>
          <input type="file" id="upload-image-input" name='image'/>
          {/* <button onClick={uploadPhoto} className="confirm-upload-button">Confirm Upload</button> */}
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
      <Modal
      open={(() => {
        if(form_state === false || form_state === 'undefined' || modalOpen === false) {
          //('FALSE')
          return false
        }
        //('TRUE')
        return true
      })()}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      >
      {postItemBody}
      </Modal>
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
    </>
  )
}

export default PostItem;
