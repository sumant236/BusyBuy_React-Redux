import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../reducers/authReducer";
import { productsReducer } from "../reducers/productsReducer";
import { cartReducer } from "../reducers/cartReducer";
// Import your reducer and use them accordingly
// Note that you have to name the auth ,product and cart only.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
  },
});
