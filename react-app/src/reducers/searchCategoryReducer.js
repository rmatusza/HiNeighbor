const _ = require('lodash')
const { SET_PRICE_RANGE, SET_CATEGORY, SET_DISTANCE, SET_OFFER_TYPE } = require("../actions/types")


const initialState = {
  search_params: {
  }
}
const searchCategoryReducer = (state = initialState, action) => {

  console.log(action.category)
  console.log(state.search_params)
  const stateClone = _.cloneDeep(state)


  switch(action.type) {
    case SET_CATEGORY:
      let category = action.category.category
      return {
       search_params: {...state.search_params, category}
      }
    case SET_PRICE_RANGE:
      let price_range = action.price_range.price_range
    return {
      search_params: {...state.search_params, price_range}
    }
    case SET_DISTANCE:
      let distance = action.distance.distance
    return {
      // ...state,
      search_params: {...state.search_params, distance}
    }
    case SET_OFFER_TYPE:
      let offer_type = action.offer_type.offer_type
    return {
      // ...state,
      search_params: {...state.search_params, offer_type}
    }
    default:
      return state;
  }
}

export default searchCategoryReducer;
