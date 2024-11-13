
// src/store/slices/categorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import $api from '../../api';

export const getCategories = createAsyncThunk(
    'categories/getCategories',
    async (searchTerm) => {
        const response = await $api.get(`/categories?search=${searchTerm}`);
        return response.data;
    }
);

const category = createSlice({
    name: 'category',
    initialState: {
        categories: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        clearCategories(state) {
            state.categories = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCategories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories = action.payload;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const {
    clearCategories
} = category.actions;

export default category.reducer;
