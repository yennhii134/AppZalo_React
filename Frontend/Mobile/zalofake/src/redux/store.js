import { configureStore } from '@reduxjs/toolkit';
import stateIsGroupSlice from './stateCreateGroupSlice';
import friendsReducer from './stateFriendsSlice';
import groupsReducer from './stateGroupsSlice';
import isFriendReducer from './stateFriendsSlice'
export default configureStore({
    reducer: {
      isGroup: stateIsGroupSlice.reducer,
      friends: friendsReducer,
      groups: groupsReducer,

      
    }
});