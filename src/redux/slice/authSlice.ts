import { createSlice } from "@reduxjs/toolkit";

const userData = localStorage.getItem("userInfo");

const initialState = {
  userInfo: userData ? JSON.parse(userData) : null,
  tasks: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
