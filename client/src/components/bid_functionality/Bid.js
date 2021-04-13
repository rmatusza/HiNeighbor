import { useState } from 'react';
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  FormControl,
  InputLabel,
  Input,
	Modal
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	buttons: {
    width: '160px'
  },
	bidHistoryButtons: {
		width: '80px'
	},
	itemBidModalHomepage: {
    position: "absolute",
    top: 100,
    left: 600,
    width: 400,
    backgroundColor: "whitesmoke",
    color: "black",
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
}))


const Bid = (props) => {
	const currUserId = useSelector(store => store.session.currentUser.id);
	const [currItemId, setCurrItemId] = useState(null);
	const [currBid, setCurrBid] = useState(null);
	const [currItemPrice, setCurrItemPrice] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [bidInput, setBidInput] = useState(null);
	const [selectedItemIdx, setSelectedItemIdx] = useState(null);

	const classes = useStyles();

	const updateBidInput = (e) => {
    setBidInput(e.target.value)
  };

	const openBidModal = (itemData) => {
		setCurrItemId(itemData.itemId)
		setCurrBid(itemData.currentBid)
		setCurrItemPrice(itemData.itemPrice)
		setSelectedItemIdx(itemData.itemIdx)
		setModalOpen(true)
	};

	const closeModal = () => {
    setModalOpen(false)
  };

	const updateItems = (newBidder) => {
		if(props.onBidHistoryPage){
			let item = props.dataRows.splice(selectedItemIdx, 1)
			props.topBidderItems.push(item[0])
			props.arr.push(1)
			props.action([props.dataRows, props.topBidderItems])
			return
		}
		if(newBidder === true){
			props.dataRows[selectedItemIdx].num_bids += 1
		}
		props.dataRows[selectedItemIdx].current_bid = parseInt(bidInput, 10)
		props.arr.push(1)
		props.action(props.dataRows)
  };

	const submitBid = async () => {
    const body = {
      bidInput,
      currUserId
    }

    const res = await fetch(`http://localhost:5000/api/items-and-services/${currItemId}/bid`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    const updatedItem = await res.json()
		const newBidder = updatedItem.new_bidder
    updateItems(newBidder)
    setModalOpen(false)
  };

	return(
		<>
			<div className="bid-button">
				<Button 
				color="secondary" 
				variant="contained" 
				onClick={() => {openBidModal({
				'itemId': props.dataRows[props.idx].id, 
				'currentBid': props.dataRows[props.idx].current_bid, 
				'itemPrice': props.dataRows[props.idx].price, 
				'itemIdx': props.idx})}} 
				className={props.onBidHistoryPage ? classes.bidHistoryButtons : classes.buttons}
				>
					Bid
				</Button>
			</div>
			<Modal
			open={modalOpen}
			onClose={closeModal}
			aria-labelledby="simple-modal-title"
			aria-describedby="simple-modal-description"
			>
				<div className={classes.itemBidModalHomepage}>
					<h2 id="simple-modal-title">Place Your Bid:</h2>
					<div>
						<FormControl>
							<InputLabel htmlFor="bid-input" style={{color: "black"}}>Bid Amount</InputLabel>
							<Input id="bid-input" onChange={updateBidInput} autoFocus style={{color: "black"}}/>
						</FormControl>
					</div>
					<div>
						<Button
							variant="contained"
							color="secondary"
							style={{ color: "white" }}
							size="small"
							className={classes.submitButton}
							onClick={() => {
								if(Number(bidInput) <= currBid) {
									alert('Your bid must be larger than the current bid amount')
								} else if(Number(bidInput) > currItemPrice) {
									alert('Your bid must be less than the item sell price')
								} else {
									submitBid()
								}
							}}
							type="submit"
						>
							Submit Bid
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
}

export default Bid;