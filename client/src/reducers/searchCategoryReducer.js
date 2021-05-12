const { 
  SET_PRICE_RANGE, 
  SET_CATEGORY, 
  SET_DISTANCE, 
  SET_OFFER_TYPE, 
  SET_ITEMS, 
  SET_RENT_ITEMS, 
  SET_POST_ITEM_FORM_STATUS, 
  SET_POST_ITEM_RENT_STATUS, 
  CLEAR_SEARCH_PARAMS, 
  SET_SELLER_PROFILE_ITEMS_FOR_SALE,
  SET_BID_HISTORY,
  SET_INBOX_VISIBILITY,
  SET_CONVERSATIONS
} = require("../actions/types")


const initialState = {
  search_params: {
    category: "Books",
    offer_type: "Purchase"
  },
  items_state: {
    saleItems: [],
    rentItems: []
  },
  seller_profile: {
    saleItems: [],
    rentItems: []
  },
  bid_history: {
    otherBids: [],
    topBidder: []
  },
  post_item_form_state: {
    status: false
  },
  post_item_rent_state: {
    rentStatus: false
  },
  inbox_visibility:{
    visible: false
  },
  conversations: []
}
const searchCategoryReducer = (state = initialState, action) => {

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
      // items_state: {saleItems, rentItems: []}
    }
    case SET_SELLER_PROFILE_ITEMS_FOR_SALE:
      let sellerProfileSaleItems = action.items
    return {
      ...state,
      seller_profile: {saleItems: sellerProfileSaleItems, rentItems: []}
    }
    case SET_BID_HISTORY:
      let notTopBidderItems = action.items[0]
      let topBidderItems = action.items[1]
    return {
      ...state,
      bid_history: {otherBids: notTopBidderItems, topBidder: topBidderItems}
    }
    case SET_RENT_ITEMS:
      let rentItems = action.rentItems
      return {
        ...state,
        items_state: {...state.items_state, rentItems}
      }
    case CLEAR_SEARCH_PARAMS:
      return {
        ...state,
        search_params: {category: 'Books', offer_type: 'Purchase'},
        items_state: {saleItems: [], rentItems: []}
      }
    case SET_INBOX_VISIBILITY:
      let visibilityStatus = action.visible
      return {
        ...state,
       inbox_visibility: {visible: visibilityStatus}
      }
    case SET_CONVERSATIONS:
      let conversations = action.conversations
      return{
        ...state,
        conversations
      }
    default:
      return state;
  }
}

export default searchCategoryReducer;
