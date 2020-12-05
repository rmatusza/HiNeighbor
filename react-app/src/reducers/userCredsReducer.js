import { SET_USER_CREDS } from '../actions/types';
import setUserCreds from '../actions/userCredsAction';

const initialState = {
  session: {
    // currentUserId: '',
    // currentUsername: '',
    // currentUserFirstName: '',
    // currentUserLastName: ''
  }
}

const setUserCredsReducer = (state = initialState, action) => {

  switch(action.type) {
    case SET_USER_CREDS:
      return {
        ...state,
        session: action.currentUserData
      }
    default:
      return state;
  }
}

export default setUserCredsReducer;
