import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import $api from "../../api";

export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async ({ offset = 0, limit = 30, search = '', order = 'rating' }, { rejectWithValue, dispatch }) => {
        try {
            if (offset < 0) return;
            const response = await $api.get(`/users?offset=${offset}&limit=${limit}&search=${search}&order=${order}`);

            dispatch(setUsers(response.data));
            dispatch(setTotalPages(Math.ceil(response.data.pagination.totalUsers / limit)));

            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const user = createSlice({
    name: "user",
    initialState: {
        users: [],
        total: 0,
        search: '',
        totalPages: 0,
    },
    reducers: {
        setUsers(state, { payload }) {
            state.users = payload.users;
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
    setUsers,
    setSearch,
    setTotalPages
} = user.actions;

export default user.reducer;