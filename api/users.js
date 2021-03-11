const express = require("express");
const bcrypt = require("bcryptjs");
const { User, Item, Review, Rented_Item } = require("../db/models");
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
    .isEmail()
    .withMessage("A valid email address is required")
    .isLength({ max: 100 })
    .withMessage("Email address must be less than 100 characters"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("User password is required"),
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
        res.json(err)
      } else {
        const token = getUserToken(user)
        res.cookie("access_token", token, { httpOnly: false });
        res.json({ token, user: { id: user.id, userName: user.username, firstName: user.first_name, lastName: user.last_name } });
      }
    })
  }
}))

router.post('/signup', signInValidations, asyncHandler(async(req, res) => {
  // bcrypt.hashSync('password', 10),
  const {email, password} = req.body
  let maxId = await User.max('id') + 1
  const newUser = await User.create({
    id: maxId,
    
  })
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

router.get('/:id/get-seller-info', asyncHandler(async(req,res) => {
  const userId = req.params.id
  const items = await Item.findAll({
    where: {
      seller_id: userId,
      sold: false
    }
  })

  let itemsForSale = []
  let itemsForRent = []

  items.forEach(item => {
    if(item.for_sale === true) {
      itemsForSale.push(item)
    } else {
      itemsForRent.push(item)
    }
  })

  const user = await User.findByPk(userId)

  let reviewData = {}
  let ratings = 0
  let numRatings = 0
  const reviews = await Review.findAll({
    where: {
      reviewee_id: userId,
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

    reviewData['num_ratings'] = numRatings
    reviewData['average'] = ratings/numRatings
  } else {
    reviewData['num_ratings'] = numRatings
    reviewData['average'] = ratings
  }

  const soldItems = await Item.findAndCountAll({
    where: {
      seller_id: userId,
      sold: true
    }
  })

  res.json({'items': items, 'items_for_sale': itemsForSale, 'items_for_rent': itemsForRent, 'user': user, 'reviews': reviewData, 'sold': soldItems})
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

  // //('ITEMS:', items)
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
    }
  })

  itemsToUpdate.forEach(async(item) => {
    await Item.update({sold: true, purchaser_id: userId, date_sold: item.expiry_date, price: current_bid}, {
      where: {
        id: item.id
      }
    })
    await Review.create({
      reviewee_id: item.seller_id,
      item_id: item.id,
      rating: 0
    })
  })


  // //('ID ARRAY:', ids)
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

  const rented_items = await Rented_Item.findAll({
    where: {
      user_id: userId
    }
  })

  res.json({'users': users, 'reviews': reviews, 'purchased_items': items})
  // res.json(items)
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
    //('CURRENT ITEM:', item)
    if(new Date(item.return_date) < today) {
      returnedRentedItems.push(item)
      if(item.active === true){
        //('ITEM MARKED AS ACTIVE')
        returnedRentedItemsIds.push(item.item_id)
        await item.update({active: false})
        //('UPDATED ITEM:', item)
        //('ID OF ITEM TO UPDATE:', returnedRentedItemsIds)
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



module.exports = router
