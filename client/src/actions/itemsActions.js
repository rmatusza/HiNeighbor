import { SET_ITEMS, SET_POST_ITEM_FORM_STATUS, SET_POST_ITEM_RENT_STATUS, SET_RENT_ITEMS } from './types'

export const setItems = (items) => {
  console.log('ITEMS', items)
  return {
    type: SET_ITEMS,
    items
  }
}

export const setRentItems = (rentItems) => {
  console.log('ITEMS',rentItems)
  return {
    type: SET_RENT_ITEMS,
   rentItems
  }
}

export const setPostItemFormStatus = (status) => {
  console.log('FORM STATUS:', status)
  return {
    type: SET_POST_ITEM_FORM_STATUS,
    status
  }
}

export const setPostItemRentStatus = (rentStatus) => {
  return {
    type: SET_POST_ITEM_RENT_STATUS,
    rentStatus
  }
}
