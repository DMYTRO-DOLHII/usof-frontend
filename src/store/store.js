import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import loggerMiddleware from "redux-logger";

import post from "./slices/postSlice";
import user from "./slices/userSlice";

const combinedReducer = combineReducers({
    post: post,
    user: user
});
const persistConfig = {
    key: "manag",
    storage,
    blacklist: ["data"],
};
const persistedReducer = persistReducer(persistConfig, combinedReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        })
    .concat(loggerMiddleware),
});

export const persistor = persistStore(store);
export default store;