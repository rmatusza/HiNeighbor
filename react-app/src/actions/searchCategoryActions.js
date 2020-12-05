import { SET_CATEGORY, SET_PRICE_RANGE, SET_DISTANCE, SET_OFFER_TYPE } from './types'


export const setCategory = (category) => {
  return {
    type: SET_CATEGORY,
    category
  }
}

export const setPriceRange = (priceRange) => {
  return {
    type: SET_PRICE_RANGE,
    priceRange
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
