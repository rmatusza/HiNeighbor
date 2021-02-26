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
  table: {
    minWidth: 650,
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
  tableContainer: {
    paddingBottom: '0px',
    backgroundColor: 'white',
    height: '70px'
  }
}))

function createData(name, rate,rented, id, seller_username, image_url, category) {
  return { name, rate,rented, id, seller_username, image_url, category};
}

const PostedRentItems = (props) => {
  //(props.postedItems.items_for_rent)
  const currUserId = useSelector(store => store.session.currentUser.id)
  const [forSaleButtonState, setForSaleButtonState] = useState(true)
  const [forRentButtonState, setForRentButtonState] = useState(false)
  const [dataRows, setDataRows] = useState([])
  const classes = useStyles()
  let items = []
  // //('ITEMS:', items)

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

  props.postedItems.items_for_rent.forEach((item, idx) => {
    const d1 = new Date(item.expiry_date)
    //('EXPIRY DATE:', d1)
    const today = new Date()
    today.setDate(today.getDate()+0)
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const days_remaining = Math.round(Math.abs((today - d1) / oneDay));
    rows.push(createData(item.name, item.rate, item.rented, item.id, item.seller_name, item.image_url, item.category))
  })

  return(
    <>
      {props.postedItems.items_for_rent.length === 0 ?
        <>
          <h1 className='no-items-posted-heading'>No Items Posted for Rent...</h1>
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
            Your Items for Rent:
          </h1>
        </div>
        <div className="body-container-posted-rent-items">
          <div className="body-container-posted-rent-items__photos-container">
              {props.postedItems.items_for_rent.map((item) => {
                let url = item.image_url
                return (
                  <>
                    <div className="item-photo-container-posted-rent-items">
                        <Card className={classes.paper}>
                          <CardContent className={classes.image}>
                            <img className="item-image" src={url} />
                          </CardContent>
                        </Card>
                    </div>
                  </>
                )
              })}
          </div>
          <div className="body-container-posted-rent-items__for-rent-table-container">
            {props.postedItems.items_for_rent.map((item, idx) => {
              return(
                <div className="body-container-posted-rent-items__for-rent-table-container__for-rent-table">
                  <TableContainer className={classes.tableContainer} style={{marginRight: "20px"}}>
                      <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead className={classes.tableHead}>
                          <TableRow className={classes.tableHead}>
                            {/* <TableCell align="right">Item Name</TableCell> */}
                            <TableCell align="center" className={classes.tableCell}>Item Name</TableCell>
                            <TableCell align="center" className={classes.tableCell}>Rate per Day</TableCell>
                            <TableCell align="center" className={classes.tableCell}>Item Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>

                          <TableRow key={rows[idx].name}>
                            <TableCell align="center">{rows[idx].name}</TableCell>
                            <TableCell align="center">${rows[idx].rate}</TableCell>
                            <TableCell align="center">{rows[idx].rented === true ? 'Rented' : 'Posted'}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
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

export default PostedRentItems;
