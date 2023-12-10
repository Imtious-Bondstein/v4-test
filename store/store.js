import { combineReducers, configureStore } from "@reduxjs/toolkit";
import counterSlice from "./slices/counterSlice";
import authSlice from "./slices/authSlice";
import vehicleSlice from "./slices/vehicleSlice";
import speedLimitSlice from "./slices/speedLimitSlice";
// import { createWrapper } from 'next-redux-wrapper';
// import storage from 'redux-persist/lib/storage';

import { CookieStorage } from "redux-persist-cookie-storage";
import Cookie from "js-cookie";

import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistReducer,
} from "redux-persist";
import favoriteSlice from "./slices/favoriteSlice";

const reducer = combineReducers({
  // counter: counterSlice,
  auth: authSlice,
  vehicle: vehicleSlice,
  favorite: favoriteSlice,
  speedLimit: speedLimitSlice,
});

const persistConfig = {
  timeout: 2000,
  key: "root",
  storage,
  blacklist: ["vehicle", "favorite", "speedLimit"],
  // storage: new CookieStorage(Cookie)
};

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: {
    // counter: counterSlice
    reducer: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: true,
});

// export const wrapper = createWrapper(store);
