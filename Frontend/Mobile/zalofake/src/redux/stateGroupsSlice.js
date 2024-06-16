import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

export const fetchGroups = createAsyncThunk(
    'groups/fetchGroups',
    async () => {
        const response = await axiosInstance.get("/groups/all");
        return response.data;
    }
)
const initialState = {
    data: [],
    status: 'idle',
    error: null,
};
const groupsSlice = createSlice({
    name: 'groups',
    initialState,
    reducers:{

    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchGroups.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchGroups.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.data = action.payload
        })
        .addCase(fetchGroups.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        });
    },
})
export const {} = groupsSlice.actions;

export const selectGroups = (state) => state.groups.data;

export default groupsSlice.reducer;