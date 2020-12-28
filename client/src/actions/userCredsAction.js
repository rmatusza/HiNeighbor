import { SET_USER_CREDS } from './types';

const setUserCreds = (currentUserData) => {
  return {
    type: SET_USER_CREDS,
    currentUserData
  }
}

export default setUserCreds;
