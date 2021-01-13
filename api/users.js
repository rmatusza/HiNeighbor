const express = require("express");
const bcrypt = require("bcryptjs");
const { User, Item, Review, Rented_Item } = require("../db/models");
const { asyncHandler } = require('../utils');
const { check } = require("express-validator");
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

// const verifyUser = (req, res, next) => {
//   const token = req.body.access_token
//   if(!token) return res.sendStatus(401)

//   jwt.verify(token, secret, (err, jwtPayload) => {
//     if(err) return res.sendStatus(403)

//     req.user = jwtPayload
//     next()
//   })

// }
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
  const items = await Item.findAll({
    where:{
      seller_id: userId,
      sold: false
    }
  })

  res.json(items)
}))

router.get('/:id/get-seller-info', asyncHandler(async(req,res) => {
  const userId = req.params.id
  const items = await Item.findAll({
    where: {
      seller_id: userId,
      sold: false
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

  res.json({'items': items, 'user': user, 'reviews': reviewData, 'sold': soldItems})
}))

router.get('/:id/get-purchase-history', asyncHandler(async(req,res) => {
  const userId = req.params.id
  const items = await Item.findAll({
    where:{
      purchaser_id: userId,
      sold: true,

    },
    order: [['id', 'ASC']]

  })

  // console.log('ITEMS:', items)
  let ids = []
  let itemIds = []
  let purchasedItems = []
  let rentItems = []
  let userobj = {}
  items.forEach(item => {
    ids.push(item.seller_id)
    itemIds.push(item.id)
  })

  // console.log('ID ARRAY:', ids)
  const users = await User.findAll({
    where: {
      id: ids,
    },
  })

  const reviews = await Review.findAll({
    where: {
      item_id: itemIds
    },
    order: [['id', 'ASC']]
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
  console.log(year)
  console.log(day)
  console.log(month)
  const today = new Date(month+'-'+day+'-'+year)

  const returnedRentedItems = []
  const currentRentedItems = []

  rentedItems.forEach(item => {
    if(item.return_date - today <= 0) {
      returnedRentedItems.push(item)
    } else {
      currentRentedItems.push(item)
    }
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
