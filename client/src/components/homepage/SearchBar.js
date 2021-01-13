import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from "react-redux";
import { setItems, setRentItems } from '../../actions/itemsActions';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      // width: '25ch',
      width: '500px'
    },
  },
  goButton : {
    height: '50px'
  }
}));

const SearchBar = () => {
  const classes = useStyles();
  const [input, setInput] = useState('')
  const search_params = useSelector((store) => store.entities.search_params)
  const currUserId = useSelector(store => store.session.currentUser.id)
  const dispatch = useDispatch()
  console.log('CURRENT USER ID:', currUserId)
  const handleInputChange = (e) => {
    setInput(e.target.value)
  }
  console.log(search_params)

  const handleSubmit = async(e) => {

    e.preventDefault()
    let body = {}
    for(let param in search_params) {
      console.log(param)
      body[param] = search_params[param]
    }
    if(body.category === undefined) {
      alert('Please Choose a Category')
      return
    }
    body['user_search'] = input
    body['user_id'] = currUserId
    console.log(body)
    const res = await fetch('http://localhost:5000/api/items-and-services/search', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify(body)
    })

    const items = await res.json()
    console.log('RETURNED ITEMS:', items)
    if (items.saleItems.length > 0) {
      dispatch(setItems(items.saleItems))
      dispatch(setRentItems([]))
    } else {
      dispatch(setRentItems(items.rentItems))
      dispatch(setItems([]))
    }
    console.log(items)
  }

  return (
    <div className="search-bar-and-button-container">
      <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
        <TextField id="filled-basic" label="Search:" variant="filled" onChange={handleInputChange}/>
      </form>
      <div className="go-button-container">
        <Button aria-controls="simple-menu" size='small' aria-haspopup="true" onClick={handleSubmit} variant="outlined" color="primary" className={classes.goButton}>
          Go!
        </Button>
      </div>
    </div>
  );
}

export default SearchBar;
