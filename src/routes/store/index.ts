// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productStore";
import cartReducer from "./cartStore";
import wishReducer from "./wishStore";
export const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer,
    wish: wishReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
