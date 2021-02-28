import React from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import './sellerProfile.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles((theme) => ({
  grid: {
    width: '100%',
    margin: '0px',
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

const SellerProfileForSale = (props) => {
  let itemData = props.itemData['user_data']['items_for_sale']
  let tableData = props.itemData['table_data']
  const classes = useStyles()

  return(
    <>
      <div className="divider">
      </div>
      <div className="seller-items-body-container-background">
        {itemData ?
        <div className="seller-items-body-container">
          {/* <div className="seller-items-container"> */}
            <Grid container spacing={1} className={classes.grid} >
              {itemData.map((item, idx) => {
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
                                    <TableCell align="center" className={classes.tableCell}>Full Sale Price</TableCell>
                                    <TableCell align="center" className={classes.tableCell}>Current Bid</TableCell>
                                    <TableCell align="center" className={classes.tableCell}>Number of Bidders</TableCell>
                                    <TableCell align="center" className={classes.tableCell}>Days Remaining</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>

                                  <TableRow key={tableData[idx].name}>
                                    <TableCell align="center">${tableData[idx].price}</TableCell>
                                    <TableCell align="center">${tableData[idx].bid}</TableCell>
                                    <TableCell align="center">{tableData[idx].num_bidders}</TableCell>
                                    <TableCell align="center">{tableData[idx].days_remaining}</TableCell>
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
        :
        <>
        </>
        }
      </div>
    </>
  )
}

export default SellerProfileForSale;
