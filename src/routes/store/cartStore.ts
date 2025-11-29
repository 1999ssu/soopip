// src/routes/store/cartStore.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/features/cart/types/cart.types";
import { RootState } from "./index";

// localStorage에서 초기값 불러오기
const storedCart = localStorage.getItem("cart");
const initialState: { items: CartItem[] } = {
  items: storedCart ? JSON.parse(storedCart) : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      // 중복 체크: 기존에 있으면 quantity 증가
      const existing = state.items.find(
        (i) => i.product.id === action.payload.product.id
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    increment: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.product.id === action.payload);
      if (item) item.quantity += 1;
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    decrement: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.product.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.product.id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    toggleSelectItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.product.id === action.payload);
      if (item) item.selected = !item.selected;
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    selectAll: (state) => {
      state.items.forEach((i) => (i.selected = true));
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    deselectAll: (state) => {
      state.items.forEach((i) => (i.selected = false));
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    deleteSelected: (state) => {
      state.items = state.items.filter((i) => !i.selected);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
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
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;

//장바구니 뱃지 갯수 add
export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
