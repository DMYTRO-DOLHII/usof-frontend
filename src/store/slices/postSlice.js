import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import $api from "../../api";

export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async ({ offset = 0, limit = 30, search = '' }, { rejectWithValue, dispatch }) => {
        try {
            if (offset < 0) return;
            const response = await $api.get(`/posts?offset=${offset}&limit=${limit}&search=${search}`);

            dispatch(setPosts(response.data));
            dispatch(setTotalPages(Math.ceil(response.data.pagination.totalItems / limit)));

            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const post = createSlice({
    name: "post",
    initialState: {
        posts: [],
        total: 0,
        search: '',
        totalPages: 0,
    },
    reducers: {
        setPosts(state, { payload }) {
            state.posts = payload.posts;
            state.total = payload.pagination.totalItems
        },
        setSearch(state, { payload }) {
            state.search = payload;
        },
        setTotalPages(state, { payload }) {
            state.totalPages = payload;
        }
    },
});

export const {
    setPosts,
    setSearch,
    setTotalPages
} = post.actions;

export default post.reducer;