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
  const [imageData, setImageData] = useState('')
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

  console.log('CURRENT USER ID:', userId)

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
    } else if(e.target.id === "offer-type-input") {
      setItemOfferType(e.target.value)
    }
  };

  const handleCloseModal = () => {
    dispatch(setPostItemFormStatus(false))
  }

  const handleReaderLoaded = (readerEvt) => {
    let binaryString = readerEvt.target.result
    console.log(binaryString)
    // setEncodedImg({base64TextString: btoa(binaryString)})
  }

  const examineFile = async(data, e) => {
    const getImage = await fetch('http://localhost:8080/api/items-and-services/examine-file')

    const {encoded_image} = await getImage.json()
    console.log(encoded_image)
  }

  const postItem = async() => {

    let itemForSale = true
    if(itemOfferType.toLocaleLowerCase() === 'rent') {
      itemForSale = false
    }
    const body = {
      userId,
      itemName,
      itemDescription,
      itemCategory,
      itemPrice,
      itemQuantity,
      itemForSale,
      imageData
    }
    const res = await fetch('http://localhost:8080/api/items-and-services/post-item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const newItem = await res.json()
    console.log(newItem)
  }


  const uploadPhoto = async (data) => {
    console.log(data.image[0].name)
    const fd = new FormData();
    fd.append('Image', data.image[0], data.image[0].name)
    console.log(fd)

    const res = await fetch('http://localhost:8080/api/items-and-services/upload-photo', {
      method: 'POST',
      body: fd
    })

    const image = await res.json()
    const path = image.path.split('/')
    const image_extenstion = path[path.length-1]
    // console.log(image.path.split('/'))
    setImageData(image_extenstion)
    console.log(image_extenstion)
    // console.log(image)
    // setImageData(image)
    alert('Upload Successful!')

  }

  console.log(imageData)

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
        <FormControl>
          <InputLabel htmlFor="offer-type-input"> Rent or Sell</InputLabel>
          <Input id="offer-type-input" onChange={handleInputChange} />
        </FormControl>
      </div>
      <div>
        <form onSubmit={handleSubmit(uploadPhoto)}>
          <input ref={register} type="file" id="upload-image-input" name='image'/>
          <button>Confirm Upload</button>
        </form>
      </div>
      <div className="post_item_or_service_buttons">
        <Button
          variant="contained"
          color="primary"
          style={{ color: "white" }}
          size="small"
          className={classes.submitButton}
          onClick={postItem}
          type="submit"
        >
          Post Item
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ color: "white" }}
          size="small"
          className={classes.submitButton}
          onClick={handleCloseModal}
          type="submit"
        >
         Close
        </Button>
      </div>
    </div>
  );




  return(
    <>
    <Modal
    open={() => {
      if(form_state === false || 'undefined') {
        return false
      }
      return true
    }}
    aria-labelledby="simple-modal-title"
    aria-describedby="simple-modal-description"
    >
    {postItemBody}
    </Modal>
    </>

  )

}

export default PostItem;
