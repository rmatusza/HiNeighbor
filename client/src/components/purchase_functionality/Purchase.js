import { useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
	Dialog,
	DialogActions,
	DialogTitle
} from "@material-ui/core";

const useStyles = makeStyles(() => ({
	buttons: {
    width: '160px'
  },
	bidHistoryButtons: {
		width: '80px'
	},
	dialogBox: {
    width: '200px',
    heigth: '200px'
  },
}))

const Purchase = (props) => {
	const [currItemId, setCurrItemId] = useState(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const classes = useStyles()
	const handleDialogClose = () => {
    setDialogOpen(false)
  };

	const handleDialogOpen = (itemData) => {
		console.log(itemData)
		setCurrItemId(itemData.itemId)
		setDialogOpen(true)
	};

	const updateSoldItems = () => {
		props.dataRows.splice(props.idx, 1)
		props.arr.push(1)
		props.action(props.dataRows)
  };

	const handlePurchase = async () => {
    const body = {
      currUserId: props.currUserId
    }

    await fetch(`http://localhost:5000/api/items-and-services/${currItemId}/purchase`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    updateSoldItems()
    handleDialogClose()
  };


	return(
		<>
			<div className="buy-button">
				<Button color="secondary" size="medium" variant="contained" onClick={() => {handleDialogOpen({'itemId': props.dataRows[props.idx].id, 'currentBid': props.dataRows[props.idx].current_bid, 'itemPrice': props.dataRows[props.idx].price})}} className={props.onBidHistoryPage ? classes.bidHistoryButtons : classes.buttons}>
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