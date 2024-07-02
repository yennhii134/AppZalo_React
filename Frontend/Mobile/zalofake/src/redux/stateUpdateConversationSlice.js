import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isUpdateConversation: 0
};

const stateUpdateConversationSlice = createSlice({
  name: 'isUpdateConversation',
  initialState,
  reducers: {
    setIsUpdateConversation(state) {
      state.isUpdateConversation += 1
    },

    clearIsUpdateConversation(state) {
      state.isUpdateConversation = 0
    },
  }
});

export const { setIsUpdateConversation, clearIsUpdateConversation } = stateUpdateConversationSlice.actions;
export const selectIsUpdateConversation = (state) => state.isUpdateConversation.isUpdateConversation;

export default stateUpdateConversationSlice.reducer;