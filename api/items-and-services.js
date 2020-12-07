const express = require("express");
const { asyncHandler } = require('../utils');
const multer = require('multer');
const { Item, Service } = require("../db/models");
const Sequelize = require('sequelize');
const Op = Sequelize.Op

const upload = multer({dest: 'react-app/src/uploads/'});


const router = express.Router();

router.post('/search', asyncHandler(async(req, res) => {
  const {price_range, distance, offer_type, category, user_search} = req.body
  console.log(req.body)
  if(offer_type === 'Services') {
    console.log('hol up')
  }else if(offer_type === 'Purchase') {
    let filteredItems = []
    const items = await Item.findAll({
      where: {
        category,
        for_sale: true,
        name: {
          [Op.substring]: user_search
        }
      }
    })
    items.forEach(item => {
      if(price_range!== undefined) {
        if(item.price >= price_range[0] && item.price <= price_range[1]) {

          console.log('WHY AM I HERE')
          filteredItems.push(item)
        }

      } else {
        res.json(items)
      }
    })
    console.log(items)
    res.json(filteredItems)
  } else if(offer_type === 'Rent') {
    let filteredItems = []
    console.log('PRICE RANGE', price_range)
    const items = await Item.findAll({
      where: {
        category: category,
        for_rent: true,
        name: {
          [Op.substring]: user_search
        }
      }
    })
    items.forEach(item => {
      console.log(item.price)
      if(price_range!== undefined) {
        if(item.price >= price_range[0] && item.price <= price_range[1]) {

          console.log('WHY AM I HERE')
          filteredItems.push(item)
        }

      } else {
        res.json(items)
      }
    })
    console.log(items)
    res.json(filteredItems)
  } else {
    let filteredItems = []
    const items = await Item.findAll({
      where: {
        category: category,
        name: {
          [Op.substring]: user_search
        },

      }
    })
    items.forEach(item => {
      if(price_range!== undefined) {
        if(item.price >= price_range[0] && item.price <= price_range[1]) {

          console.log('WHY AM I HERE')
          filteredItems.push(item)
        }

      } else {
        res.json(items)
      }
    })
    console.log(items)
    res.json(filteredItems)
  }
}))

router.post('/post-item', upload.single('testImage'), async(req, res) =>{
  console.log(req)

  res.json(req.file)
})

module.exports = router
