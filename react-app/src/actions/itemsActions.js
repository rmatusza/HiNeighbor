import { SET_ITEMS, SET_POST_ITEM_FORM_STATUS } from './types'

export const setItems = (items) => {
  console.log('ITEMS', items)
  return {
    type: SET_ITEMS,
    items
  }
}

export const setPostItemFormStatus = (status) => {
  console.log('FORM STATUS:', status)
  return {
    type: SET_POST_ITEM_FORM_STATUS,
    status
  }
}
