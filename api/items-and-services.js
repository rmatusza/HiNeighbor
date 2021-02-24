const express = require("express");
const { asyncHandler } = require('../utils');
const { check, validationResult } = require("express-validator");
const multer = require('multer');
const upload = multer();
const { Item, Service, User, Bid, Review, Rented_Item } = require("../db/models");
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const router = express.Router();
const AWS = require("aws-sdk")
const { awsKeys } = require ("../config");

AWS.config.update({
  secretAccessKey: awsKeys.secretAccessKey,
  accessKeyId: awsKeys.accessKeyId,
  region: awsKeys.region,
})

const s3 = new AWS.S3()

const fileFilter = (req, res, next) => {
  const file = req.files[0];
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/webp") {
    next();
  } else {
    return
  }
}

const postRentItemValidations = [
  check('itemName')
    .exists()
    .isLength({min: 3, max: 50})
    .withMessage('You Must Enter an Item Name'),
  check('itemDescription')
    .exists({ checkFalsy: true })
    .withMessage('You Must Enter an Item Description'),
  check('itemCategory')
    .exists({ checkFalsy: true })
    .withMessage('You Must Pick a Category'),
  check('itemPrice')
    .exists({ checkFalsy: true })
    .isInt()
    .withMessage('You Must Enter an Item Price'),
  check('rate')
    .exists({ checkFalsy: true })
    .withMessage('You Must Choose a Rent Period and Price'),
  check('generatedImageURL')
    .exists()
    .withMessage('You Must Upload an Image'),
]

const postItemValidations = [
  check('itemName')
    .exists()
    .isLength({min: 3, max: 50})
    .withMessage('You Must Enter an Item Name'),
  check('itemDescription')
    .exists({ checkFalsy: true })
    .withMessage('You Must Enter an Item Description'),
  check('itemCategory')
    .exists({ checkFalsy: true })
    .withMessage('You Must Pick a Category'),
  check('itemPrice')
    .exists({ checkFalsy: true })
    .isInt()
    .withMessage('You Must Enter an Item Price'),
  check('generatedImageURL')
    .exists()
    .withMessage('You Must Upload an Image'),

]

router.post('/search', asyncHandler(async(req, res) => {
  let {price_range, distance, offer_type, category, user_search, user_id} = req.body
  //(req.body)

  if(!price_range){
    price_range = [0, 1000000000]
  }
  const bids = await Bid.findAll({
  })
  if(offer_type === 'Services') {


    //-PURCHASE---------------------------------------------------------------


  }else if(offer_type === 'Purchase') {
    //('LOOKING FOR ITEMS FOR PURCHASE')
    // let uppercaseSearch = user_search.slice(0,1).toUpperCase() + user_search.slice(1).toLowerCase()
    // let allCapsSearch = user_search.toUpperCase()
    // let lowerCaseSearch = user_search.toLowerCase()
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const today = new Date(month+'-'+day+'-'+year)
    const items = await Item.findAll({
      where: {
        category,
        for_sale: true,
        name: { [Op.iLike]: `%${user_search}%` },
        price: {
          [Op.between]: price_range
        },
        seller_id: {
          [Op.not]: user_id
        },
        sold: false,
        expired: false
      },
    })
    // //('ITEMS:', items)
    const expired = []
    const notExpired = ['no_items']
    items.forEach(item => {
      //('EXPIRY DATE:', item.expiry_date)
      if (new Date(item.expiry_date) < today) {
        expired.push(item)
      } else {
        if(notExpired[0] === 'no_items') {
          notExpired.shift()
          notExpired.push(item)
        } else {
          notExpired.push(item)
        }
      }
    })
    //('EXPIRED:', expired)
    //('NOT EXPIRED:', notExpired)
    //('TODAY:', today)
    if(expired.length > 0){
      expired.forEach(async(item) => {
        if(item.last_bidder !== null) {
          await item.update({
            sold: true,
            purchaser_id: item.last_bidder,
            date_sold: item.expiryDate,
            price: item.current_bid
          })
          await Review.create({
            reviewee_id: item.seller_id,
            item_id: item.id,
            rating: 0
          })
        } else {
          await item.update({
            expired: true
          })
        }
      })
    }

    if(items.length === 0) {
      res.json({'saleItems': ['no_items'], 'rentItems': [], 'bids': bids})
    } else {
      res.json({'saleItems': notExpired, 'rentItems': [], 'bids': bids})
    }

    //-RENT-----------------------------------------------------------------------


  } else if(offer_type === 'Rent') {
    //('LOOKING FOR ITEMS FOR RENT')
      const date = new Date()
      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      const today = new Date(month+'-'+day+'-'+year)
      const items = await Item.findAll({
      where: {
        category: category,
        name: { [Op.iLike]: `%${user_search}%` },
        price: {
          [Op.between]: price_range
        },
        seller_id: {
          [Op.not]: user_id
        },
        for_rent: true,
      }
    })

    let itemsAvaliableForRent = []
    items.forEach(async(item) => {
      console.log(item.name)
      // if(new Date(item.expiry_date) < today) {
      //   console.log('IF')
      //   await item.update({rented: false, expiry_date: null})
      //   itemsAvaliableForRent.push(item)
      // }else if(item.rented === false) {
      //   console.log('ELSE IF')
      //   itemsAvaliableForRent.push(item)
      // } else {
      //   console.log('ELSE')
      //   itemsAvaliableForRent.push(item)
      // }
      itemsAvaliableForRent.push(item)
    })

    console.log('ITEMS FOR RENT:', itemsAvaliableForRent)

    if(items.length === 0) {
      res.json({'saleItems': [], 'rentItems': ['no_results'], 'bids': bids})
    } else {
      res.json({'saleItems': [], 'rentItems': itemsAvaliableForRent, 'bids': bids})
    }

    //-ANY OFFER TYPE------------------------------------------------------------------------------------------------
  } else {

    let saleItems = []
    let rentItems = []

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
    items.forEach(item => {
      if (item.for_sale === true) {
        saleItems.push(item)
      } else {
        rentItems.push(item)
      }
    })
    res.json({'saleItems': saleItems, 'rentItems': rentItems, 'bids':bids})
  }
}))

// uploads a photo to react-app/src/uploads

router.post('/upload-photo', upload.any(), fileFilter, asyncHandler(async (req, res) =>{
  const file = req.files[0]
  const params = {
    Bucket: "hi-neighbor-item-photos",
    Key: Date.now().toString()+file.originalname,
    Body: file.buffer,
    ACL: "public-read",
    ContentType: file.mimetype
  }

  const promise = s3.upload(params).promise()
  const uploadedImage = await promise
  const imageURL = uploadedImage.Location
  res.json({'imageURL': imageURL})
}))

router.post('/post-item', postItemValidations, asyncHandler(async(req,res) => {

  // const today = new Date()
  // today.setDate(today.getDate()+0)

  const valRes = validationResult(req)
  //(valRes.errors)
  if (valRes.errors.length > 0) {
    res.json(valRes)
    return
  }

  const {
    userId,
    username,
    itemName,
    itemDescription,
    itemCategory,
    itemPrice,
    generatedImageURL,
    expiryDate
  } = req.body
  // res.json(req.body)

  //('EXPIRY DATE:', expiryDate)
  const newItem = await Item.create({
    seller_id: userId,
    seller_name: username,
    name: itemName,
    description: itemDescription,
    category: itemCategory,
    price: itemPrice,
    quantity: 1,
    for_rent: false,
    for_sale: true,
    image_url: generatedImageURL,
    expiry_date: expiryDate,
    expired: false
  })

  // const newBidTable = await Bid.create({
  //   user_id: userId,
  //   item_id: newItem.id,
  //   bid_amount: 0
  // })

  //('NEW ITEM:', newItem)

  res.json(newItem)

}))

router.post('/post-item-for-rent', postRentItemValidations, asyncHandler(async(req,res) => {

  const valRes = validationResult(req)
  //(valRes.errors)
  if (valRes.errors.length > 0) {
    res.json(valRes)
    return
  }

  const today = new Date()
  const day = today.getDate()
  const month = today.getMonth() + 1
  const year = today.getFullYear()
  const date = new Date(month+'-'+day+'-'+year)
  JSON.stringify(date)

  const {
    userId,
    username,
    itemName,
    itemDescription,
    itemCategory,
    itemPrice,
    rate,
    generatedImageURL,
  } = req.body
  // res.json(req.body)

  // //('EXPIRY DATE:', expiryDate)
  const newItem = await Item.create({
    seller_id: userId,
    seller_name: username,
    name: itemName,
    description: itemDescription,
    category: itemCategory,
    price: itemPrice,
    rate: rate,
    quantity: 1,
    for_rent: true,
    for_sale: false,
    image_url: generatedImageURL,
    rented: false,
    expired: false
  })

  res.json(newItem)
}))

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
    const updatedItem = await item.update({
      current_bid: bidInput,
      bid_ids: bidIds += newBid.id,
      num_bids: numBids += 1,
      last_bidder: currUserId
    })



    res.json(updatedItem)
  } else {
    //('ALREADY A BID OBJECT')

    bid.update({
      bid_amount: bidInput
    })
    const updatedItem = await Item.findByPk(itemId)
    updatedItem.update({
      current_bid: bidInput
    })
    res.json(updatedItem)
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

  const today = new Date()
  const day = today.getDate()
  const month = today.getMonth() + 1
  const year = today.getFullYear()
  const date = new Date(month+'-'+day+'-'+year)
  JSON.stringify(date)

  let item = await Item.findByPk(itemId)
  await item.update({ purchaser_id: currUserId, sold: true, date_sold: date})

  const newReviewObj = await Review.create({
    reviewee_id: item.seller_id,
    item_id: item.id,
    rating: 0
  })

  res.json({'soldItemId':itemId})
}))

router.post('/:id/rent', asyncHandler(async(req, res) => {
  const itemId = req.params.id
  //(req.body)
  const { currUserId, selectedDateString, rentTotal, today, rate, seller_name, itemName, imageURL, category, seller_id } = req.body
  //(itemId, currUserId, selectedDateString, rentTotal)
  const dateObj = new Date(selectedDateString)
  JSON.stringify(dateObj)
  JSON.stringify(today)

  const newRentItem = await Rented_Item.create({
    item_id: Number(itemId),
    item_name: itemName,
    user_id: currUserId,
    seller_name: seller_name,
    return_date: dateObj,
    rent_total: rentTotal,
    start_date: today,
    rate: rate,
    active: true,
    image_url: imageURL,
    category: category,
    seller_id: seller_id
  })

  const updatedItem = await Item.findByPk(itemId)
  await updatedItem.update({
    rented: true,
    expiry_date: dateObj
  })

  const newReviewObj = await Review.create({
    reviewee_id: updatedItem.seller_id,
    item_id: newRentItem.id
  })

  res.json({'new_rent_item': newRentItem})
}))

router.patch('/:id/rate-item', asyncHandler(async(req,res) => {
  itemId = req.params.id
  const { itemRating, currUserId, sellerId } = req.body

  const review = await Review.findOne({
    where: {
      item_id: itemId
    }
  })

  if(!review) {
    const review = await Review.create({
      reviewee_id: sellerId,
      rating: itemRating,
      author_id: currUserId,
      item_id: itemId
    })
    res.json(review)
  }

  if(review.rating === 0) {

    review.update({
      rating: itemRating,
      author_id: currUserId
    })
    res.json(review)

  }else {

    await review.update({
      rating: itemRating,
    })
    res.json(review)
  }
}))


module.exports = router
