import { configureStore } from '@reduxjs/toolkit';
import friendsReducer from './stateFriendsSlice';
import updateGroupReducer from './stateUpdateGroupSlice';
import updateConversationReducer from './stateUpdateConversationSlice';

export default configureStore({
  reducer: {
    isUpdateGroup: updateGroupReducer,
    isUpdateConversation: updateConversationReducer,
    friends: friendsReducer,
  }
});