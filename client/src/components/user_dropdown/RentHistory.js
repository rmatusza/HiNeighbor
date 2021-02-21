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
  Buttons: {
    minWidth: '177px;',
    maxWidth: '177px;',
  }
}))

function createData(name, seller, rate, start_date, return_date, rent_total) {
  return { name, seller, rate, start_date, return_date, rent_total };
}

function valuetext(value) {
  return `${value}°C`;
}

const RentHistory = (props) => {
  console.log(props.postedItems)
  const currUserId = useSelector(store => store.session.currentUser.id)
  const [postedItems, setPostedItems] = useState({'items': [], 'users': []})
  // const [dataRows, setDataRows] = useState([])
  const[ratingVisibility, setRatingVisibility] = useState({})
  const[currItem, setCurrItem] = useState(null)
  const[itemRating, setItemRating] = useState(null)
  const [selectedRatingButton, setSelectedRatingButton] = useState(null)
  const [currentlyRentingButtonState, setCurrentlyRentingButtonState] = useState(true)
  const [previouslyRentedButtonState, setPreviouslyRentedButtonState] = useState(false)
  const classes = useStyles()
  let items = []
  let ratingState = {}
  let dataRows = []
  let rows = []
  let currentlyRenting = props.postedItems.rented_items
  let previouslyRented = props.postedItems.returned_rented_items
  let itemsType;
  if(currentlyRentingButtonState === true) {
    itemsType = currentlyRenting
  } else {
    itemsType = previouslyRented
  }

  console.log('RETURNEDDDDD ITEMS:', props.postedItems.returned_rented_items)
  itemsType.forEach((item, i) => {
    ratingState[i] = false
    let returnDate = item.return_date
    let startDate = item.start_date

    let startMonth = startDate.slice(5,7)
    let startDay = startDate.slice(8,10)
    let startYear = startDate.slice(0, 4)

    let returnMonth = returnDate.slice(5,7)
    let returnDay = returnDate.slice(8,10)
    let returnYear = returnDate.slice(0, 4)

    // startMonth+'-'+startDay+'-'+startYear

    if(item.current_bid === null) {
      dataRows.push(createData(item.item_name, item.seller_name, item.rate, startMonth+'-'+startDay+'-'+startYear, returnMonth+'-'+returnDay+'-'+returnYear, item.rent_total))
    } else {
      dataRows.push(createData(item.item_name, item.seller_name, item.rate, startMonth+'-'+startDay+'-'+startYear, returnMonth+'-'+returnDay+'-'+returnYear, item.rent_total))
    }
  })

  const marks = [
    {
      value: 1,
      label: '1',
    },
    {
      value: 2,
      label: '2',
    },
    {
      value: 3,
      label: '3',
    },
    {
      value: 4,
      label: '4',
    },
    {
      value: 5,
      label: '5',
    },
  ];

  const changeButtonState = (e) => {
    if(e.target.name === 'currently-renting') {
      if(currentlyRentingButtonState === false) {
        setCurrentlyRentingButtonState(true)
        setPreviouslyRentedButtonState(false)
      } else {
        setCurrentlyRentingButtonState(false)
        setPreviouslyRentedButtonState(true)

      }
    } else {
      if(previouslyRentedButtonState === false) {
        setPreviouslyRentedButtonState(true)
        setCurrentlyRentingButtonState(false)

      }else {
        setPreviouslyRentedButtonState(false)
        setCurrentlyRentingButtonState(true)
      }
    }
  }

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

  const submitRating = async(itemId, idx) => {
   const body = {
      currUserId,
      itemRating
    }

    const res = await fetch(`http://localhost:5000/api/items-and-services/${currItem}/rate-item`, {
      method: 'PATCH',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify(body)
    })

    const rating = await res.json()
    console.log('UPDATED RATING OBJECT:', rating)

    enableRating(itemId, idx)
  }

  return(
    <>
    {itemsType.length === 0 ?
    <>
    <div className="current-and-past-rent-buttons">
      <div className="currently-renting-button-container">
        <Button className={classes.Buttons} aria-controls="simple-menu" aria-haspopup="true"  variant={currentlyRentingButtonState ? 'contained' : 'outlined'} color="secondary" name="currently-renting" onClick={changeButtonState}>
          Currently Renting
        </Button>
      </div>
      <div className="current-and-past-rent-buttons-divider"></div>
      <div className="previously-rented-button-container">
        <Button className={classes.Buttons} aria-controls="simple-menu" aria-haspopup="true"  variant={previouslyRentedButtonState ? 'contained' : 'outlined'} color="secondary" name="previously-rented" onClick={changeButtonState}>
          Previously Rented
        </Button>
      </div>
    </div>
     <h1 className="no-history-heading">No Rent History...</h1>
     <div className="items-body-container-user-dropdown">
     </div>
    </>
    :
    <>
    <div className="current-and-past-rent-buttons">
      <div className="currently-renting-button-container">
        <Button className={classes.Buttons} aria-controls="simple-menu" aria-haspopup="true"  variant={currentlyRentingButtonState ? 'contained' : 'outlined'} color="secondary" name="currently-renting" onClick={changeButtonState}>
          Currently Renting
        </Button>
      </div>
      <div className="current-and-past-rent-buttons-divider"></div>
      <div className="previously-rented-button-container">
        <Button className={classes.Buttons} aria-controls="simple-menu" aria-haspopup="true"  variant={previouslyRentedButtonState ? 'contained' : 'outlined'} color="secondary" name="previously-rented" onClick={changeButtonState}>
          Previously Rented
        </Button>
      </div>
    </div>
    <div>
      <h1 className="purchase-history-heading">
        Items You Have Rented in the Past:
      </h1>
    </div>
    <div className="items-body-container-user-dropdown">
      <div className="items-container">
        <Grid container spacing={4} className={classes.grid} >
          {itemsType.map((item) => {
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

          {itemsType.map((item, idx) => {
            return(
              <div className="purchase-history-table">
                 <TableContainer className={classes.tableContainer}>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                      <TableHead className={classes.tableHead}>
                        <TableRow>
                          <TableCell align="right" className={classes.tableCell}>seller</TableCell>
                          <TableCell align="right" className={classes.tableCell}>Item Name</TableCell>
                          <TableCell align="right" className={classes.tableCell}>Rate Per Day</TableCell>
                          <TableCell align="right" className={classes.tableCell}>Date Rented</TableCell>
                          <TableCell align="right" className={classes.tableCell}>Return Date</TableCell>
                          <TableCell align="right" className={classes.tableCell}>Rent Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow key={dataRows[idx].name}>
                          <TableCell align="right">{dataRows[idx].seller}</TableCell>
                          <TableCell align="right">{dataRows[idx].name}</TableCell>
                          <TableCell align="right">${dataRows[idx].rate}</TableCell>
                          <TableCell align="right">{dataRows[idx].start_date}</TableCell>
                          <TableCell align="right">{dataRows[idx].return_date}</TableCell>
                          <TableCell align="right">${dataRows[idx].rent_total}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {currentlyRentingButtonState === true ? <> </> :
                  <div className="rating-buttons-and-slider">
                    <div className="rate-and-submit-buttons">
                      <Button variant="contained" color="secondary" onClick={() => enableRating(item.id, idx)}>Rate item</Button>
                      {ratingVisibility[idx] === false || ratingVisibility[idx] === undefined ? <></> : <div  className="submit-rating-button"><Button variant="contained" color="secondary" onClick={() => submitRating(item.id, idx)}>Submit Rating</Button></div>}
                    </div>
                    {ratingVisibility[idx] === false || ratingVisibility[idx] === undefined ?
                    <></>
                    :
                    <div className="slider">
                    <Typography id="discrete-slider-small-steps" gutterBottom>
                      Rating:
                    </Typography>
                      <Slider
                        defaultValue={props.postedItems.rent_reviews[idx].rating}
                        getAriaValueText={valuetext}
                        aria-labelledby="discrete-slider-small-steps"
                        step={1}
                        marks={marks}
                        min={1}
                        max={5}
                        valueLabelDisplay="auto"
                        color="secondary"
                        onChange={updateItemRating}
                      />
                    </div>}
                  </div>
                }
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

export default RentHistory;
