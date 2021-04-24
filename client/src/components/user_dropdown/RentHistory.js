import { useState } from 'react';
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  Button,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Slider  
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  grid: {
    width: '100%',
    margin: '0px',
    marginTop: "30px"
  },
  paper: {
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
    position: "absolute",
    top: 100,
    left: 600,
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
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
    backgroundColor: "black",
  },
  tableRow: {
    backgroundColor: 'whitesmoke'
  },
  tableContainer: {
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

function createData(name, seller, rate, start_date, return_date, rent_total, description, category) {
  return { name, seller, rate, start_date, return_date, rent_total, description, category};
}

const RentHistory = (props) => {
  const currUserId = useSelector(store => store.session.currentUser.id)
  const [ratingVisibility, setRatingVisibility] = useState({})
  const [currItem, setCurrItem] = useState(null)
  const [itemRating, setItemRating] = useState(null)
  const[sliderState, setSliderState] = useState({})
  const [selectedRatingButton, setSelectedRatingButton] = useState(null)
  const [currentlyRentingButtonState, setCurrentlyRentingButtonState] = useState(true)
  const [previouslyRentedButtonState, setPreviouslyRentedButtonState] = useState(false)
  const classes = useStyles()
  let ratingState = {}
  let dataRows = []
  console.log(props.postedItems.rented_items)
  let currentlyRenting = props.postedItems.rented_items
  let previouslyRented = props.postedItems.returned_rented_items
  let itemsType = currentlyRenting
  if(currentlyRentingButtonState === true) {
    itemsType = currentlyRenting
  } else {
    itemsType = previouslyRented
  }

  (() => {
    itemsType ? 
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
    
      if(item.current_bid === null) {
        dataRows.push(createData(item.item_name, item.seller_name, item.rate, startMonth+'-'+startDay+'-'+startYear, returnMonth+'-'+returnDay+'-'+returnYear, item.rent_total, item.description, item.category))
      } else {
        dataRows.push(createData(item.item_name, item.seller_name, item.rate, startMonth+'-'+startDay+'-'+startYear, returnMonth+'-'+returnDay+'-'+returnYear, item.rent_total, item.description, item.category))
      }
    })
    :
    itemsType = []
  })()

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
    let statecpy = {...ratingVisibility}
    let value = ratingVisibility[idx]
    statecpy[idx] = !value
    if(selectedRatingButton !== null && selectedRatingButton !== idx) {
      statecpy[selectedRatingButton] = false
    }
    setCurrItem(itemId)
    setRatingVisibility(statecpy)
    setSelectedRatingButton(idx)
  }

  const submitRating = async(itemId, idx) => {
   const body = {
      currUserId,
      itemRating
    }

    await fetch(`http://localhost:5000/api/items-and-services/${currItem}/rate-item`, {
      method: 'PATCH',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify(body)
    })
    let ratingsCopy = {...sliderState}
    ratingsCopy[idx] = itemRating
    setSliderState(ratingsCopy)
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
          <div className="items-body-container-user-dropdown"/>
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
              {currentlyRentingButtonState ? `Items You Are Currently Renting:` : `Items You Have Rented in the Past`}
            </h1>
          </div>
          {itemsType.map((item, idx) => {
            console.log(item)
            let url = item.image_url
            return(
              <div className="body-container-rent-history">
                <div className="body-container-rent-history__photos-container">
                  <div className="item-photo-container-rent-history" key={idx}>
                    <Card className={classes.paper}>
                      <CardContent className={classes.image}>
                        <img alt={item.name} className="item-image" src={url} />
                      </CardContent>
                    </Card>
                    {currentlyRentingButtonState === true ?
                      <> </>
                      :
                      <div className="rating-buttons-and-slider">
                        <div className="rate-item-button-container-previously-rented-items">
                          <Button variant="contained" color="secondary" fullWidth={true} onClick={() => enableRating(item.id, idx)}>Rate item</Button>
                          {ratingVisibility[idx] === false || ratingVisibility[idx] === undefined ? 
                          <></> 
                          : 
                          <div className="submit-rating-button-previously-rented-items">
                            <Button variant="contained" color="secondary" onClick={() => submitRating(item.id, idx)}>
                              Submit Rating
                            </Button></div>}
                        </div>
                        {ratingVisibility[idx] === false || ratingVisibility[idx] === undefined ?
                        <></>
                        :
                        <div className="slider">
                        <Typography id="discrete-slider-small-steps" gutterBottom>
                          Rating:
                        </Typography>
                          <Slider
                            defaultValue={sliderState[idx] ? sliderState[idx] : props.postedItems.rent_reviews[idx].rating}
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
                </div>
                <div className="body-container-rent-history__table-container">
                  <div className="body-container-rent-history__table-container__table">
                    <TableContainer className={classes.tableContainer} style={{marginRight: "20px"}}>
                        <Table className={classes.table} size="small" aria-label="a dense table">
                          <TableHead className={classes.tableHead}>
                            <TableRow>
                              <TableCell align="center" className={classes.tableCell}>seller</TableCell>
                              <TableCell align="center" className={classes.tableCell}>Item Name</TableCell>
                              <TableCell align="center" className={classes.tableCell}>Category</TableCell>
                              <TableCell align="center" className={classes.tableCell}>Rate Per Day</TableCell>
                              <TableCell align="center" className={classes.tableCell}>Date Rented</TableCell>
                              <TableCell align="center" className={classes.tableCell}>Return Date</TableCell>
                              <TableCell align="center" className={classes.tableCell}>Rent Total</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow key={dataRows[idx].name}>
                              <TableCell align="center">{dataRows[idx].seller}</TableCell>
                              <TableCell align="center">{dataRows[idx].name}</TableCell>
                              <TableCell align="center">{dataRows[idx].category}</TableCell>
                              <TableCell align="center">${dataRows[idx].rate}</TableCell>
                              <TableCell align="center">{dataRows[idx].start_date}</TableCell>
                              <TableCell align="center">{dataRows[idx].return_date}</TableCell>
                              <TableCell align="center">${dataRows[idx].rent_total}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <div className="rent-history-item-description">
                        <p>
                          {dataRows[idx].description}
                        </p>
                      </div>  
                     
                  </div>
                </div>
              </div>
            )
          })}
        </>
      }
    </>
  )
}

export default RentHistory;
