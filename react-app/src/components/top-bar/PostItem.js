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


const useStyles = makeStyles((theme) => ({
  classModal: {
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

  addClassSubmitButton: {
    marginTop: "2rem",
  },

  dialogBox: {
    width: '200px',
    heigth: '200px'
  }
}));




const PostItem = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [classDescription, setClassDescription] = useState("");
  const [classTime, setClassTime] = useState("");
  const [modalClosed, setModalClosed] = useState('false')
  const form_state = useSelector(store => store.entities.post_item_form_state.status)

  const classes = useStyles()
  const dispatch = useDispatch();

  console.log(props.visible)



  const handleInputChange = (e) => {
    if (e.target.id === "name-input") {
      setClassName(e.target.value);
    } else if (e.target.id === "description-input") {
      setClassDescription(e.target.value);
    } else {
      setClassTime(e.target.value);
    }
  };

  const handleCheck = () => {
    dispatch(setPostItemFormStatus(false))
    console.log('ooooh baby thats somme sweet pooty')
  }

  const addClassBody = (
    <div className={classes.classModal}>
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
          <InputLabel htmlFor="description-input">Category</InputLabel>
          <Input id="description-input" onChange={handleInputChange} />
        </FormControl>
      </div>
      <div>
        <FormControl>
          <InputLabel htmlFor="description-input">Quantity</InputLabel>
          <Input id="description-input" onChange={handleInputChange} />
        </FormControl>
      </div>
      <div>
        <FormControl>
          <InputLabel htmlFor="description-input">Sell Price</InputLabel>
          <Input id="description-input" onChange={handleInputChange} />
        </FormControl>
      </div>
      <div>
        <FormControl>
          <InputLabel htmlFor="description-input"> Rent or Sell</InputLabel>
          <Input id="description-input" onChange={handleInputChange} />
        </FormControl>
      </div>
      <div>
        <Input type="file" id="upload-image-input" />
      </div>
      <div className="post_item_or_service_buttons">
        <Button
          variant="contained"
          color="primary"
          style={{ color: "white" }}
          size="small"
          className={classes.addClassSubmitButton}
          // onClick={handleCreateClass}
          type="submit"
        >
          Post Item
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ color: "white" }}
          size="small"
          className={classes.addClassSubmitButton}
          onClick={handleCheck}
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
    {addClassBody}
    </Modal>
    </>

  )

}

export default PostItem;
