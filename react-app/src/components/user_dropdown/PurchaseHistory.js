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
    backgroundColor: theme.palette.secondary.light,
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
    alignItems: "center"
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
    backgroundColor: theme.palette.secondary.light,
  },
  tableRow: {
    backgroundColor: 'whitesmoke'
  },
  tableContainer: {
    // width: '800px'
    paddingBottom: '0px',
    backgroundColor: 'white',
    height: '70px'
  }
}))

function createData(name, seller, purchase_price, purchase_date) {
  return { name, seller, purchase_price, purchase_date };
}

function valuetext(value) {
  return `${value}°C`;
}

const PurchaseHistory = () => {

  const currUserId = useSelector(store => store.session.currentUser.id)
  const [postedItems, setPostedItems] = useState({'items': [], 'users': []})
  const [dataRows, setDataRows] = useState([])
  const[ratingVisibility, setRatingVisibility] = useState({})
  const classes = useStyles()
  let items = []
  let ratingState = {}
  // console.log('ITEMS:', items)
  useEffect(() => {
    (async() => {
      let rows = []
      const res = await fetch(`http://localhost:8080/api/users/${currUserId}/get-purchase-history`)
      const postedItems = await res.json()
      // items = postedItems
      console.log('RETURNED ITEMS:', postedItems)
      postedItems.items.forEach((item, i) => {
        ratingState[i] = false
        let month = item.date_sold.slice(5,7)
        console.log(month)
        let day = item.date_sold.slice(8,10)
        console.log(day)
        let year = item.date_sold.slice(0, 4)
        if(item.current_bid === null) {
          rows.push(createData(item.name, postedItems.users[item.seller_id - postedItems.items[0].seller_id].username, item.current_bid, month+'-'+day+'-'+year))
        } else {
          rows.push(createData(item.name, postedItems.users[item.seller_id - postedItems.items[0].seller_id].username, item.current_bid, month+'-'+day+'-'+year))
        }
      })
      setDataRows(rows)
      setRatingVisibility(ratingState)
      setPostedItems(postedItems)
    })()
  }, [])

  const enableRating = (i) => {
    // setRatingVisibility(...ratingVisibility, e.target.id = !ratingVisibility[e.target.id])
    // console.log(e.target.id)
    let statecpy = {...ratingVisibility}
    console.log(statecpy)
    // let idx = e.target.id
    let value = ratingVisibility[i]
    statecpy[i] = !value
    setRatingVisibility(statecpy)
  }

  return(
    <>
    <div>
      <h1>
        Your Purchase History:
      </h1>
    </div>
    <div className="items-body-container">
      <div className="items-container">
        <Grid container spacing={4} className={classes.grid} >
          {postedItems.items.map((item) => {
            // console.log(item)
            let ext = item.image_data
            console.log(ext)
            return (
              <Grid item xs={12} md={12}>
                <Card className={classes.paper}>
                  <CardContent className={classes.image}>
                    <img className="item-image" src={`data:image/png;bas64`,require(`../../uploads/${ext}`).default} />
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </div>
      <div className="purchase-history-table-container">

          {postedItems.items.map((item, idx) => {
            return(
              <div className="purchase-history-table">
                 <TableContainer className={classes.tableContainer}>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                      <TableHead className={classes.tableHead}>
                        <TableRow>
                          <TableCell align="right">seller</TableCell>
                          <TableCell align="right">Item Name</TableCell>
                          <TableCell align="right">Purchase Price</TableCell>
                          <TableCell align="right">Purchase Date</TableCell>
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
                  <div className="rating-button">
                    <Button variant="outlined" color="primary" onClick={() => enableRating(idx)}>Rate this item</Button>
                    {ratingVisibility[idx] === false || ratingVisibility[idx] === undefined ?
                    <></>
                    :  <div className={classes.root}>
                    <Typography id="discrete-slider-small-steps" gutterBottom>
                      Small steps
                    </Typography>
                      <Slider
                        defaultValue={postedItems.users[item.seller_id - postedItems.items[0].seller_id].username}
                        getAriaValueText={valuetext}
                        aria-labelledby="discrete-slider-small-steps"
                        step={1}
                        marks
                        min={1}
                        max={5}
                        valueLabelDisplay="auto"
                      />
                    </div>}
                  </div>
              </div>
            )
          })}
      </div>
    </div>
    </>
  )
}

export default PurchaseHistory;
