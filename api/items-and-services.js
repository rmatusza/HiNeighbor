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
  let {price_range, distance, offer_type, category, user_search} = req.body
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
        }
      },

    })
    items.forEach(item => {

    })
    console.log(items)
    res.json({'items': items, 'bids': bids})

    //-RENT-----------------------------------------------------------------------


  } else if(offer_type === 'Rent') {
    let filteredItems = []
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
        }
      }
    })
    res.json(items)

    //-ANY OFFER TYPE------------------------------------------------------------------------------------------------
  } else {
    let filteredItems = []
    const items = await Item.findAll({
      where: {
        category: category,
        name: {
          [Op.substring]: user_search
        },
        price: {
          [Op.between]: price_range
        }
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

module.exports = router
