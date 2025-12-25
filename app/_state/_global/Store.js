"use client"

import { configureStore } from '@reduxjs/toolkit';
import cartReducer from "../_global/cart/CartSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});
