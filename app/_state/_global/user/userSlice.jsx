'use client';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  chatRoomId: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setChatRoomId(state, action) {
      if (typeof action.payload === 'number') {
        state.chatRoomId = action.payload;
      }
    },
  },
});

export const { setUser, setChatRoomId } = userSlice.actions;
export default userSlice.reducer;
