import { useHistory } from "react-router-dom";
import {
  Card,
  CardContent,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from "@material-ui/core"

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
  }))

const LostAuctionData = (props) => {
  const classes = useStyles()
	const history = useHistory()

  const viewSellerInfo = (sellerId) => {
		history.replace(`/seller-profile/${sellerId}`)
	}

  if(props.itemData.length === 0){
    return(
      <>
      <div className="top-bidder-heading-container">
        <h2>Auctions That You Have Lost:</h2>
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
          <h2>You Lost The Following Auctions:</h2>
        </div>
        <div className="top-bidder-outter-container">
          {props.itemData.map((data, idx) => {
            //(data.bid_date)
            let monthOfLastBid = data.bid_date.slice(5, 7)
            let dayOfLastBid = data.bid_date.slice(8, 10)
            let yearOfLastBid = data.bid_date.slice(0, 4)
            let fullDateLastBid = monthOfLastBid + '-' + dayOfLastBid + '-' + yearOfLastBid

            let monthOfAuctionEnd = data.purchase_date.slice(5, 7)
            let dayOfAuctionEnd = data.purchase_date.slice(8, 10)
            let yearOfAuctionEnd = data.purchase_date.slice(0, 4)
            let fullDateAuctionEnd =  monthOfAuctionEnd + '-' + dayOfAuctionEnd + '-' + yearOfAuctionEnd
            return (
              <div className="top-bidder-inner-container" key={idx}>
                <div className="home-page-sale-items-container__photos-inner-container">
                    <Card className={classes.paper}>
                      <CardContent className={classes.image}>
                        <img alt={data.item_name} className="item-image-homepage" src={data.item_photo} />
                      </CardContent>
                    </Card>
                    <div className="view-seller-info-button__lost-auction-data">
                    <Button 
                    color="secondary" 
                    size="medium" variant="contained" 
                    className={classes.buttons}
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
                            <TableCell align="center" className={classes.tableCell}>Top Bid</TableCell>
                            <TableCell align="center" className={classes.tableCell}>Your Bid</TableCell>
                            <TableCell align="center" className={classes.tableCell}>Date Of Your Last Bid</TableCell>
                            <TableCell align="center" className={classes.tableCell}>Auction Ended On</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableCell align="center" style={{height: '63px'}}>{data.item_name}</TableCell>
                          <TableCell align="center">${data.full_price}</TableCell>
                          <TableCell align="center">{data.num_bidders}</TableCell>
                          <TableCell align="center">${data.top_bid}</TableCell>
                          <TableCell align="center">${data.user_bid}</TableCell>
                          <TableCell align="center">{fullDateLastBid}</TableCell>
                          <TableCell align="center">{fullDateAuctionEnd}</TableCell>
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

export default LostAuctionData;
