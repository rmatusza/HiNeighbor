import React, { useState, useEffect } from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  Button,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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
    tableCell: {
      color: theme.palette.secondary.contrastText
    },
  }))

  const TopBidderData = (props) => {

    const classes = useStyles()

    if(props.itemData.length === 0){
      return(<></>)
    }else{
      return(
        <>
          <div className="top-bidder-heading-container">
            <h2>You're The Top Bidder On The Following Items:</h2>
          </div>
          <div className="top-bidder-outter-container">
            {props.itemData.map(data => {
            console.log(data.bid_date)
            let chosenMonth = data.bid_date.slice(5, 7)
            let chosenDay = data.bid_date.slice(8, 10)
            let chosenYear = data.bid_date.slice(0, 4)
            let fullDate = chosenMonth + '-' + chosenDay + '-' + chosenYear
            console.log(fullDate)
            return (
              <div className="top-bidder-inner-container">
                <div className="home-page-sale-items-container__photos-inner-container">
                  <Card className={classes.paper}>
                    <CardContent className={classes.image}>
                      <img className="item-image-homepage" src={data.item_photo} />
                    </CardContent>
                  </Card>
                </div>
                <div className="top-bidder-table-container">
                  <TableContainer style={{height: '100px', backgroundColor: 'white'}}>
                    <Table className="top-bidder-table" size="small" aria-label="a dense table">
                      <TableHead className={classes.tableHead}>
                        <TableRow>
                          <TableCell align="center" className={classes.tableCell}>Item Name</TableCell>
                          <TableCell align="center" className={classes.tableCell}>Full Price</TableCell>
                          <TableCell align="center" className={classes.tableCell}>Total Bidders</TableCell>
                          <TableCell align="center" className={classes.tableCell}>Your Bid</TableCell>
                          <TableCell align="center" className={classes.tableCell}>Bid Date</TableCell>
                          <TableCell align="center" className={classes.tableCell}>Days Remaining in Auction</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableCell align="center" style={{height: '63px'}}>{data.item_name}</TableCell>
                        <TableCell align="center">${data.full_price}</TableCell>
                        <TableCell align="center">{data.num_bidders}</TableCell>
                        <TableCell align="center">${data.top_bid}</TableCell>
                        <TableCell align="center">{fullDate}</TableCell>
                        <TableCell align="center">{data.days_remaining}</TableCell>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <div className="top-bid-item-description">
                    <p>
                      {data.item_description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </>
    )
  }
}

export default TopBidderData;