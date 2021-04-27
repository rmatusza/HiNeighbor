import { React } from 'react';
import { connect } from "react-redux";
import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
} from '@material-ui/core'
import Bid from '../bid_functionality/Bid';
import { setSellerProfileItemsForSale } from '../../actions/itemsActions';
import Purchase from '../purchase_functionality/Purchase';
import './sellerProfile.css';

const useStyles = makeStyles((theme) => ({
  grid: {
    width: '100%',
    margin: '0px',
  },
  paper: {
    marginLeft: "20px",
    display: "flex",
    justifyContent: "center"
  },
  image: {
    display: "flex",
    justifyContent: "center",
    height: '280px',
    width: '200px',
  },
  paper_large_screen: {
    marginLeft: "20px",
    display: "flex",
    justifyContent: "center"
  },
  image_large_screen: {
    display: "flex",
    justifyContent: "center",
    height: '280px',
    width: '280px',
  },
  typography: {
    fontSize: theme.typography.fontSize
  },
  submitButton: {
    marginTop: "2rem",
  },
  table: {
    minWidth: 350,
  },
  tableHead: {
    backgroundColor: '#ff5e00',
  },
  tableRow: {
    backgroundColor: 'whitesmoke'
  },
  tableContainer: {
    paddingBottom: '0px',
    backgroundColor: 'white',
    width: '550px',
    height: '140px'
  },
  tableCell: {
    color: theme.palette.secondary.contrastText
  },
  gridItem: {
    width: '100%',
    borderRadius: '5px'
  },
}))

let test = []


const SellerProfileForSale = (props) => {

  let tableData = props.itemData['table_data'];
  const classes = useStyles();
  const largeScreen = useMediaQuery('(min-width:1870px)');
  console.log(props)
  return(
    <>
      <div className="divider">
      </div>
      {tableData.length > 0 ?
            <Grid container spacing={3} className={classes.grid} >
              {tableData.map((item, idx) => {
                let url = item.image_url
                return (
                  <Grid item xs={12} md={12} lg={largeScreen ? 6 : 12} className={classes.gridItem} key={idx}>
                    <div className="seller-items-body-container">
                      <div className="seller-page-item-cards">
                        <div className="item-name-seller-profile"><h2 className="item-text">{item.name}</h2></div>
                        <div className="image-container-seller-profile">
                          <Card className={largeScreen ? classes.paper_large_screen : classes.paper}>
                            <CardContent className={largeScreen ? classes.image_large_screen : classes.image}>
                              <img alt="for-sale-item-seller-profile" className="item-image" src={url} />
                            </CardContent>
                          </Card>
                          <div className="bid-buy-buttons-container-seller-profile">
                            <Bid dataRows={props.items} idx={idx} action={props.updateItems} arr={props.arr}/>
                            <div className="divider-container">
                              <div className="bid-purchase-divider"></div>
                            </div>
                            <Purchase dataRows={props.items} idx={idx} action={props.updateItems} arr={props.arr} currUserId={props.currUserId}/>
                          </div>
                        </div>
                        <div className="description-table-container__seller-profile-for-sale">
                          <div className="table-container">
                            <TableContainer className={classes.tableContainer}>
                              <Table className={classes.table} size="small" aria-label="a dense table">
                                <TableHead className={classes.tableHead}>
                                  <TableRow>
                                    {/* <TableCell align="right">Item Name</TableCell> */}
                                    <TableCell align="center" className={classes.tableCell}>Category</TableCell>
                                    <TableCell align="center" className={classes.tableCell}>Full Sale Price</TableCell>
                                    <TableCell align="center" className={classes.tableCell}>Current Bid</TableCell>
                                    <TableCell align="center" className={classes.tableCell}>Number of Bidders</TableCell>
                                    <TableCell align="center" className={classes.tableCell}>Days Remaining</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  <TableRow key={tableData[idx].name}>
                                    <TableCell align="center">{item.category}</TableCell> 
                                    <TableCell align="center">${item.price}</TableCell> 
                                    <TableCell align="center">${item.current_bid ? item.current_bid : 0}</TableCell>
                                    <TableCell align="center">{item.num_bids}</TableCell>
                                    <TableCell align="center">{item.days_remaining}</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </div>
                          <div className="seller-profile-sale-item-description-conatiner">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Grid>
                )
              })}
            </Grid>
       :
       <div className="no-items-message-seller-profile">
         <h1>No Items Have Been Posted For Sale by This User</h1>
       </div>
      }
    </>
  )
};

const mapStateToProps = state => {
  console.log(state.entities.seller_profile.saleItems)
  return {
    items: state.entities.seller_profile.saleItems,
    arr: test,
    length: test.length,
    currUserId: state.session.currentUser ? state.session.currentUser.id : null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateItems: (items) => dispatch(setSellerProfileItemsForSale(items))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SellerProfileForSale)
