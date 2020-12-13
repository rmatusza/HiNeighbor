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
    paddingBottom: '0px',
    backgroundColor: 'white',
    height: '70px'
  }
}))

function createData(name, price, bid, num_bidders, days_remaining) {
  return { name, price, bid, num_bidders, days_remaining };
}

const PostedItems = () => {

  const currUserId = useSelector(store => store.session.currentUser.id)
  const [postedItems, setPostedItems] = useState([])
  const [dataRows, setDataRows] = useState([])
  const classes = useStyles()
  let items = []
  // console.log('ITEMS:', items)
  useEffect(() => {
    (async() => {
      let rows = []
      const res = await fetch(`http://localhost:8080/api/users/${currUserId}/get-posted-items`)
      const postedItems = await res.json()
      // items = postedItems
      console.log('RETURNED ITEMS:', postedItems)
      const d1 = new Date(postedItems[0].expiry_date)
      const today = new Date()
      today.setDate(today.getDate()+0)
      const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      const days_remaining = Math.round(Math.abs((today - d1) / oneDay));
      postedItems.forEach(item => {
        if(item.current_bid === null) {
          rows.push(createData(item.name, item.price, 0, item.num_bids, days_remaining))
        } else {
          rows.push(createData(item.name, item.price, item.current_bid, item.num_bids, days_remaining))
        }
      })
      console.log('ROWS:', rows)
      setDataRows(rows)
      setPostedItems(postedItems)
    })()
  }, [])

  return(
    <>
    <div>
      <h1>
        Your Items for Sale:
      </h1>
    </div>
    <div className="items-body-container">
      <div className="items-container">
        <Grid container spacing={4} className={classes.grid} >
          {postedItems.map((item) => {
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
        {postedItems.map((item, idx) => {
          return(
            <div className="posted-items-table-container">
          <TableContainer className={classes.tableContainer}>
            <Table className={classes.table} size="small" aria-label="a dense table">
              <TableHead className={classes.tableHead}>
                <TableRow>
                  {/* <TableCell align="right">Item Name</TableCell> */}
                  <TableCell align="right">Full Sale Price</TableCell>
                  <TableCell align="right">Current Bid</TableCell>
                  <TableCell align="right">Number of Bidders</TableCell>
                  <TableCell align="right">Days Remaining</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>

                <TableRow key={dataRows[idx].name}>
                  {/* <TableCell component="th" scope="row">
                    {dataRows.name}
                  </TableCell> */}
                  {/* <TableCell align="right">{dataRows[idx].name}</TableCell> */}
                  <TableCell align="right">${dataRows[idx].price}</TableCell>
                  <TableCell align="right">${dataRows[idx].bid}</TableCell>
                  <TableCell align="right">{dataRows[idx].num_bidders}</TableCell>
                  <TableCell align="right">{dataRows[idx].days_remaining}</TableCell>
                </TableRow>

              </TableBody>
            </Table>
          </TableContainer>
          </div>
          )
        })}
       
    </div>
    </>
  )
}

export default PostedItems;