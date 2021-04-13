import { useState } from 'react';
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
	Dialog,
	DialogActions,
	DialogTitle
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	buttons: {
    width: '160px'
  },
}))

const Purchase = (props) => {
	const [currItemId, setCurrItemId] = useState(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const dispatch = useDispatch();
	const classes = useStyles()

	const handleDialogClose = () => {
    setDialogOpen(false)
  };

	const handleDialogOpen = (itemData) => {
		//('ITEM DATA:', itemData)
		setCurrItemId(itemData.itemId)
		setDialogOpen(true)
	};

	const updateSoldItems = () => {
    // let currItems = []
    // items.forEach((item, i) => {
    //   if(Number(item.id) !== Number(id)) {
    //     currItems.push(item)
    //   }
    //   dispatch(setItems(currItems))
    // })
		props.dataRows.splice(props.idx, 1)
		props.arr.push(1)
		props.action(props.dataRows)
  };

	const handlePurchase = async () => {
    // const body = {
    //   currUserId: props.currUserId
    // }

    // const res = await fetch(`http://localhost:5000/api/items-and-services/${currItemId}/purchase`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(body)
    // })
    // const {soldItemId} = await res.json()
    //(soldItemId)

    updateSoldItems()
    handleDialogClose()
  };


	return(
		<>
			<div className="buy-button">
				<Button color="secondary" size="medium" variant="contained" onClick={() => {handleDialogOpen({'itemId': props.dataRows[props.idx].item_id, 'currentBid': props.dataRows[props.idx].current_bid, 'itemPrice': props.dataRows[props.idx].item_price})}} className={classes.buttons}>
					Purchase
				</Button>
      </div>
			<Dialog
				open={dialogOpen}
				onClose={handleDialogClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					{"Are you sure that you want to purchase this item at its full sale price?"}
				</DialogTitle>
				<DialogActions>
					<Button onClick={handleDialogClose} className={classes.buttons} color="secondary" variant="contained">
						Cancel
					</Button>
					<Button className={classes.buttons} color="secondary" variant="contained" autoFocus onClick={handlePurchase}>
						Purchase Item
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)

}

export default Purchase;