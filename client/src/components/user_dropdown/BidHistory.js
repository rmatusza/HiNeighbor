import React, { useState, useEffect } from 'react';
import { Button } from "@material-ui/core";
import { useSelector } from "react-redux";
import TopBidderData from './TopBidderData';
import NotTopBidderData from './NotTopBidderData';
import LostAuctionData from './LostAuctionData';

const BidHistory = () => {
  const currUserId = useSelector(store => store.session.currentUser.id)
  const [lostAuctionData, setLostAuctionData] = useState([])
  const [topBidderData, setTopBidderData] = useState([])
  const [notTopBidderData, setNotTopBidderData] = useState([])
  const [selectedView, setSelectedView] = useState('top-bidder')
  useEffect(() => {
    (async() => {
      const res = await fetch(`http://localhost:5000/api/users/${currUserId}/get-bid-history`)
      const bidData = await res.json()

      setLostAuctionData(bidData[0])
      setTopBidderData(bidData[1])
      setNotTopBidderData(bidData[2])
    })()
  }, [])

  const toggleButton = (button) => {
    setSelectedView(button)
  }

  return(
    <>
      <div className="bid-info-toggle-buttons-container">
        {/* <div className="all-bids-button-container">
          <Button color="secondary" variant={selectedView === "all-bids" ? "contained" : "outlined"} onClick={() => toggleButton('all-bids')}>
            All Bids
          </Button>
        </div> */}
        <div className="top-bidder-button-container">
          <Button color="secondary" variant={selectedView === "top-bidder" ? "contained" : "outlined"} onClick={() => toggleButton('top-bidder')}>
            Top Bidder
          </Button>
        </div>
        <div className="other-bids-button-container">
          <Button color="secondary" variant={selectedView === "other-bids" ? "contained" : "outlined"} onClick={() => toggleButton('other-bids')}>
            Other Bids
          </Button>
        </div>
        <div className="lost-auction-button-container">
          <Button color="secondary" variant={selectedView === "lost-auction" ? "contained" : "outlined"} onClick={() => toggleButton('lost-auction')}>
            Lost Auctions
          </Button>
        </div>
      </div>
      {(() => {
        if(selectedView === 'top-bidder'){
          return(
            <>
              <TopBidderData itemData={topBidderData} />
            </>
          )
        } else if(selectedView === 'other-bids'){
          return(
            <>
              <NotTopBidderData itemData={notTopBidderData} topBids={topBidderData} />
            </>
          )
        } else {
          return(
            <>
              <LostAuctionData itemData={lostAuctionData} />
            </>
          )
        }
      })()}
    </>
  )
}

export default BidHistory;
