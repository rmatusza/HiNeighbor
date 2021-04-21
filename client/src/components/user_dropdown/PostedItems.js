import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import {
  Button,
  makeStyles
} from "@material-ui/core";
import PostedSaleItems from './PostedSaleItems';
import PostedRentItems from './PostedRentItems';

const useStyles = makeStyles((theme) => ({
  grid: {
    width: '100%',
    margin: '0px'
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

const PostedItems = () => {
  const currUserId = useSelector(store => store.session.currentUser.id)
  const [forSaleButtonState, setForSaleButtonState] = useState(true)
  const [forRentButtonState, setForRentButtonState] = useState(false)
  const [saleItems, setSaleItems] = useState({'items_for_sale': []})
  const [rentItems, setRentItems] = useState({'items_for_rent': []})
  const classes = useStyles()

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

  useEffect(() => {
    (async() => {
      const res = await fetch(`/api/users/${currUserId}/get-posted-items`)
      const postedItems = await res.json()
      if(postedItems.length === 0) {
        return
      }
      let forSaleObj = {}
      let forRentObj = {}
      forSaleObj['items_for_sale'] = postedItems.items_for_sale
      forRentObj['items_for_rent'] = postedItems.items_for_rent
      setRentItems(forRentObj)
      setSaleItems(forSaleObj)
    })()
  }, [currUserId])

  return(
    <>
    <div className="for-rent-or-sale-buttons">
      <div>
      <Button className={classes.Buttons} aria-controls="simple-menu" aria-haspopup="true"  variant={forSaleButtonState ? 'contained' : 'outlined'} color="secondary" onClick={handleClick} name="for-sale">
        For Sale
      </Button>
      </div>
      <div className="for-sale-rent-toggle-buttons-divider"></div>
      <div>
      <Button className={classes.Buttons} aria-controls="simple-menu" aria-haspopup="true"  variant={forRentButtonState ? 'contained' : 'outlined'} color="secondary" onClick={handleClick} name="for-rent">
        For Rent
      </Button>
      </div>
    </div>
    <div>
        {forSaleButtonState ? <PostedSaleItems postedItems={saleItems}/> : <PostedRentItems postedItems={rentItems}/> }
      </div>
    </>
  )
}

export default PostedItems;
