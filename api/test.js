router.post('/search', asyncHandler(async(req, res) => {
  let {price_range, distance, offer_type, category, user_search, user_id} = req.body
  //(req.body)

  if(!price_range){
    price_range = [0, 1000000000]
  }
  const bids = await Bid.findAll({
  })

  const items = await Item.findAll({
    where: {
      category,
      name: { [Op.iLike]: `%${user_search}%` },
      price: {
        [Op.between]: price_range
      },
      seller_id: {
        [Op.not]: user_id
      },
      expired: false,
      sold: false,
      offer_type
    }
  })

  

  if(offer_type === 'Services') {


    //-PURCHASE---------------------------------------------------------------
  }else if(offer_type === 'Purchase') {
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
    const expiredWithBidder = []
    const expiredWithoutBidder = []
    const notExpired = ['no_items']
    items.forEach(item => {
      if (new Date(item.expiry_date) < today && item.last_bidder !== null) {
        expiredWithBidder.push(item)
      } else if(new Date(item.expiry_date) < today && item.last_bidder === null) {
        expiredWithoutBidder.push(item.id)
      }else {
        if(notExpired[0] === 'no_items') {
          notExpired.shift()
          notExpired.push(item)
        } else {
          notExpired.push(item)
        }
      }
    })
    expiredWithBidder.forEach(async(item) => {
      await item.update({
        sold: true,
        purchaser_id: item.last_bidder,
        date_sold: item.expiryDate,
        price: item.current_bid
      })
    })
    if(expiredWithoutBidder.length > 0) {
      await Item.update({expired: true}, {
        where: {
          id: expiredWithoutBidder
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
      console.log(item)
      if(new Date(item.expiry_date) < today && item.rented === true) {
        console.log('IF')
        await item.update({rented: false, expiry_date: null})
        itemsAvaliableForRent.push(item)
      }else if(item.rented === false) {
        console.log('ELSE IF')
        itemsAvaliableForRent.push(item)
      } else {
        console.log('ELSE')
        itemsAvaliableForRent.push(item)
      }
      // itemsAvaliableForRent.push(item)
    })

    console.log('ITEMS FOR RENT:', itemsAvaliableForRent)

    if(items.length === 0) {
      res.json({'saleItems': [], 'rentItems': ['no_results'], 'bids': bids})
    } else {
      res.json({'saleItems': [], 'rentItems': itemsAvaliableForRent, 'bids': bids})
    }

  }
}))
