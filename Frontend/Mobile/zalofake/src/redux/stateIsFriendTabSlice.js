import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isFriendTabActive: true,
};

const stateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    setFriendTabActive: (state, action) => {
      state.isFriendTabActive = action.payload;
    },
  },
});

export const { setFriendTabActive } = stateSlice.actions;
export default stateSlice.reducer;