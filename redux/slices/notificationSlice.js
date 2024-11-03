import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NotificationAPI } from "../../API/NotificationAPI";

export const fetchNotifications = createAsyncThunk(
    "notification/fetchNotifications",
    async (_, thunkAPI) => {
        const state = thunkAPI.getState();
        if (state.notification.loading) {
            return;
        }
        state.notification.loading = true;
        const response = await NotificationAPI.getNotifications();
        state.notification.loading = false;
        return response.data;
    }
);

export const markAsRead = createAsyncThunk(
    "notification/markAsRead",
    async (notificationIds) => {
        const response = await NotificationAPI.markAsRead(notificationIds);
        return response.data;
    }
);

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: [],
        unreadCount: 0,
        loading: false,
    },
    extraReducers: (builder) => {
        builder.addCase(fetchNotifications.fulfilled, (state, action) => {
            state.notifications = action.payload;
            state.unreadCount = action.payload.filter((notification) => notification.isRead === false).length;
        });
        builder.addCase(markAsRead.fulfilled, (state, action) => {
            state.notifications = action.payload;
            state.unreadCount = action.payload.filter((notification) => notification.isRead === false).length;
        });
    }
});

export default notificationSlice.reducer;
