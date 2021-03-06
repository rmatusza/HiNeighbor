const express = require("express");
const bcrypt = require("bcryptjs");
const { User, Item, Review, Rented_Item, Bid, Conversation, Message } = require("../db/models");
const { asyncHandler } = require('../utils');
const { check, validationResult } = require("express-validator");
const { getUserToken, verifyUser } = require('../auth');
const bearerToken = require("express-bearer-token");
const { secret, expiresIn } = require('../config').jwtConfig;
const jwt = require('jsonwebtoken');
const multer = require('multer');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
// const order = Sequelize.order

const upload = multer({dest: 'uploads/'});
const router = express.Router();

const signInValidations = [
  check("email")
    .exists({ checkFalsy: true })
    .withMessage("An email address is required")
    .isEmail()
    .withMessage("A valid email address is required")
    .isLength({ max: 100 })
    .withMessage("Email address must be less than 100 characters"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("User password is required"),
];

const signUpValidations = [
  check("email")
    .exists({ checkFalsy: true })
    .withMessage("An email address is required")
    .isEmail()
    .withMessage("A valid email address is required")
    .isLength({ max: 100 })
    .withMessage("Email address must be less than 100 characters"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("User password is required"),
  check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("You must provide a first name")
    .isLength({max: 50})
    .withMessage("First name must be less than 50 characters"),
  check("lastName")
    .exists({ checkFalsy: true })
    .withMessage("You must provide a last name")
    .isLength({max: 50})
    .withMessage("Last name must be less than 50 characters"),
  check("username")
    .exists({ checkFalsy: true })
    .withMessage("You must provide a username")
    .isLength({max: 25})
    .withMessage("Your username must be less than 25 characters")

];

router.post('/token', signInValidations, asyncHandler(async(req, res) => {
  const valRes = validationResult(req)
  if (valRes.errors.length > 0) {
    res.json(valRes)
    return
  }
  const {email, password} = req.body;
  const user = await User.findOne({
    where: {
      email
    }
  })
  if(user) {
    const dbPassword = user.dataValues.hashedPassword
    bcrypt.compare(password, dbPassword.toString(), (err, isMatch) => {
      if(err) {
        throw err
      } else if (!isMatch) {
        const err = Error
        err.status = 401,
        err.message = 'incorect password'
        res.json({'errors': [{'msg': 'Incorrect password'}]})
      } else {
        const token = getUserToken(user)
        res.cookie("access_token", token, { httpOnly: false });
        res.json({ token, user: { id: user.id, userName: user.username, firstName: user.first_name, lastName: user.last_name } });
      }
    })
  } else {
    res.json({'errors': [{'msg': 'Incorrect email'}]})
  }
}))

router.post('/signup', signUpValidations, asyncHandler(async(req, res) => {
  const valRes = validationResult(req)
  if (valRes.errors.length > 0) {
    res.json(valRes)
    return
  }
  const {email, password, username, firstName, lastName} = req.body
  let maxId = await User.max('id') + 1
  const userCheck = await User.findAll({
    where: {
     email,
     username
    }
  })
  userCheck.forEach(discoveredUser => {
    if(discoveredUser.email === email) {
      const err = Error
      err.message = 'This email is already associated with an account'
      res.json(err)
      return
    } else {
      const err = Error
      err.message = 'This username has already been taken'
      res.json(err)
      return
    }
  })
  const newUser = await User.create({
    id: maxId,
    email,
    first_name: firstName,
    last_name: lastName,
    username,
    hashedPassword: bcrypt.hashSync(password, 10),
  })
  //('NEW USER:', newUser)
  const token = getUserToken(newUser)
  res.cookie("access_token", token, { httpOnly: false });
  res.json({ token, user: { id: newUser.id, userName: newUser.username, firstName: newUser.first_name, lastName: newUser.last_name } });
}))

router.post('/authenticate', verifyUser, asyncHandler(async(req, res) => {
  const user = await User.findByPk(req.user.data.id)
  const userData = {
    id: user.id,
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name
  }
  res.json(userData)
}))

router.get('/:id/get-posted-items', asyncHandler(async(req,res) => {
  const userId = req.params.id
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const today = new Date(month+'-'+day+'-'+year)
  let test = new Date("2021-02-21T00:27:34.538Z")
  const items = await Item.findAll({
    where:{
      seller_id: userId,
      sold: false,
      expired: false
    }
  })

  let itemsForRent = []
  let itemsForSale = []

  items.forEach(async(item) => {
    if(item.for_sale === true && new Date(item.expiry_date) < today && item.last_bidder !== null){
      await item.update({
        sold: true,
        purchaser_id: item.last_bidder
      })
      await Review.create({
        reviewee_id: item.seller_id,
        item_id: item.id,
        rating: 0
      })
    }else if(item.for_sale === true && new Date(item.expiry_date) < today && item.last_bidder === null){
      await item.update({
        expired: true,
      })
    }else if(item.for_sale === true) {
      itemsForSale.push(item)
    } else if(item.for_rent === true) {
      itemsForRent.push(item)
    }
  })

  res.json({'items_for_sale': itemsForSale, 'items_for_rent': itemsForRent})
}))

router.post('/:id/get-seller-info', asyncHandler(async(req,res) => {
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const today = new Date(month+'-'+day+'-'+year)

  const { sellerId } = req.body
  const items = await Item.findAll({
    where: {
      seller_id: sellerId,
    },
  })

  let itemIds = []
  let itemsSold = 0
  let userData = {}

  items.forEach(async(item, i) => {
    if(item.for_sale === true && new Date(item.expiry_date) < today && item.last_bidder !== null){
      await item.update({
        sold: true,
        purchaser_id: item.last_bidder
      })
      itemsSold++
      itemIds.push(item.id)
    }else if(item.for_sale === true && new Date(item.expiry_date) < today && item.last_bidder === null){
      await item.update({
        expired: true,
      })
    }else if(item.sold === true){
      // console.log('ITEM HAS BEEN SOLD:', item.name)
      itemsSold++
      itemIds.push(item.id)
      items.splice(i, 1)
    }
  })

  const user = await User.findByPk(sellerId)

  let ratings = 0
  let numRatings = 0

  const reviews = await Review.findAll({
    where: {
      reviewee_id: sellerId,
      rating: {
        [Op.ne]: 0
      }
    }
  })

  if (reviews.length !== 0) {
    reviews.forEach(review => {
      numRatings += 1
      ratings += review.rating
    })
    userData.num_ratings = numRatings
    userData.average_rating = ratings/numRatings
  } else {
    userData.num_ratings = numRatings
    userData.average_rating = null
  }

  userData.items_sold = itemsSold
  userData.username = user.username

  res.json({'items': items, 'user': userData, 'items_sold': itemsSold})
}))

router.get('/:id/get-purchase-history', asyncHandler(async(req,res) => {
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const today = new Date(month+'-'+day+'-'+year)
  const userId = req.params.id

  const items = await Item.findAll({
    where: {
      [Op.or]: [
        { purchaser_id: userId },
        { last_bidder: userId }
      ]
    },
    order: [['id', 'ASC']]
  })

  let ids = []
  let itemIds = []
  let purchasedItems = []
  let rentItems = []
  let userobj = {}
  let itemsToUpdate = []
  items.forEach(item => {
    if(item.sold === false && new Date(item.expiry_date) < today) {
      itemsToUpdate.push(item)
      ids.push(item.seller_id)
      itemIds.push(item.id)
    }
    if(item.sold === true) {
      ids.push(item.seller_id)
      itemIds.push(item.id)
      purchasedItems.push(item)
    }
  })

  itemsToUpdate.forEach(async(item) => {
    await Item.update({sold: true, purchaser_id: userId, date_sold: item.expiry_date, price: current_bid}, {
      where: {
        id: item.id
      }
    })
    purchasedItems.push(item)
    await Review.create({
      reviewee_id: item.seller_id,
      item_id: item.id,
      rating: 0
    })
  })

  const users = await User.findAll({
    where: {
      id: ids,
    },
  })

  const reviews = await Review.findAll({
    where: {
      item_id: itemIds
    },
    order: [['item_id', 'ASC']]
  })

  res.json({'users': users, 'reviews': reviews, 'purchased_items': purchasedItems})
}))

router.get('/:id/get-rent-history', asyncHandler(async(req,res) => {
  const userId = req.params.id
  const rentedItems = await Rented_Item.findAll({
    where:{
      user_id: userId,
    },
    order: [['id', 'ASC']]
  })
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const today = new Date(month+'-'+day+'-'+year)

  const returnedRentedItems = []
  const returnedRentedItemsIds = []
  const currentRentedItems = []

  rentedItems.forEach(async(item) => {
    if(new Date(item.return_date) < today) {
      returnedRentedItems.push(item)
      if(item.active === true){
        returnedRentedItemsIds.push(item.item_id)
        await item.update({active: false})
      }
    } else {
      currentRentedItems.push(item)
    }
  })


  await Item.update({rented: false}, {
    where: {
      id: returnedRentedItemsIds
    }
  })

  returnedRentedItems.forEach(async(item) => {
    await Review.create({
      reviewee_id: item.seller_id,
      item_id: item.id,
      rating: 0
    })
  })

  let itemIds = []
  rentedItems.forEach(item => {
    itemIds.push(item.id)
  })

  const reviews = await Review.findAll({
    where: {
      item_id: itemIds
    },
    order: [['id', 'ASC']]
  })

  res.json({'reviews': reviews, 'rent_items': currentRentedItems, 'returned_rented_items': returnedRentedItems})
  // res.json(items)
}))

router.get('/:id/get-bid-history', asyncHandler(async(req,res) => {

  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const today = new Date(month+'-'+day+'-'+year)
  const userId = parseInt(req.params.id, 10)
  const bidData = []

  const bidObjects = await Bid.findAll({
    where: {
      user_id: userId,
    },
    include: {
      model: Item,
    }
  })

  const lostAuctions = []
  const topBidder = []
  const notTopBidder = []

  for(let i=0; i<bidObjects.length; i++){

    const bidObject = bidObjects[i]
    const expiryDate = new Date(bidObject.dataValues.Item.expiry_date)
    const lastBidderId = bidObject.dataValues.Item.last_bidder
    const purchaserId = bidObject.dataValues.Item.purchaser_id
    // console.log('PURCHASER ID:', purchaserId)
    // console.log('USER ID:', userId)
    const bidData = bidObject.dataValues
    const ItemData = bidObject.dataValues.Item
    const oneDay = 24 * 60 * 60 * 1000
    const daysRemainingInAuction = Math.round((expiryDate - today)/oneDay)
    //('ITEM NAME:', ItemData)
    //('LAST BIDDER:', lastBidderId)
    //('USER ID:', userId)

    if((expiryDate < today && lastBidderId === userId) || (ItemData.purchaser_id === userId)){
      continue
    } else if((expiryDate < today && lastBidderId !== userId) || (purchaserId !== userId && purchaserId !== null)){
      lostAuctions.push(
        {
        'user_bid': bidData.bid_amount,
        'bid_date': bidData.updatedAt,
        'item_photo': ItemData.image_url,
        'item_name': ItemData.name,
        'item_description': ItemData.description,
        'full_price': ItemData.price,
        'top_bid': ItemData.current_bid,
        'num_bidders': ItemData.num_bids,
        'purchase_date': ItemData.date_sold,
        'seller_id': ItemData.seller_id
      })
    } else if(lastBidderId === userId){
      topBidder.push(
        {
        'bid_date': bidData.updatedAt,
        'id': ItemData.id,
        'item_photo': ItemData.image_url,
        'item_name': ItemData.name,
        'item_description': ItemData.description,
        'price': ItemData.price,
        'top_bid': ItemData.current_bid,
        'num_bidders': ItemData.num_bids,
        'days_remaining': daysRemainingInAuction,
        'seller_id': ItemData.seller_id
      })
    } else {
      notTopBidder.push(
        {
        'bid_date': bidData.updatedAt,
        'user_bid': bidData.bid_amount,
        'id': ItemData.id,
        'item_photo': ItemData.image_url,
        'item_name': ItemData.name,
        'item_description': ItemData.description,
        'price': ItemData.price,
        'current_bid': ItemData.current_bid,
        'num_bidders': ItemData.num_bids,
        'days_remaining': daysRemainingInAuction,
        'seller_id': ItemData.seller_id
      })
    }
  }

 res.json([lostAuctions, topBidder, notTopBidder])

}))

router.get('/:id/chart-data', asyncHandler(async(req,res) => {
  const userId = req.params.id
  const items = await Item.findAll({
    where: {
      seller_id: userId,
      sold: true
    }
  })

  res.json(items)
}))

router.get('/:currUserId/find-conversations', asyncHandler(async(req, res) => {
  const currUserId = req.params.currUserId

  let conversations = await Conversation.findAll({
    where: {
      [Op.or]: [
        { creator: currUserId },
        { recipient: currUserId }
      ]
    },
    include: {
      model: Message
    }
  })

  res.json(conversations)
}))

router.post('/:senderId/send-message-to-user/:recipientId', asyncHandler(async(req, res) => {
  const sender = parseInt(req.params.senderId, 10)
  const recipient = parseInt(req.params.recipientId, 10)
  const { content, recipientUsername, senderUsername } = req.body

  let previousConversation = await Conversation.findAll({
    where: {
      [Op.or]: [
        { creator: sender, recipient: recipient },
        { creator: recipient, recipient: sender }
      ]
    },
    include: {
      model: Message
    }
  })
  
  if(previousConversation.length > 0){
    let newMessage = await Message.create({
      author_id: sender,
      content,
      conversation_id: previousConversation[0].dataValues.id,
      author_username: senderUsername,
      recipient_id: recipient
    })
    res.json({'previousConversation': previousConversation, newMessage})
    return
  }

  let newConversation = await Conversation.create({
    creator: sender,
    recipient,
    creator_username: senderUsername,
    recipient_username: recipientUsername
  })
  
  let newMessage = await Message.create({
    author_id: sender,
    content,
    conversation_id: newConversation.id,
    author_username: senderUsername,
    recipient_id: recipient
  })


  res.json({'newConversation': newConversation, newMessage})
}))



module.exports = router
