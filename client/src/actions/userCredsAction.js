import { SET_USER_CREDS, CLEAR_REDUX_STORE } from './types';

export const setUserCreds = (currentUserData) => {
  return {
    type: SET_USER_CREDS,
    currentUserData
  }
}

export const logoutUser = () => {
  return {
    type: CLEAR_REDUX_STORE,
  }
}

