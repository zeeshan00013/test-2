import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  token: localStorage.getItem("token") || null,
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      toast.success("Login successful!");
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      toast.info("Logged out successfully!");
    },
    setError: (state, action) => {
      state.error = action.payload;
      toast.error(state.error || "An error occurred!");
    },
  },
});

export const { loginSuccess, logout, setError } = authSlice.actions;

export default authSlice.reducer;
