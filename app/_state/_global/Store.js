"use client"

import { configureStore } from '@reduxjs/toolkit';
import cartReducer from "../_global/cart/CartSlice";
import chatRoomReducer from '../_global/chatRoom/chatRoomSlice';
import scrollingDirection from '../_global/scrollingDirection/ScrollingDirectionSlice';
import userReducer from '../_global/user/userSlice';
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    scrollingDirection: scrollingDirection,
    user: userReducer,
    chatRoom: chatRoomReducer,
  },
});
