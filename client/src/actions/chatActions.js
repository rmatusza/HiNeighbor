import { SET_INBOX_VISIBILITY, SET_CONVERSATIONS } from './types';

export const setInboxVisibility = (visible) => {
    return {
      type: SET_INBOX_VISIBILITY,
      visible: visible
    }
}

export const setConversations = (conversations) => {
  console.log(conversations)
  return {
    type: SET_CONVERSATIONS,
    conversations
  }
}