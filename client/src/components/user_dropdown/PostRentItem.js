import React, { useState } from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import { setPostItemRentStatus } from '../../actions/itemsActions';
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
    // position: 'absolute',
    position: "absolute",
    // top: "20rem",
    top: 100,
    // left: 350,
    left: 600,
    // left: "20rem",
    width: 400,
    backgroundColor: theme.palette.background.paper,
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
    width: '185px',
    marginTop: '10px',
    marginBottom: '10px'
  }
}));

const PostRentItem = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [RentPeriod, setRentPeriod] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  // const [imageURL, setImageURL] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [classTime, setClassTime] = useState("");
  const [modalClosed, setModalClosed] = useState('false')
  const [encodedImg, setEncodedImg] = useState({})
  const rent_form_state = useSelector(store => store.entities.post_item_rent_state.rentStatus)
  const userId = useSelector(store => store.session.currentUser.id)
  console.log(userId)
  const { register, handleSubmit } = useForm()
  const classes = useStyles()
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false)
  const[modalOpen, setModalOpen] = useState(true)
  const [anchorElOffer, setAnchorElOffer] = useState(null);
  const [anchorElCategory, setAnchorElCategory] = useState(null);
  const [formErrors, setFormErrors] = useState([]);

  // console.log('CURRENT USER ID:', userId)
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

  const handleRentPeriodSelection = (e) => {
    console.log(e.target.value)
    setRentPeriod(e.target.value)
    handleCloseOffer()
  }

  const handleCategorySelection = (e) => {
    console.log(e.target.value)
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
    // console.log(e)
    if(buttonName === 'close-button-rent') {
      dispatch(setPostItemRentStatus(false))
      return
    }
    setPopupVisible(true)
    setTimeout(() => {
      setPopupVisible(false)
      dispatch(setPostItemRentStatus(false))
    }, 2500)
  }


  const postItem = async() => {

    let itemForSale = false

    console.log(generatedImageURL)
    const body = {
      userId,
      itemName,
      itemDescription,
      itemCategory,
      itemPrice,
      RentPeriod,
      itemQuantity,
      itemForSale,
      generatedImageURL,
    }

    console.log('EXPIRY DATE:', body)

    const res = await fetch('http://localhost:5000/api/items-and-services/post-item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const newItem = await res.json()
    console.log(newItem)
    handleCloseModal()
  }

  const uploadPhoto = async () => {
    console.log(imageFile)
    // console.log(data.image[0].name)
    const fd = new FormData();
    fd.append('file', imageFile)
    // console.log(fd)
    try {
      const res = await fetch('http://localhost:5000/api/items-and-services/upload-photo', {
        method: 'POST',
        body: fd
      })
      const { imageURL } = await res.json()
      generatedImageURL = imageURL
      console.log(generatedImageURL)
      postItem()
    } catch(e) {
      alert(e)
      return
    }
  }

  const validateForm = (e) => {
    e.preventDefault()
    alert('Rent Functionality Still in Progress')
    return
    let discoveredErrors = []
    let requiredFields =
    [
    imageFile,
    itemName,
    itemDescription,
    itemCategory,
    itemPrice,
    itemQuantity,
    ]
    let errorMessages =
    [
      'You Must Upload an Image',
      'You Must Enter an Item Name',
      'You Must Enter an Item Description',
      'You Must Pick a Category',
      'You Must Enter an Item Price',
      'You Must Enter an Item Quantity',
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
          <InputLabel htmlFor="name-input">Name</InputLabel>
          <Input id="name-input" onChange={handleInputChange} autoFocus />
        </FormControl>
      </div>
      <div>
        <FormControl>
          <InputLabel htmlFor="description-input">Description</InputLabel>
          <Input id="description-input" onChange={handleInputChange} />
        </FormControl>
      </div>
      <div>
      <FormControl className={classes.formControl}>
          <InputLabel id="offer-type-select">Category</InputLabel>
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
          <InputLabel htmlFor="sell-price-input">Rent Price</InputLabel>
          <Input id="sell-price-input" onChange={handleInputChange} />

        </FormControl>
      </div>
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel id="offer-type-select">Rent Period</InputLabel>
          <Select
            labelId="offer-type-select"
            id="offer-type"
            onChange={(e) => handleRentPeriodSelection(e)}
          >
            <MenuItem value={"Day"}>Day</MenuItem>
            <MenuItem value={"Week"}>Week</MenuItem>
            <MenuItem value={"Month"}>Month</MenuItem>
            <MenuItem value={"Year"}>Year</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="photo-upload-container">
        <form onChange={(e) => setImageFile(e.target.files[0])}>
          <input type="file" id="upload-image-input" name='image'/>
          {/* <button onClick={uploadPhoto} className="confirm-upload-button">Confirm Upload</button> */}
        </form>
      </div>
      <div className="post-item-or-service-buttons">
        <Button
          variant="contained"
          color="primary"
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
          color="primary"
          style={{ color: "white" }}
          size="small"
          className={classes.submitButton}
          onClick={()=>handleCloseModal('close-button-rent')}
          type="submit"
          name="close-button-rent"
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
        if(rent_form_state === false || rent_form_state === 'undefined' || modalOpen === false) {
          console.log('FALSE')
          return false
        }
        console.log('TRUE')
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

export default PostRentItem;
