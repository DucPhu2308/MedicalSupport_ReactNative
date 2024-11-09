import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./slices/notificationSlice";
import chatReducer from "./slices/chatSlice";

const store = configureStore({
    reducer: {
        notification: notificationReducer,
        chat: chatReducer,
    },
});

export default store;