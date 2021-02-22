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
    // borderRadius: '50%'
    // padding: '10px',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    backgroundColor: 'white',
    background: 'white',
    color: theme.palette.secondary.contrastText,
    height: '300px',
    width: '300px',
    marginLeft: '20px',
    paddingTop: '50px',
    paddingBottom: '50px',
    paddingLeft: '20px'
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
    width: '300px',
    marginBottom: '200px',
    paddingRight: '50px'
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
    // minWidth: 650,
    minWidth: 350,
  },
  tableHead: {
    backgroundColor: theme.palette.secondary.main
  },
  tableRow: {
    backgroundColor: 'whitesmoke'
  },
  tableContainer: {
    paddingBottom: '0px',
    backgroundColor: 'white',
    height: '70px',
    width: '400px',
    height: '94px'
  },
  tableCell: {
    color: theme.palette.secondary.contrastText
  },
  gridItem: {
    width: '100%',
    // border: '2px solid black',
    borderRadius: '5px'
  }

}))
// rgb(206, 204, 204)
function createData(name, price, bid, num_bidders, days_remaining) {
  return { name, price, bid, num_bidders, days_remaining };
}



const SellerProfile = () => {

  const { id } = useParams()
  const [userData, setUserData] = useState({'items': [], 'user': {}, 'sold': {}, 'reviews': {}})
  const [dataRows, setDataRows] = useState([])
  const classes = useStyles()
  useEffect(() => {
    (async() => {
      let rows = []
      const res = await fetch(`http://localhost:5000/api/users/${id}/get-seller-info`)
      const sellerInfo = await res.json()
      //('RETURNED ITEMS:', sellerInfo)
      sellerInfo.items.forEach(item => {
        const d1 = new Date(item.expiry_date)
        const today = new Date()
        today.setDate(today.getDate()+0)
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const days_remaining = Math.round(Math.abs((today - d1) / oneDay));
        if(item.current_bid === null) {
          rows.push(createData(item.name, item.price, 0, item.num_bids, days_remaining))
        } else {
          rows.push(createData(item.name, item.price, item.current_bid, item.num_bids, days_remaining))
        }
      })
      setDataRows(rows)
      setUserData(sellerInfo)
    })()
  },[])

  return(
    <>
      <div className='seller-info-and-current-items-container'>
        <h1 className="seller-info-heading">Seller Info:</h1>
        <div className="seller-info">
          <div className="seller-username">
            <h3> Seller: </h3><h4 className="username">{userData.user.username}</h4>
          </div>
          {/* <div className="seller-icon">
            <h2>
              <GiCrackedMask />
            </h2>
          </div> */}
          <div className="seller-sold-items-count">
            <h3> Items sold:</h3><h4 className="sell-count">{userData.sold.count}</h4>
          </div>
          <div className="seller-sold-items-count">
            <h3> Average Rating:</h3><h4 className="average-ratings">{userData.reviews.average === 0 ? 'No Ratings' : `${Number(userData.reviews.average).toFixed(2)} Stars`}</h4>
          </div>
          <div className="num-seller-ratings">
            <h3>Ratings:</h3><h4 className="num-ratings">{userData.reviews.num_ratings === 0 ? <p> No Ratings</p> : <p>{userData.reviews.num_ratings}</p>}</h4>
          </div>
        </div>
        <div className="current-items-heading-container">
          <h1 className="current-items-heading">
          {userData.user.username} is Currently Selling the Following Items:
          </h1>
        </div>
      </div>
      <div className="divider">
      </div>
      <div className="seller-items-body-container-background">
        <div className="seller-items-body-container">
          {/* <div className="seller-items-container"> */}
            <Grid container spacing={1} className={classes.grid} >
              {userData.items.map((item, idx) => {
                let url = item.image_url
                return (
                  <>
                  {/* <div className="grid-item-container"> */}
                  <Grid item xs={12} md={12} lg={12} className={classes.gridItem}>
                    <div className="item-name-seller-profile"><h2 className="item-text">{item.name}</h2></div>
                    {/* <div className="inner-grid-container"> */}
                      <div className="seller-page-item-cards">
                        <Card className={classes.paper}>
                          <CardContent className={classes.image}>
                            <img className="item-image" src={url} />
                          </CardContent>
                        </Card>
                        <div className="description-table-container">
                          <div className="table-container">

                            <TableContainer className={classes.tableContainer}>
                              <Table className={classes.table} size="small" aria-label="a dense table">
                                <TableHead className={classes.tableHead}>
                                  <TableRow>
                                    {/* <TableCell align="right">Item Name</TableCell> */}
                                    <TableCell align="right" className={classes.tableCell}>Full Sale Price</TableCell>
                                    <TableCell align="right" className={classes.tableCell}>Current Bid</TableCell>
                                    <TableCell align="right" className={classes.tableCell}>Number of Bidders</TableCell>
                                    <TableCell align="right" className={classes.tableCell}>Days Remaining</TableCell>
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
                          <div className="item-description-conatiner">
                            {item.description}
                          </div>
                        </div>
                      </div>

                    {/* </div> */}
                  </Grid>
                  {/* </div> */}
                  <div className="divider">

                  </div>
                  </>
                )
              })}
            </Grid>
          {/* </div> */}
        </div>
      </div>
    </>
  )
}

export default SellerProfile;
