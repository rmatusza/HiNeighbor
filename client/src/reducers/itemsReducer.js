import { SET_USER_CREDS } from '../actions/types';
import setUserCreds from '../actions/userCredsAction';

const initialState = {
  

}

const setUserCredsReducer = (state = initialState, action) => {
  const currentUser = action.currentUserData
  switch(action.type) {
    case SET_USER_CREDS:
      return {
        ...state,
        currentUser
      }
    default:
      return state;
  }
}

export default setUserCredsReducer;
