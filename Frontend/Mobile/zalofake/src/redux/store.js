import { configureStore } from '@reduxjs/toolkit';
import stateIsGroupSlice from './stateCreateGroupSlice';

export default configureStore({
    reducer: {
      isGroup: stateIsGroupSlice.reducer,
    }
});