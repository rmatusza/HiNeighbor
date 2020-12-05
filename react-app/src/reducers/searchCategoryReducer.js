const { SET_PRICE_RANGE, SET_CATEGORY, SET_DISTANCE, SET_OFFER_TYPE } = require("../actions/types")

const initialState = {


  search_params: {


  }
}
const searchCategoryReducer = (state = initialState, action) => {

  switch(action.type) {
    case SET_CATEGORY:
    return {
      ...state,
      search_params: action.search_param
    }
    case SET_PRICE_RANGE:
    return {
      ...state,
      search_params: action.search_param
    }
    case SET_DISTANCE:
    return {
      ...state,
      search_params: action.search_param
    }
    case SET_OFFER_TYPE:
    return {
      ...state,
      search_params: action.search_param
    }
    default:
      return state;
  }
}

export default searchCategoryReducer;
