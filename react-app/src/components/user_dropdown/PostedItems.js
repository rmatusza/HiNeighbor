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



const useStyles = makeStyles((theme) => ({
  grid: {
    width: '100%',
    margin: '0px'
  },
  paper: {
    // padding: theme.spacing(2),
    textAlign: 'center',
    backgroundColor: theme.palette.secondary.light,
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
    alignItems: "center"
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
  }
}))

const PostedItems = () => {

  const currUserId = useSelector(store => store.session.currentUser.id)
  const [postedItems, setPostedItems] = useState([])
  const classes = useStyles()
  let items = []
  // console.log('ITEMS:', items)
  useEffect(() => {
    (async() => {
      const res = await fetch(`http://localhost:8080/api/users/${currUserId}/get-posted-items`)
      const postedItems = await res.json()
      // items = postedItems
      console.log('RETURNED ITEMS:', postedItems)
      setPostedItems(postedItems)
    })()
  }, [])

  return(
    <>
    <div>
      <h1>
        Your Items for Sale:
      </h1>
    </div>
    <div className="items-body-container">
      <div className="items-container">
        <Grid container spacing={4} className={classes.grid} >
          {postedItems.map((item) => {
            // console.log(item)
            let ext = item.image_data
            console.log(ext)
            return (
              <Grid item xs={12} md={12}>
                <Card className={classes.paper}>
                  <CardContent className={classes.image}>
                    <img className="item-image" src={`data:image/png;bas64`,require(`../../uploads/${ext}`).default} />
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </div>
      <div className="item-data-container">
        <ul>
          {postedItems.map((item, idx) => {
            console.log(item.name)
            // <li>{item.name}</li>
            return(
              <>
                <li>{item.name}</li>
                <li>Buy Now for: ${item.price}</li>
                <li>Current Bid Amount: ${item.current_bid ? item.current_bid : 0}</li>
                <li>{item.num_bids} bidders</li>
                <li>**Days Remaining</li>
              </>
            )
          })}
        </ul>

      </div>
    </div>
    </>
  )
}

export default PostedItems;
