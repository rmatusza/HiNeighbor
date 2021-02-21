import React, { useState, useEffect } from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  CardActionArea,
  Grid,
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
import { GiFalloutShelter } from 'react-icons/gi';

const useStyles = makeStyles((theme) => ({
  grid: {
    width: '100%',
    margin: '0px'
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
    minWidth: 650,
  },
  tableHead: {
    backgroundColor: theme.palette.secondary.dark,
  },
  tableRow: {
    backgroundColor: 'whitesmoke'
  },
  tableContainer: {
    // width: '800px'
    paddingBottom: '0px',
    backgroundColor: 'white',
    height: '70px'
  },
  tableCell: {
    color: theme.palette.secondary.contrastText
  },
}))

function createData(name, seller, purchase_price, purchase_date) {
  return { name, seller, purchase_price, purchase_date };
}

function valuetext(value) {
  return `${value}°C`;
}

const PurchaseHistory = (props) => {
  const currUserId = useSelector(store => store.session.currentUser.id)
  const [postedItems, setPostedItems] = useState({'items': [], 'users': []})
  // const [dataRows, setDataRows] = useState([])
  const[ratingVisibility, setRatingVisibility] = useState({})
  const[currItem, setCurrItem] = useState(null)
  const[itemRating, setItemRating] = useState(null)
  const [selectedRatingButton, setSelectedRatingButton] = useState(null)
  const classes = useStyles()
  let items = []
  let ratingState = {}
  let dataRows = []

  let rows = []
  // const res = await fetch(`http://localhost:5000/api/users/${currUserId}/get-purchase-history`)
  // const postedItems = await res.json()
  // items = postedItems
  props.postedItems.purchased_items.forEach((item, i) => {
    ratingState[i] = false
    let month = item.date_sold.slice(5,7)
    // console.log(month)
    let day = item.date_sold.slice(8,10)
    // console.log(day)
    let year = item.date_sold.slice(0, 4)
    if(item.current_bid === null) {
      dataRows.push(createData(item.name, props.postedItems.users[item.seller_id - props.postedItems.purchased_items[0].seller_id].username, item.current_bid, month+'-'+day+'-'+year))
    } else {
      dataRows.push(createData(item.name, props.postedItems.users[item.seller_id - props.postedItems.purchased_items[0].seller_id].username, item.current_bid, month+'-'+day+'-'+year))
    }
  })

  const updateItemRating = (e, value) => {
    setItemRating(value)
  }

  const enableRating = (itemId, idx) => {
    console.log(itemId)
    let statecpy = {...ratingVisibility}
    let value = ratingVisibility[idx]
    statecpy[idx] = !value
    if(selectedRatingButton !== null && selectedRatingButton !== idx) {
      statecpy[selectedRatingButton] = false
    }
    setCurrItem(itemId)
    setRatingVisibility(statecpy)
    setSelectedRatingButton(idx)
    // currItem = itemId
    // ratingVisibility = statecpy
    // selectedRatingButton = idx
  }

  const submitRating = async(itemId, idx, sellerId) => {
   const body = {
      currUserId,
      itemRating,
      sellerId
    }
    try {
    const res = await fetch(`http://localhost:5000/api/items-and-services/${currItem}/rate-item`, {
      method: 'PATCH',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify(body)
    })

    const rating = await res.json()
    const status = await res.status
    if(!(status >= 200 && status <= 399)) {
      const err = new Error()
      err.message = status
      throw err
    }
    enableRating(itemId, idx)
    } catch(e) {
      alert(`Something went wrong. Error status: ${e.message}`)
    }
  }

  return(
    <>
    {props.postedItems.purchased_items.length === 0 ?
    <>
     <h1 className="no-history-heading">No Purchase History...</h1>
     <div className="items-body-container-user-dropdown">
     </div>
     </>
     :
    <>
    <div>
      <h1 className="purchase-history-heading">
        Your Purchase History:
      </h1>
    </div>
    <div className="items-body-container-user-dropdown">
      <div className="items-container">
        <Grid container spacing={4} className={classes.grid} >
          {props.postedItems.purchased_items.map((item) => {
            // console.log(item)
            let url = item.image_url
            return (
              <Grid item xs={12} md={12}>
                <Card className={classes.paper}>
                  <CardContent className={classes.image}>
                    <img className="item-image" src={url} />
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </div>
      <div className="purchase-history-table-container">

          {props.postedItems.purchased_items.map((item, idx) => {
            return(
              <div className="purchase-history-table">
                 <TableContainer className={classes.tableContainer}>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                      <TableHead className={classes.tableHead}>
                        <TableRow>
                          <TableCell align="right" className={classes.tableCell}>seller</TableCell>
                          <TableCell align="right" className={classes.tableCell}>Item Name</TableCell>
                          <TableCell align="right" className={classes.tableCell}>Purchase Price</TableCell>
                          <TableCell align="right" className={classes.tableCell}>Purchase Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow key={dataRows[idx].name}>
                          <TableCell align="right">{dataRows[idx].seller}</TableCell>
                          <TableCell align="right">{dataRows[idx].name}</TableCell>
                          <TableCell align="right">${dataRows[idx].purchase_price}</TableCell>
                          <TableCell align="right">{dataRows[idx].purchase_date}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <div className="rating-buttons-and-slider">
                    <div className="rate-and-submit-buttons">
                      <Button variant="outlined" color="primary" onClick={() => enableRating(item.id, idx)}>Rate item</Button>
                      {ratingVisibility[idx] === false || ratingVisibility[idx] === undefined ? <></> : <div  className="submit-rating-button"><Button variant="outlined" color="primary" onClick={() => submitRating(item.id, idx, item.seller_id)}>Submit Rating</Button></div>}
                    </div>
                    {ratingVisibility[idx] === false || ratingVisibility[idx] === undefined ?
                    <></>
                    :  <div className={classes.root}>
                    <Typography id="discrete-slider-small-steps" gutterBottom>
                      Rating:
                    </Typography>
                      <Slider
                        defaultValue={props.postedItems.reviews[idx].rating}
                        getAriaValueText={valuetext}
                        aria-labelledby="discrete-slider-small-steps"
                        step={1}
                        marks
                        min={1}
                        max={5}
                        valueLabelDisplay="auto"
                        onChange={updateItemRating}
                      />
                    </div>}
                  </div>
              </div>
            )
          })}
      </div>
    </div>
    </>
    }
    </>
  )
}

export default PurchaseHistory;



// defaultValue={props.postedItems.reviews.length > 0 ? props.postedItems.reviews[idx].rating : 0}
