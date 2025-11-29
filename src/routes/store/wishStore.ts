// src/routes/store/wishStore.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/features/product/types/product.types";
import { CartItem } from "@/features/cart/types/cart.types"; // CartItem과 동일 구조 사용

const storedWish = localStorage.getItem("wish");
const initialState: { items: CartItem[] } = {
  items: storedWish ? JSON.parse(storedWish) : [],
};
const wishSlice = createSlice({
  name: "wish",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const quantity = 1; // 기본 수량

      state.items = state.items.filter((i) => i.product.id !== product.id);
      state.items.push({ product, quantity, selected: false });

      localStorage.setItem("wish", JSON.stringify(state.items));
    },
    increment: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.product.id === action.payload);
      if (item) item.quantity += 1;
      localStorage.setItem("wish", JSON.stringify(state.items));
    },
    decrement: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.product.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
      localStorage.setItem("wish", JSON.stringify(state.items));
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.product.id !== action.payload);
      localStorage.setItem("wish", JSON.stringify(state.items));
    },
    toggleSelectItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.product.id === action.payload);
      if (item) item.selected = !item.selected;
      localStorage.setItem("wish", JSON.stringify(state.items));
    },
    selectAll: (state) => {
      state.items.forEach((i) => (i.selected = true));
      localStorage.setItem("wish", JSON.stringify(state.items));
    },
    deselectAll: (state) => {
      state.items.forEach((i) => (i.selected = false));
      localStorage.setItem("wish", JSON.stringify(state.items));
    },
    deleteSelected: (state) => {
      state.items = state.items.filter((i) => !i.selected);
      localStorage.setItem("wish", JSON.stringify(state.items));
    },
    clearWish: (state) => {
      state.items = [];
      localStorage.removeItem("wish");
    },
  },
});

export const {
  addItem,
  increment,
  decrement,
  removeItem,
  toggleSelectItem,
  selectAll,
  deselectAll,
  deleteSelected,
  clearWish,
} = wishSlice.actions;

export default wishSlice.reducer;
