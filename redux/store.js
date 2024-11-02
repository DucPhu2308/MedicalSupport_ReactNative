import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./slices/notificationSlice";
const store = configureStore({
    reducer: {
        notification: notificationReducer,
    },
});

export default store;