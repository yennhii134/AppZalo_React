import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isUpdateGroup: {
    value: 0,
    place: ''
  }
};

const stateUpdateGroupSlice = createSlice({
  name: 'isUpdateGroup',
  initialState,
  reducers: {
    setIsUpdateGroup(state, action) {
      state.isUpdateGroup.value += 1
      state.isUpdateGroup.place = action.payload.place;
    },

    clearIsUpdateGroup(state) {
      state.isUpdateGroup = 0
      state.isUpdateGroup.place = ''
    },
  }
});

export const { setIsUpdateGroup, clearIsUpdateGroup } = stateUpdateGroupSlice.actions;
export const selectIsUpdateGroup = (state) => state.isUpdateGroup.isUpdateGroup
export default stateUpdateGroupSlice.reducer;