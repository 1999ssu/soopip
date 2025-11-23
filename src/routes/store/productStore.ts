// src/store/productStore.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductState {
  id: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

const initialState: ProductState = {
  id: "",
  quantity: 1,
  price: 0,
  totalPrice: 0,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setPrice: (state, action: PayloadAction<number>) => {
      state.price = action.payload;
      state.totalPrice = state.quantity * state.price;
    },
    increment: (state) => {
      state.quantity += 1;
      state.totalPrice = state.quantity * state.price;
    },
    decrement: (state) => {
      if (state.quantity > 1) {
        state.quantity -= 1;
        state.totalPrice = state.quantity * state.price;
      }
    },
    resetQuantity: (state) => {
      state.quantity = 1;
      state.totalPrice = state.price;
    },
  },
});

export const { setPrice, increment, decrement, resetQuantity } =
  productSlice.actions;

export default productSlice.reducer;
