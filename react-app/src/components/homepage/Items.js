import React from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { CardActionArea, Grid, Paper } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { SET_ITEMS } from '../../actions/types';
import UploadPhoto from './UploadPhoto';

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
  }
}))


const Items = (props) => {
  let items = useSelector(store => store.entities.items_state)
  const classes = useStyles()



  if((typeof items === 'object' && Object.keys(items).length === 0) || items === undefined) {
    console.log('NO ITEMS')
    return (
      <div>
      </div>
    )
  } else {
    console.log('ITEMS', items.items)
    return(
        <div className="items-body-container">
        <div className="items-container">
         <Grid container spacing={4} className={classes.grid} >
            {items.items.map((item) => {
              console.log(item)
              return (
                <Grid item xs={12} md={12}>
                  <Card className={classes.paper}>
                    <CardContent className={classes.image}>
                     {item.url}
                     <img className="item-image" src={require(`../../images/${item.image_url}`).default} />
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </div>
        <div className="item-data-container">
          <ul>
            {items.items.map(item => {
              // console.log(item)
              // <li>{item.name}</li>
              return(
                <>
                <li>{item.name}</li>
                <li>**Seller Name</li>
                <li>Buy Now for: ${item.price}</li>
                <li>**Current Bid Amount</li>
                <li>**Number of Bids</li>
                <li>**Days Remaining</li>
                <li><UploadPhoto /> </li>
                </>
                // <span><li></li></span>
              )
            })}
          </ul>
        </div>
        </div>

      )
  }
}


export default Items;
