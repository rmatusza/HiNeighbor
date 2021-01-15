const _ = require('lodash')
const { SET_PRICE_RANGE, SET_CATEGORY, SET_DISTANCE, SET_OFFER_TYPE, SET_ITEMS, SET_RENT_ITEMS, SET_POST_ITEM_FORM_STATUS, SET_POST_ITEM_RENT_STATUS  } = require("../actions/types")


const initialState = {
  search_params: {
    category: "Books",
    offer_type: "Purchase"
  },
  items_state: {
    saleItems: [],
    rentItems: []
  },
  post_item_form_state: {
    status: false
  },
  post_item_rent_state: {
    rentStatus: false
  }
}
const searchCategoryReducer = (state = initialState, action) => {


  const stateClone = _.cloneDeep(state)
  console.log('ACTION:', action)

  switch(action.type) {
    case SET_CATEGORY:
      let category = action.category.category
      return {
        ...state,
       search_params: {...state.search_params,  category}
      }
    case SET_PRICE_RANGE:
      let price_range = action.price_range.price_range
    return {
      ...state,
      search_params: {...state.search_params, price_range}
    }
    case SET_DISTANCE:
      let distance = action.distance.distance
    return {
      ...state,
      search_params: {...state.search_params, distance}
    }
    case SET_OFFER_TYPE:
      let offer_type = action.offer_type.offer_type
    return {
      ...state,
      search_params: {...state.search_params,  offer_type}
    }
    case SET_POST_ITEM_FORM_STATUS:
      let status = action.status
      return{
        ...state,
        post_item_form_state: {...state.post_item_form_state, status}
      }
    case SET_POST_ITEM_RENT_STATUS:
      let rentStatus = action.rentStatus
      return{
        ...state,
        post_item_rent_state: {...state.post_item_rent_state, rentStatus}
      }
    case SET_ITEMS:
      let saleItems = action.items
    return {
      ...state,
      items_state: {...state.items_state, saleItems}
    }
    case SET_RENT_ITEMS:
      let rentItems = action.rentItems
      return {
        ...state,
        items_state: {...state.items_state, rentItems}
      }
    default:
      return state;
  }
}

export default searchCategoryReducer;
