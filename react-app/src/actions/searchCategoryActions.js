import { SET_CATEGORY, SET_PRICE_RANGE, SET_DISTANCE, SET_OFFER_TYPE } from './types'


export const setCategory = (category) => {
  console.log('WHAT', category)
  return {
    type: SET_CATEGORY,
    category
  }
}

export const setPriceRange = (price_range) => {
  console.log('here')
  return {
    type: SET_PRICE_RANGE,
    price_range
  }
}

export const setDistance = (distance) => {
  return {
    type: SET_DISTANCE,
    distance
  }
}

export const setOfferType = (offerType) => {
  return {
    type: SET_OFFER_TYPE,
    offerType
  }
}
