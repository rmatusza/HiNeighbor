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
    .withMessage('You Must Enter an Item Price'),
  check('generatedImageURL')
    .exists()
    .withMessage('You Must Upload an Image'),

]

router.post('/search', asyncHandler(async(req, res) => {
  let {price_range, distance, offer_type, category, user_search, user_id} = req.body
  console.log(req.body)

  if(!price_range){
    price_range = [0, 1000000000]
  }
  const bids = await Bid.findAll({
  })
  if(offer_type === 'Services') {


    //-PURCHASE---------------------------------------------------------------


  }else if(offer_type === 'Purchase') {
    console.log('LOOKING FOR ITEMS FOR PURCHASE')
    let uppercaseSearch = user_search.slice(0,1).toUpperCase() + user_search.slice(1).toLowerCase()
    let allCapsSearch = user_search.toUpperCase()
    let lowerCaseSearch = user_search.toLowerCase()
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
        sold: false
      },
    })

    console.log(items)
    res.json({'saleItems': items, 'rentItems': [], 'bids': bids})

    //-RENT-----------------------------------------------------------------------


  } else if(offer_type === 'Rent') {
    console.log('LOOKING FOR ITEMS FOR RENT')
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
        for_rent: true,
        rented: false,
        sold: false
      }
    })
    res.json({'saleItems': [], 'rentItems': items, 'bids': bids})

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
  console.log(valRes.errors)
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

  console.log('EXPIRY DATE:', expiryDate)
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
    expiry_date: expiryDate
  })

  // const newBidTable = await Bid.create({
  //   user_id: userId,
  //   item_id: newItem.id,
  //   bid_amount: 0
  // })

  console.log('NEW ITEM:', newItem)

  const newReviewObj = await Review.create({
    reviewee_id: userId,
    item_id: newItem.id
  })

  res.json(newItem)

}))

router.post('/post-item-for-rent', postRentItemValidations, asyncHandler(async(req,res) => {

  const valRes = validationResult(req)
  console.log(valRes.errors)
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

  // console.log('EXPIRY DATE:', expiryDate)
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
    rented: false
  })

  const newReviewObj = await Review.create({
    reviewee_id: userId,
    item_id: newItem.id
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
    const updatedItem = await item.update({
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
  console.log(year)
  console.log(day)
  console.log(month)
  const date = new Date(month+'-'+day+'-'+year)
  JSON.stringify(date)

  let item = await Item.findByPk(itemId)

  item.update({
    purchaser_id: currUserId,
    sold: true,
    date_sold: date,
    current_bid: item.price
  })

  res.json({'soldItemId':itemId})
}))

router.post('/:id/rent', asyncHandler(async(req, res) => {
  const itemId = req.params.id
  console.log(req.body)
  const { currUserId, selectedDateString, rentTotal, today, rate, seller_name, itemName, imageURL, category } = req.body
  console.log(itemId, currUserId, selectedDateString, rentTotal)
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
    category: category
  })

  const updatedItem = await Item.findByPk(itemId)
  await updatedItem.update({
    rented: true
  })

  res.json({'new_rent_item': newRentItem})
}))

router.patch('/:id/rate-item', asyncHandler(async(req,res) => {
  itemId = req.params.id
  const { itemRating, currUserId } = req.body

  const review = await Review.findOne({
    where: {
      item_id: itemId
    }
  })


  if(review.rating === 0) {

    review.update({
      rating: itemRating,
      author_id: currUserId
    })
    // const reviewee = await User.findByPk(review.reviewee_id)
    // let currAverage = reviewee.average_rating
    // let numRatings = reviewee.num_ratings

    // numRatings += 1
    // let newAverage = (currAverage += itemRating)/numRatings

    // await reviewee.update({
    //   average_rating: newAverage,
    //   num_ratings: numRatings
    // })

    // await review.update({
    //   rating: itemRating,
    //   author_id: currUserId
    // })

    // review.update({
    //   rating: itemRating
    // })

    // const reviews = Review.findAll()

    res.json(review)
  }else {
    // const reviewee = await User.findByPk(review.reviewee_id)
    // let currAverage = reviewee.average_rating
    // let numRatings = reviewee.num_ratings
    // let newAverage = (currAverage += itemRating)/numRatings

    // await reviewee.update({
    //   average_rating: newAverage
    // })

    await review.update({
      rating: itemRating,
    })
    res.json(review)
  }
}))


module.exports = router
