import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

export const fetchFriends = createAsyncThunk(
    'friends/fetchFriends',
    async () => {
        const response = await axiosInstance.get("/users/get/friends");
        return response.data.friends;
    }
)
const initialState = {
    data: [],
    status: 'idle',
    error: null,
};

const friendsSlice = createSlice({
    name: 'friends',
    initialState,
    reducers: {
        addFriend: (state, action) => {
            state.data.push(action.payload);
        },
        deleteFriend: (state, action) => {
            const friendId = action.payload;
            state.data = state.data.filter(friend => friend.userId !== friendId);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFriends.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFriends.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchFriends.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { addFriend, deleteFriend } = friendsSlice.actions;

export const selectFriends = (state) => state.friends.data;

export default friendsSlice.reducer;