import React from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
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

function createData(name, rate,rented, id, seller_username, image_url, category, description) {
  return { name, rate,rented, id, seller_username, image_url, category, description};
}

const PostedRentItems = (props) => {
  //(props.postedItems.items_for_rent)
  const classes = useStyles()

  // const handleClick = (e) => {
  //   if(e.target.name === 'for-sale') {
  //     if(forSaleButtonState === false) {
  //       setForSaleButtonState(true)
  //       setForRentButtonState(false)
  //     } else {
  //       setForSaleButtonState(false)
  //       setForRentButtonState(true)

  //     }
  //   } else {
  //     if(forRentButtonState === false) {
  //       setForRentButtonState(true)
  //       setForSaleButtonState(false)

  //     }else {
  //       setForRentButtonState(false)
  //       setForSaleButtonState(true)
  //     }
  //   }
  // }

  let rows = []

  props.postedItems.items_for_rent.forEach((item, idx) => {
    const today = new Date()
    today.setDate(today.getDate()+0)
    rows.push(createData(item.name, item.rate, item.rented, item.id, item.seller_name, item.image_url, item.category, item.description))
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
          {props.postedItems.items_for_rent.map((item, idx) => {
            let url = item.image_url
            return (
              <div className="posted-rent-items-outer-container">
                <div className="body-container-posted-rent-items__photos-container">
                  <div className="item-photo-container-posted-rent-items" key={idx}>
                    <Card className={classes.paper}>
                      <CardContent className={classes.image}>
                        <img alt={item.name} className="item-image" src={url} />
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <div className="body-container-posted-rent-items__for-rent-table-container">
                  <div className="body-container-posted-rent-items__for-rent-table-container__for-rent-table" key={idx}>
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
                    <div className="posted-rent-items-description-container">
                      <p>
                        {rows[idx].description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </>
      }
    </>
  )
}

export default PostedRentItems;
