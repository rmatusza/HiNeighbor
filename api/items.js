const express = require("express");
const { asyncHandler } = require('../utils');
const { Item, Service, User, Bid } = require("../db/models");
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const router = express.Router();

router.patch('/:id/bid', asyncHandler(async(req, res) => {
  const itemId = req.params.id
  const { bidInput, currUserId } = req.body

  //('USER BID:', bidInput)
  //('ITEM ID:', itemId)
  //('USER ID:', currUserId)

  const bid = await Bid.findOne({
    where: {
      item_id: itemId,
      user_id: currUserId
    }
  })

  if(!bid) {
    //('NOT ALREADY A BID OBJECT')
    const newBid = await Bid.create({
      item_id: itemId,
      user_id: currUserId,
      bid_amount: bidInput
    })

    if(!newBid){
      res.json('ERROR: new bid object was not created')
    }

    const item = await Item.findByPk(itemId)
    let bidIds = item.bid_ids
    let numBids = item.num_bids
    //('NUM BIDS:', numBids)
    const updatedItem = item.update({
      current_bid: bidInput,
      bid_ids: bidIds += newBid.id,
      num_bids: numBids += 1,
    })



    res.json(updatedItem)
  } else {
    //('ALREADY A BID OBJECT')

    bid.update({
      bid_amount: bidInput
    })
    const item = await Item.findByPk(itemId)
    item.update({
      current_bid: bidInput
    })
    res.json(item)
  }



  // 1) current highest bid -> in any case we must increment this on the item object
  // 2) number of bids -> is there already a bid object with the provided itemid and currUserId
  // if not make new bid object and increment numBids on item object
  // 3) string containing associated bid object ids --> if making a new bid object
  // need to add id to string
}))


module.exports = router;
