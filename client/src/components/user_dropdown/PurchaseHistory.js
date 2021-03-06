import React, { useState } from 'react';
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
    marginTop: '30px',
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
   maxWidth: '639px',
   overflow: 'auto'
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
    height: '70px',
    maxWidth: '639px',
  },
  tableCell: {
    color: theme.palette.secondary.contrastText
  },
}))

function createData(name, seller, purchase_price, purchase_date, description, category) {
  return { name, seller, purchase_price, purchase_date, description, category};
}

const PurchaseHistory = (props) => {
  const currUserId = useSelector(store => store.session.currentUser.id)
  const[ratingVisibility, setRatingVisibility] = useState({})
  const[sliderState, setSliderState] = useState({})
  const[currItem, setCurrItem] = useState(null)
  const[itemRating, setItemRating] = useState(null)
  const [selectedRatingButton, setSelectedRatingButton] = useState(null)
  const classes = useStyles()
  let ratingState = {}
  let dataRows = []

  props.postedItems.purchased_items.forEach((item, i) => {
    ratingState[i] = false
    let month = item.date_sold.slice(5,7)
    let day = item.date_sold.slice(8,10)
    let year = item.date_sold.slice(0, 4)
    if(item.current_bid === null) {
      dataRows.push(createData(item.name, item.seller_name, item.price, month+'-'+day+'-'+year, item.description, item.category))
    } else {
      dataRows.push(createData(item.name, item.seller_name, item.price, month+'-'+day+'-'+year, item.description, item.category))
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

    const status = await res.status
    if(!(status >= 200 && status <= 399)) {
      const err = new Error()
      err.message = status
      throw err
    }
    let ratingsCopy = {...sliderState}
    ratingsCopy[idx] = itemRating
    setSliderState(ratingsCopy)
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
          <div className="items-body-container-user-dropdown"/>
        </>
        :
        <>
          <div>
            <h1 className="purchase-history-heading">
              Your Purchase History:
            </h1>
          </div>
          {props.postedItems.purchased_items.map((item, idx) => {
            let url = item.image_url
            return(
              <div className="body-container-purchase-history"  key={idx}>
                <div className="body-container-purchase-history__photos-container">
                  <div className="item-photo-container-purchase-history">
                    <Card className={classes.paper}>
                      <CardContent className={classes.image}>
                        <img alt={item.name} className="item-image-purchase-history" src={url}/>
                      </CardContent>
                    </Card>
                     <div className="rating-buttons-and-slider">
                        <div className="rate-item-button">
                          <Button variant="contained" color="secondary" fullWidth={true} onClick={() => enableRating(item.id, idx)}>Rate item</Button>
                        </div>
                        {
                        ratingVisibility[idx] === false || ratingVisibility[idx] === undefined ? 
                          <></> 
                          : 
                          <>
                          <div  className="submit-rating-button">
                            <Button variant="contained" color="secondary" onClick={() => submitRating(item.id, idx, item.seller_id)}>Submit Rating</Button>
                          </div>
                          <div className="slider">
                            <Typography id="discrete-slider-small-steps" gutterBottom>
                              Rating:
                            </Typography>
                            <Slider
                              defaultValue={sliderState[idx] ? sliderState[idx] : props.postedItems.reviews[idx].rating}
                              aria-labelledby="discrete-slider-small-steps"
                              step={1}
                              marks={marks}
                              min={1}
                              max={5}
                              color="secondary"
                              valueLabelDisplay="auto"
                              onChange={updateItemRating}
                            />
                          </div>
                          </>
                        }
                      </div>
                  </div>
                </div>
                <div className="body-container-purchase-history__purchase-history-table-container">
                    <div className="body-container-purchase-history__purchase-history-table-container__purchase-history-table">
                      <TableContainer className={classes.tableContainer}  style={{height: '100px'}}>
                        <Table className={classes.table} size="small" aria-label="a dense table">
                          <TableHead className={classes.tableHead}>
                            <TableRow>
                              <TableCell align="center" className={classes.tableCell}>seller</TableCell>
                              <TableCell align="center" className={classes.tableCell}>Item Name</TableCell>
                              <TableCell align="center" className={classes.tableCell}>Category</TableCell>
                              <TableCell align="center" className={classes.tableCell}>Purchase Price</TableCell>
                              <TableCell align="center" className={classes.tableCell}>Purchase Date</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell align="center">{dataRows[idx].seller}</TableCell>
                              <TableCell align="center">{dataRows[idx].name}</TableCell>
                              <TableCell align="center">{dataRows[idx].category}</TableCell>
                              <TableCell align="center">${dataRows[idx].purchase_price}</TableCell>
                              <TableCell align="center">{dataRows[idx].purchase_date}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <div className="purchase-history-item-description">
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

export default PurchaseHistory;