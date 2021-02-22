import React from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { CardActionArea, Grid, Paper } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { SET_ITEMS } from '../../actions/types';
import Modal from "@material-ui/core/Modal";


const UploadPhoto = () => {

  const handleFileSelect = (e) => {
    //(e.target.files[0])
  }

 return(
   <div>
     yup
    <input type="file" onChange={handleFileSelect} />
   </div>
 )
}

export default UploadPhoto
