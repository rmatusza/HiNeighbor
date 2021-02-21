import React, { useState, useEffect } from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  Grid,
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
  table: {
    minWidth: 650,
  },
  tableHead: {
    backgroundColor: theme.palette.secondary.dark,
  },
  tableRow: {
    backgroundColor: 'whitesmoke'
  },
  tableCell: {
    color: theme.palette.secondary.contrastText
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

const PostedSaleItems = (props) => {
  console.log(props.postedItems.items_for_sale)
  const currUserId = useSelector(store => store.session.currentUser.id)
  const [forSaleButtonState, setForSaleButtonState] = useState(true)
  const [forRentButtonState, setForRentButtonState] = useState(false)
  const [dataRows, setDataRows] = useState([])
  const classes = useStyles()
  let items = []
  // console.log('ITEMS:', items)

  const handleClick = (e) => {
    if(e.target.name === 'for-sale') {
      if(forSaleButtonState === false) {
        setForSaleButtonState(true)
        setForRentButtonState(false)
      } else {
        setForSaleButtonState(false)
        setForRentButtonState(true)

      }
    } else {
      if(forRentButtonState === false) {
        setForRentButtonState(true)
        setForSaleButtonState(false)

      }else {
        setForRentButtonState(false)
        setForSaleButtonState(true)
      }
    }
  }

  let rows = []

  props.postedItems.items_for_sale.forEach((item, idx) => {
    const d1 = new Date(item.expiry_date)
    console.log('EXPIRY DATE:', d1)
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

  return(
    <>
    {props.postedItems.items_for_sale.length === 0 ?
      <>
        <h1 className="no-items-posted-heading">No Items Posted for Sale...</h1>
        <h5 className="no-items-posted-heading">HINT: If you would like to post something click on the dropdown menu located at the
          top right of the page and choose either "post an item for rent" or "post an item for sale"
        </h5>
        <div className="items-body-container-user-dropdown">
        </div>
      </>
    :
    <>
    <div className="items-for-sale-heading-container">
      <h1 className="items-for-sale-heading">
        Your Items for Sale:
      </h1>
    </div>
    <div className="items-body-container-user-dropdown">
      <div className="items-container">
        <Grid container spacing={4} className={classes.grid} >
          {props.postedItems.items_for_sale.map((item) => {
            console.log(item)
            let url = item.image_url
            return (
              <>
              <Grid item xs={12} md={12}>
                <div className="item-name-posted-items"><h2 className="item-text">{item.name}</h2></div>
                <Card className={classes.paper}>
                  <CardContent className={classes.image}>
                    <img className="item-image" src={url} />
                  </CardContent>
                </Card>
              </Grid>
              <div className="item-divider"></div>
              </>
            )
          })}
        </Grid>
      </div>
      <ul>
        {props.postedItems.items_for_sale.map((item, idx) => {
          return(
            <div className="posted-items-table-container">
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

                    <TableRow key={rows[idx].name}>
                      <TableCell align="right">${rows[idx].price}</TableCell>
                      <TableCell align="right">${rows[idx].bid}</TableCell>
                      <TableCell align="right">{rows[idx].num_bidders}</TableCell>
                      <TableCell align="right">{rows[idx].days_remaining}</TableCell>
                    </TableRow>

                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )
        })}
      </ul>
    </div>
    </>
    }
    </>
  )
}

export default PostedSaleItems;
