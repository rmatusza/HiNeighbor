const express = require("express");
const { asyncHandler } = require('../utils');
const multer = require('multer');
const { Item, Service, User, Bid } = require("../db/models");
const Sequelize = require('sequelize');
const fs = require('fs');
const { encode } = require("punycode");
const Op = Sequelize.Op
const upload = multer({dest: 'react-app/src/uploads/'});
const router = express.Router();

router.post('/search', asyncHandler(async(req, res) => {
  let {price_range, distance, offer_type, category, user_search, user_id} = req.body
  console.log(req.body)

  if(!price_range){
    price_range = [0, 1000000000]
  }
  const bids = await Bid.findAll({
  })
  if(offer_type === 'Services') {
    console.log('hol up')


    //-PURCHASE---------------------------------------------------------------


  }else if(offer_type === 'Purchase') {

    const items = await Item.findAll({
      where: {
        category,
        for_sale: true,
        name: {
          [Op.substring]: user_search
        },

        price: {
          [Op.between]: price_range
        },
        seller_id: {
          [Op.not]: user_id
        },
        sold: false
      },
    })

    console.log(items)
    res.json({'items': items, 'bids': bids})

    //-RENT-----------------------------------------------------------------------


  } else if(offer_type === 'Rent') {
    console.log('PRICE RANGE', price_range)
    const items = await Item.findAll({
      where: {
        category: category,
        for_rent: true,
        name: {
          [Op.substring]: user_search
        },
        price: {
          [Op.between]: price_range
        },
        seller_id: {
          [Op.not]: user_id
        },
        sold: false
      }
    })
    res.json({'items': items})

    //-ANY OFFER TYPE------------------------------------------------------------------------------------------------
  } else {
    const items = await Item.findAll({
      where: {
        category: category,
        name: {
          [Op.substring]: user_search
        },
        price: {
          [Op.between]: price_range
        },
        seller_id: {
          [Op.not]: user_id
        },
        sold: false
      }
    })
  }
}))

// uploads a photo to react-app/src/uploads

router.post('/upload-photo', upload.single('Image'), async(req, res) =>{
  res.json(req.file)
})

// router.get('/examine-file', async(req,res) => {
//   // const id = req.params.id
//   const newImage = await image.findByPk(2)
//   console.log(newImage)
//   res.json({'encoded_image': newImage.image_data})
// })

router.post('/post-item', asyncHandler(async(req,res) => {
  const {
    userId,
    itemName,
    itemDescription,
    itemCategory,
    itemPrice,
    itemQuantity,
    itemForSale,
    imageData
  } = req.body
  console.log('IMAGE DATA:', imageData)
  // res.json(req.body)

  const newItem = await Item.create({
    seller_id: userId,
    name: itemName,
    description: itemDescription,
    category: itemCategory,
    price: itemPrice,
    quantity: itemQuantity,
    for_rent: !itemForSale,
    for_sale: itemForSale,
    image_data: imageData
  })

  const newBidTable = await Bid.create({
    user_id: userId,
    item_id: newItem.id,
    bid_amount: 0
  })


  res.json(newItem)

}))

router.patch('/:id/bid', asyncHandler(async(req, res) => {
  const itemId = req.params.id
  const { bidInput, currUserId } = req.body

  console.log('USER BID:', bidInput)
  console.log('ITEM ID:', itemId)
  console.log('USER ID:', currUserId)

  const bid = await Bid.findOne({
    where: {
      item_id: itemId,
      user_id: currUserId
    }
  })

  if(!bid) {
    console.log('NOT ALREADY A BID OBJECT')
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
    console.log('NUM BIDS:', numBids)
    const updatedItem = item.update({
      current_bid: bidInput,
      bid_ids: bidIds += newBid.id,
      num_bids: numBids += 1,
    })



    res.json(updatedItem)
  } else {
    console.log('ALREADY A BID OBJECT')

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

router.patch('/:id/purchase', asyncHandler(async(req, res) => {
  const itemId = req.params.id
  const { currUserId } = req.body

  let item = await Item.findByPk(itemId)

  item.update({
    purchaser_id: currUserId,
    sold: true
  })

  res.json({'soldItemId':itemId})
}))

module.exports = router
