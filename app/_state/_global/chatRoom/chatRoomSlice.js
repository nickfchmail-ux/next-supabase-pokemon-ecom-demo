import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  anonymousUser: 0,
  loggedInUser: 0,
};

const chatRoomSlice = createSlice({
  name: 'chatRoom',
  initialState, // <-- you forgot to include this
  reducers: {
    setAnonymousUserAction(state, action) {
      console.log('check payload: ', action.payload);
      state.anonymousUser = action.payload;
    },

    setLoggedInUserAction(state, action) {
      console.log('check payload: ', action.payload);
      state.loggedInUser = action.payload;
    },
  },
});

export const { setAnonymousUserAction, setLoggedInUserAction } = chatRoomSlice.actions;
export default chatRoomSlice.reducer;
