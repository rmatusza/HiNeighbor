import React, { useState, useEffect } from 'react';
import {
  Button,
} from "@material-ui/core";
import { useDispatch, useSelector, connect } from "react-redux";
import TopBidderData from './TopBidderData';
import NotTopBidderData from './NotTopBidderData';
import LostAuctionData from './LostAuctionData';

const BidHistory = () => {
  const currUserId = useSelector(store => store.session.currentUser.id)
  const [lostAuctionData, setLostAuctionData] = useState([])
  const [topBidderData, setTopBidderData] = useState([])
  const [notTopBidderData, setNotTopBidderData] = useState([])
  const [allBidsContainerVisibility, setAllBidsContainerVisibility] = useState('all-bid-history-container__visible')
  const [topBidderOnlyContainerVisibility, setBidderOnlyContainerVisibility] = useState('top-bidder-only-container__invisible')
  const [otherBidsOnlyContainerVisibility, setOtherBidsOnlyContainerVisibility] = useState('other-bids-only-container__invisible')
  const [lostAuctionOnlyContainerVisibility, setLostAuctionOnlyContainerVisibility] = useState('lost-auction-only-container__invisible')

  useEffect(() => {
    (async() => {
      const res = await fetch(`http://localhost:5000/api/users/${currUserId}/get-bid-history`)
      const bidData = await res.json()

      setLostAuctionData(bidData[0])
      setTopBidderData(bidData[1])
      setNotTopBidderData(bidData[2])
    })()
  }, [])

  return(
    <>
      <div className="bid-info-toggle-buttons-container">
        <div>
          <Button className="all-bids-button">All Bids</Button>
        </div>
        <Button className="top-bidder-button">Top Bidder</Button>
        <Button className="other-bids-button">Other Bids</Button>
        <Button>Lost Auctions</Button>
      </div>
      <div className={allBidsContainerVisibility}>
        <TopBidderData itemData={topBidderData}/>
        <NotTopBidderData itemData={notTopBidderData} />
        <LostAuctionData itemData={lostAuctionData} />
      </div>
      <div className={topBidderOnlyContainerVisibility}>
        <topBidderData itemData={topBidderData} />
      </div>
      <div className={otherBidsOnlyContainerVisibility}>
        <NotTopBidderData itemData={notTopBidderData} />
      </div>
      <div className={lostAuctionOnlyContainerVisibility}>
        <LostAuctionData itemData={lostAuctionData} />
      </div>
    </>
  )
}

export default BidHistory;
