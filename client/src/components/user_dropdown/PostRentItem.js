import React, { useState } from 'react';
import Dialog from "@material-ui/core/Dialog";
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
import MenuItem from '@material-ui/core/MenuItem';
import Select from "@material-ui/core/Select";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles((theme) => ({
  itemFormModal: {
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

const PostRentItem = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [rate, setRate] = useState(null)
  const [confirmDialog, setConfirmDialog] = useState(false)
  // const [itemQuantity, setItemQuantity] = useState("");
  const [imageFile, setImageFile] = useState(null)
  const rent_form_state = useSelector(store => store.entities.post_item_rent_state.rentStatus)
  const userId = useSelector(store => store.session.currentUser.id)
  const username = useSelector(store => store.session.currentUser.username)
  //(userId)
  const classes = useStyles()
  const dispatch = useDispatch();
  const [popupVisible, setPopupVisible] = useState(false)
  const[modalOpen, setModalOpen] = useState(true)
  // const [anchorElOffer, setAnchorElOffer] = useState(null);
  // const [anchorElCategory, setAnchorElCategory] = useState(null);
  const [formErrors, setFormErrors] = useState([]);

  // //('CURRENT USER ID:', userId)
  let generatedImageURL;
  // const handleClick = (event) => {
  //   setAnchorElOffer(event.currentTarget);
  // };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  // const handleCloseOffer = () => {
  //   setAnchorElOffer(null);
  // };

  // const handleCloseCategory = () => {
  //   setAnchorElCategory(null);
  // }

  const handleRentPeriodSelection = (e) => {
    let period = e.target.value
    if (period === 'Day') {
      setRate(itemPrice)
    } else if(period === 'Week') {
      setRate(Math.floor(Number(itemPrice)/7))
    } else {
      setRate(Math.floor(Number(itemPrice)/30))
    }
    // handleCloseOffer()
  }

  const handleCategorySelection = (e) => {
    //(e.target.value)
    setItemCategory(e.target.value)
    // handleCloseCategory()
  }

  const handleInputChange = (e) => {
    if (e.target.id === "name-input") {
      setItemName(e.target.value);
    } else if (e.target.id === "description-input") {
      setItemDescription(e.target.value);
    } else if(e.target.id === "sell-price-input") {
      setItemPrice(e.target.value)
    } //else if(e.target.id === "quantitiy-input") {
    //   setItemQuantity(e.target.value)
    // }
  };

  const handleCloseModal = (buttonName) => {
    setModalOpen(false)
    // //(e)
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

  // const confirmItemPost = () => {
  //   setConfirmDialog(true)
  // }


  const postItem = async() => {

    //(generatedImageURL)
    const body = {
      userId,
      username,
      itemName,
      itemDescription,
      itemCategory,
      itemPrice,
      rate,
      generatedImageURL,
    }

    //('EXPIRY DATE:', body)

    const res = await fetch('http://localhost:5000/api/items-and-services/post-item-for-rent', {
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
    // alert('Rent Functionality Still in Progress')
    // return
    let discoveredErrors = []
    let requiredFields =
    [
    imageFile,
    itemName,
    itemDescription,
    itemCategory,
    itemPrice,
    rate
    ]
    let errorMessages =
    [
      'You Must Upload an Image',
      'You Must Enter an Item Name',
      'You Must Enter an Item Description',
      'You Must Pick a Category',
      'You Must Enter an Item Price',
      'You Must Pick a Rent Period'
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
          <Input id="name-input" onChange={handleInputChange} autoFocus style={{color: "black"}}/>
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
      </div>
      <div>
        <FormControl>
          <InputLabel htmlFor="sell-price-input" style={{color: "black"}}>Rent Price</InputLabel>
          <Input id="sell-price-input" onChange={handleInputChange} style={{color: "black"}}/>

        </FormControl>
      </div>
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel id="offer-type-select" style={{color: "black"}}>Rent Period</InputLabel>
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
          {formErrors.map((error, idx) => (
            <ListItem key={idx}>
              <ListItemText>
                {error}
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Dialog>


      <Dialog
      open={confirmDialog}
      onClose={setConfirmDialog(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure that you want to post this item for sale?"}
        </DialogTitle>
        {/* <List>
          {formErrors.map((error, idx) => (
            <ListItem key={idx}>
              <ListItemText>
                {error}
              </ListItemText>
            </ListItem>
          ))}
        </List> */}
        <div className="confirmation-buttons-post-sale-item">

        </div>
      </Dialog>
    </>
  )
}

export default PostRentItem;
