import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isGroup : 0
};

const stateIsGroupSlice = createSlice({
    name: 'isGroup',
    initialState,
    reducers: {
      setIsGroup(state) {
        state.isGroup += 1
      },

      clearIsGroup(state) {
        state.isGroup = 0
      },
    }
});

export const { setIsGroup, clearIsGroup } = stateIsGroupSlice.actions;
export default stateIsGroupSlice;