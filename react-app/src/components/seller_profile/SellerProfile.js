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
import { GiClawSlashes, GiCrackedMask, GiAbstract017 } from "react-icons/gi";
import { useParams } from 'react-router';
import './sellerProfile.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';



const useStyles = makeStyles((theme) => ({
  grid: {
    width: '100%',
    margin: '0px',
    // padding: '10px',
  },
  paper: {
    // textAlign: 'center',
    // backgroundColor: theme.palette.secondary.light,
    // background: theme.palette.success.light,
    // color: theme.palette.secondary.contrastText,
    // height: '200px',
    // width: '200px'
    padding: theme.spacing(2),
    textAlign: 'center',
    backgroundColor: theme.palette.secondary.light,
    background: theme.palette.success.light,
    color: theme.palette.secondary.contrastText,
    height: '300px',
    width: '300px',
    marginLeft: '200px',
    padding: '50px',

  },
  typography: {
    fontSize: theme.typography.fontSize
  },
  image: {
    display: "flex",
    justifyContent: "center",
    alignSelf: 'center',
    alignItems: "center",
    padding: '10px',
    height: '300px',
    marginBottom: '200px',
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
    paddingBottom: '50px'
  }

}))

function createData(name, price, bid, num_bidders, days_remaining) {
  return { name, price, bid, num_bidders, days_remaining };
}

let rows = []

const SellerProfile = () => {

  const { id } = useParams()
  const [userData, setUserData] = useState({'items': [], 'user': {}, 'sold': {}, 'reviews': {}})
  const classes = useStyles()
  let items = []
  // console.log('ITEMS:', items)
  useEffect(() => {
    (async() => {
      const res = await fetch(`http://localhost:8080/api/users/${id}/get-seller-info`)
      const sellerInfo = await res.json()
      // items = userData
      console.log('RETURNED ITEMS:', sellerInfo)
      sellerInfo.items.forEach(item => {
        rows.push(createData(item.name, item.price, item.current_bid, item.num_bids, '**days remaining'))
      })
      setUserData(sellerInfo)
    })()
  }, [])

  return(
    <>
      <div className="seller-info">
        <div className="seller-icon">
          <h2>
            <GiCrackedMask />
          </h2>
        </div>
        <div className="seller-username">
          <h3>
            Seller: {userData.user.username}
          </h3>
        </div>
        <div className="seller-sold-items-count">
          Items sold: {userData.sold.count}
        </div>
        <div className="seller-rating">
          {userData.reviews.length === 0 ? <p>Seller Rating: No Ratings</p> : <p>Seller Rating: {userData.reviews.length} reviews</p>}
        </div>
      </div>
      <div>
        <h1>
        Current Items for Sale:
        </h1>
      </div>
      <div className="seller-items-body-container">
        <div className="seller-items-container">
          <Grid container spacing={1} className={classes.grid} >
            {userData.items.map((item, idx) => {
              // console.log(item)
              let ext = item.image_data
              console.log(ext)
              return (
                <Grid item xs={12} md={6}>
                  <div className="seller-page-item-cards">
                    <Card className={classes.paper}>
                      <CardContent className={classes.image}>
                        <img className="item-image" src={`data:image/png;bas64`,require(`../../uploads/${ext}`).default} />
                      </CardContent>
                    </Card>
                    {idx === 0 || idx % 2 === 0 ? <div className="divider"></div> : <></> }
                  </div>
                  <div className="item-description-conatiner">
                    {item.description}
                  </div>
                  <div>
                  <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                      <TableHead className={classes.tableHead}>
                        <TableRow>
                          <TableCell align="right">Item Name</TableCell>
                          <TableCell align="right">Full Sale Price</TableCell>
                          <TableCell align="right">Current Bid</TableCell>
                          <TableCell align="right">Number of Bidders</TableCell>
                          <TableCell align="right">Days Remaining</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>

                        <TableRow key={rows[idx].name}>
                          {/* <TableCell component="th" scope="row">
                            {rows.name}
                          </TableCell> */}
                          <TableCell align="right">{rows[idx].name}</TableCell>
                          <TableCell align="right">${rows[idx].price}</TableCell>
                          <TableCell align="right">${rows[idx].bid}</TableCell>
                          <TableCell align="right">{rows[idx].num_bidders}</TableCell>
                          <TableCell align="right">{rows[idx].days_remaining}</TableCell>
                        </TableRow>

                      </TableBody>
                    </Table>
                  </TableContainer>
                  </div>
                </Grid>
              )
            })}
          </Grid>
        </div>
      </div>
    </>
  )
}

export default SellerProfile;
