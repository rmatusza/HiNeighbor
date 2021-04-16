import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from "@material-ui/core"
import { setItems } from '../../actions/itemsActions';
import Purchase from '../purchase_functionality/Purchase';

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
  tableCell: {
    color: theme.palette.secondary.contrastText
  },
  buttons: {
    width: '160px'
  },
}))

let arr = []

const TopBidderData = (props) => {
  const classes = useStyles()
	const history = useHistory()

  const viewSellerInfo = (sellerId) => {
		history.replace(`/seller-profile/${sellerId}`)
	}

  if(props.itemData.length === 0){
    return(
      <>
        <div className="top-bidder-heading-container">
          <h2>You're The Top Bidder On The Following Items:</h2>
        </div>
        <div className="no-bid-items">
          <h2>
            No Items Found
          </h2>
        </div>
      </>
    )
  }else{
    return(
      <>
        <div className="top-bidder-heading-container">
          <h2>You're The Top Bidder On The Following Items:</h2>
        </div>
        <div className="top-bidder-outter-container">
          {props.itemData.map((data, idx) => {
          // //('DATA IN MAP:', data)
          let chosenMonth = data.bid_date.slice(5, 7)
          let chosenDay = data.bid_date.slice(8, 10)
          let chosenYear = data.bid_date.slice(0, 4)
          let fullDate = chosenMonth + '-' + chosenDay + '-' + chosenYear
          //(fullDate)
          return (
            <div className="top-bidder-inner-container" key={idx}>
              <div className="home-page-sale-items-container__photos-inner-container">
                <Card className={classes.paper}>
                  <CardContent className={classes.image}>
                    <img alt={data.item_name} className="item-image-homepage" src={data.item_photo} />
                  </CardContent>
                </Card>
                <div className="bid-buy-buttons-container-top-bidder-page">
                  <Purchase dataRows={props.items} idx={idx} action={props.purchaseItem} arr={props.arr} currUserId={props.currUserId} />
                </div>
                <div className="divider__top-bidder-data" />
                <div className="view-seller-info-button__top-bidder-data">
                  <Button 
                  color="secondary" 
                  size="medium" variant="contained" 
                  className={props.onBidHistoryPage ? classes.bidHistoryButtons : classes.buttons}
                  onClick={() => viewSellerInfo(data.seller_id)}
                  >
                    View Seller Info
                  </Button>
                </div>
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
                      <TableRow>
                        <TableCell align="center" style={{height: '63px'}}>{data.item_name}</TableCell>
                        <TableCell align="center">${data.full_price}</TableCell>
                        <TableCell align="center">{data.num_bidders}</TableCell>
                        <TableCell align="center">${data.top_bid}</TableCell>
                        <TableCell align="center">{fullDate}</TableCell>
                        <TableCell align="center">{data.days_remaining}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <div className="top-bid-item-description">
                  <p>
                    {data.item_description}
                  </p>
                </div>
              </div>
              {/* <div className="bid-buy-buttons-container-top-bidder-page">
                <div className="buy-button">
                  <Button color="secondary" size="medium" variant="contained" onClick={() => {handleDialogOpen({'itemId': data.item_id, 'itemPrice': data.full_price, 'idx': idx})}} className={classes.buttons}>
                    Purchase
                  </Button>
                </div>
              </div> */}
            </div>
          )
        })}
      </div>
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    items: state.entities.bid_history.topBidder,
    arr,
    length: arr.length,
    currUserId: state.session.currentUser ? state.session.currentUser.id : null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    purchaseItem: items => dispatch(setItems(items))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopBidderData)

