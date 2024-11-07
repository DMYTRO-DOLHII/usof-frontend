import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async ({ offset = 0, limit = 30, search = '' }, { rejectWithValue, dispatch }) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/posts?offset=${offset}&limit=${limit}&search=${search}`);
            const data = await response.json();

            dispatch(setPosts(data));

            return response.status;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const post = createSlice({
    name: "post",
    initialState: {
        posts: [],
        total: 0
    },
    reducers: {
        setPosts(state, { payload }) {
            state.posts = payload.posts;
            state.total = payload.pagination.totalItems
        },
    },
});

export const {
    setPosts,
} = post.actions;

export default post.reducer;