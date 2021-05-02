import { SET_INBOX_VISIBILITY } from './types';

export const setInboxVisibility = (visible) => {
  console.log(visible)
    return {
      type: SET_INBOX_VISIBILITY,
      visible: visible
    }
}