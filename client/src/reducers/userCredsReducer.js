import { CLEAR_REDUX_STORE, SET_USER_CREDS } from '../actions/types';

const initialState = {
  currentUser: {id: null, username: null, firstName: null, lastName: null}
}

const setUserCredsReducer = (state = initialState, action) => {
  switch(action.type) {
    case SET_USER_CREDS:
      const currentUser = action.currentUserData
      return {
        ...state,
        currentUser
      }
    case CLEAR_REDUX_STORE:
      const nullUserData = action.currentUserData
      return{
        currentUser: nullUserData
      }
    default:
      return state;
  }
}

export default setUserCredsReducer;
