import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "./loaderSlice";
import cartReducer from './cartSlice'

const store = configureStore({
  reducer: {
    loader: loaderReducer,
    cart: cartReducer
  },
});

export default store;
