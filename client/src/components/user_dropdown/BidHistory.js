import React, { useState, useEffect } from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  Button,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector, connect } from "react-redux";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import TopBidderData from './TopBidderData';
import NotTopBidderData from './NotTopBidderData';


const useStyles = makeStyles((theme) => ({
  grid: {
    width: '100%',
    marginTop: '30px',
    // marginLeft: '30px',
  },
  paper: {
    // padding: theme.spacing(2),
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
  table: {
   maxWidth: '639px',
   overflow: 'auto'
  },
  tableHead: {
    backgroundColor: "black",
  },
  tableRow: {
    backgroundColor: 'whitesmoke'
  },
  // tableContainer: {
  //   // width: '800px'
  //   paddingBottom: '0px',
  //   backgroundColor: 'white',
  //   height: '70px',
  //   maxWidth: '639px',
  // },
  tableCell: {
    color: theme.palette.secondary.contrastText
  },
}))

const BidHistory = (props) => {
  const currUserId = useSelector(store => store.session.currentUser.id)
  const[ratingVisibility, setRatingVisibility] = useState({})
  const[currItem, setCurrItem] = useState(null)
  const[itemRating, setItemRating] = useState(null)
  const [selectedRatingButton, setSelectedRatingButton] = useState(null)
  const [lostAuctionData, setLostAuctionData] = useState([])
  const [topBidderData, setTopBidderData] = useState([])
  const [notTopBidderData, setNotTopBidderData] = useState([])
  const classes = useStyles()
  useEffect(() => {
    (async() => {
      const res = await fetch(`http://localhost:5000/api/users/${currUserId}/get-bid-history`)
      const bidData = await res.json()

      setLostAuctionData(bidData[0])
      setTopBidderData(bidData[1])
      setNotTopBidderData(bidData[2])
    })()
  }, [])

  return(
    <div className="bid-history-container">

      <TopBidderData itemData={topBidderData}/>

      <NotTopBidderData itemData={notTopBidderData} />

      <div className="lost-auction-container">
      </div>

    </div>
  )
}

export default BidHistory;
