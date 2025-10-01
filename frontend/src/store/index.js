import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import friendReducer from "./friendSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    friend: friendReducer,
  }
});

export default store;
