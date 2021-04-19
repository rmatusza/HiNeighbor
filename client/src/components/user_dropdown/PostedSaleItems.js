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

function createData(name, price, bid, num_bidders, days_remaining, description) {
  return { name, price, bid, num_bidders, days_remaining, description};
}

const PostedSaleItems = (props) => {
  const classes = useStyles()

  let rows = []

  props.postedItems.items_for_sale.forEach((item, idx) => {
    const d1 = new Date(item.expiry_date)
    const today = new Date()
    today.setDate(today.getDate()+0)
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const days_remaining = Math.round(Math.abs((today - d1) / oneDay));
    if(item.current_bid === null) {
      rows.push(createData(item.name, item.price, 0, item.num_bids, days_remaining, item.description))
    } else {
      rows.push(createData(item.name, item.price, item.current_bid, item.num_bids, days_remaining, item.description))
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
        <div className="body-container-posted-sale-items">
          {props.postedItems.items_for_sale.map((item, idx) => {
            let url = item.image_url
            return (
              <div className="posted-sale-item-outer-container" key={idx}>
                <div className="body-container-posted-sale-items__photos-container">
                  <div className="item-photo-container-posted-sale-items">
                    <Card className={classes.paper}>
                      <CardContent className={classes.image}>
                        <img alt={item.name} className="item-image" src={url} />
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <div className="body-container-posted-sale-items__for-sale-table-container">
                  <div className="body-container-posted-sale-items__for-sale-table-container__for-sale-table">
                    <TableContainer className={classes.tableContainer}  style={{marginRight: "20px"}}>
                      <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead className={classes.tableHead}>
                          <TableRow>
                            <TableCell align="center" className={classes.tableCell}>Item Name</TableCell>
                            <TableCell align="center" className={classes.tableCell}>Full Sale Price</TableCell>
                            <TableCell align="center" className={classes.tableCell}>Current Bid</TableCell>
                            <TableCell align="center" className={classes.tableCell}>Number of Bidders</TableCell>
                            <TableCell align="center" className={classes.tableCell}>Days Remaining</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow key={rows[idx].name}>
                            <TableCell align="center">{rows[idx].name}</TableCell>
                            <TableCell align="center">${rows[idx].price}</TableCell>
                            <TableCell align="center">${rows[idx].bid}</TableCell>
                            <TableCell align="center">{rows[idx].num_bidders}</TableCell>
                            <TableCell align="center">{rows[idx].days_remaining}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <div className="posted-sale-items-description-container">
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

export default PostedSaleItems;
