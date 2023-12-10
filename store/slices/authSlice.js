import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  phone: null,
  pre_route: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_PHONE: (state, action) => {
      state.phone = action.payload.phone;
    },
    SIGNIN: (state, action) => {
      console.log(action.payload);
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },

    SIGNOUT: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.phone = null;
      state.pre_route = null;
    },

    UPDATE_USER: (state, action) => {
      console.log(" update user :", action.payload);
      state.user["first_name"] = action.payload.first_name;
      state.user["last_name"] = action.payload.last_name;
      state.user["middle_name"] = action.payload.middle_name;
      state.user["image"] = action.payload.image;
    },

    ROUTE_CHANGE: (state, action) => {
      state.pre_route = action.payload;
    },
    UPDATE_USER_NEW: (state, action) => {
      const { is_first_login } = action.payload;
      state.user = state.user || {};
      state.user = {
        ...state.user,
        is_first_login,
      };
    },
  },
});

export const {
  SIGNIN,
  SIGNOUT,
  SET_PHONE,
  UPDATE_USER,
  ROUTE_CHANGE,
  UPDATE_USER_NEW,
} = authSlice.actions;

export default authSlice.reducer;
