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
import Box from "@material-ui/core/Box";

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
    width: '200px',
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
  console.log(userId)
  const { register, handleSubmit } = useForm()
  const classes = useStyles()
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false)
  const[modalOpen, setModalOpen] = useState(true)
  const [anchorEl, setAnchorEl] = useState(null);


  // console.log('CURRENT USER ID:', userId)
  let generatedImageURL;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOfferTypeSelection = (offerType) => {
    setItemOfferType(offerType)
    handleClose()
  }

  const handleInputChange = (e) => {
    if (e.target.id === "name-input") {
      setItemName(e.target.value);
    } else if (e.target.id === "description-input") {
      setItemDescription(e.target.value);
    } else if(e.target.id === "category-input") {
      setItemCategory(e.target.value);
    } else if(e.target.id === "sell-price-input") {
      setItemPrice(e.target.value)
    }else if(e.target.id === "quantitiy-input") {
      setItemQuantity(e.target.value)
    }
  };

  const handleCloseModal = (buttonName) => {
    setModalOpen(false)
    // console.log(e)
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

    let itemForSale = true
    if(itemOfferType === 'Rent') {
      itemForSale = false
    }
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30);
    console.log(generatedImageURL)
    const body = {
      userId,
      itemName,
      itemDescription,
      itemCategory,
      itemPrice,
      itemQuantity,
      itemForSale,
      generatedImageURL,
      expiryDate
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


  const uploadPhoto = async (e) => {
    e.preventDefault()
    console.log(imageFile)
    // console.log(data.image[0].name)
    const fd = new FormData();
    fd.append('file', imageFile)
    // console.log(fd)

    const res = await fetch('http://localhost:5000/api/items-and-services/upload-photo', {
      method: 'POST',
      body: fd
    })

    const { imageURL } = await res.json()
    generatedImageURL = imageURL
    console.log(generatedImageURL)
    // setImageURL(imageURL)
    // const path = image.path.split('/')
    // const image_extenstion = path[path.length-1]
    // setImageData(image_extenstion)
    // console.log(image_extenstion)
    alert('Upload Successful!')

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
        <FormControl>
          <InputLabel htmlFor="category-input">Category</InputLabel>
          <Input id="category-input" onChange={handleInputChange} />
        </FormControl>
      </div>
      <div>
        <FormControl>
          <InputLabel htmlFor="quantitiy-input">Quantity</InputLabel>
          <Input id="quantitiy-input" onChange={handleInputChange} />
        </FormControl>
      </div>
      <div>
        <FormControl>
          <InputLabel htmlFor="sell-price-input">Sell Price</InputLabel>
          <Input id="sell-price-input" onChange={handleInputChange} />

        </FormControl>
      </div>
      <div>
        <FormControl variant="filled" className={classes.formControl}>
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
      </div>
      <div className="photo-upload-container">
        <form onChange={(e) => setImageFile(e.target.files[0])}>
          <input type="file" id="upload-image-input" name='image'/>
          <button onClick={uploadPhoto} className="confirm-upload-button">Confirm Upload</button>
        </form>
      </div>
      <div className="post-item-or-service-buttons">
        <Button
          variant="contained"
          color="primary"
          style={{ color: "white" }}
          size="small"
          className={classes.submitButton}
          onClick={postItem}
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
    </>

  )

}

export default PostItem;
