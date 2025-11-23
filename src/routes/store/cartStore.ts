// src/routes/store/cartStore.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/features/product/types/product.types";
import { CartItem } from "@/features/cart/types/cart.types";

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (
      state,
      action: PayloadAction<{ product: Product; quantity: number }>
    ) => {
      const { product, quantity } = action.payload;

      // 기존 동일 상품 제거 후 새로 담기 (갱신)
      state.items = state.items.filter(
        (item) => item.product.id !== product.id
      );
      state.items.push({ product, quantity, selected: true });
    },
    increment: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.product.id === action.payload);
      if (item) item.quantity += 1;
    },
    decrement: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.product.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.product.id !== action.payload);
    },
    toggleSelectItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.product.id === action.payload);
      if (item) item.selected = !item.selected;
    },
    selectAll: (state) => {
      state.items.forEach((i) => (i.selected = true));
    },
    deselectAll: (state) => {
      state.items.forEach((i) => (i.selected = false));
    },
    deleteSelected: (state) => {
      state.items = state.items.filter((i) => !i.selected);
    },
    clearCart: (state) => {
      state.items = [];
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
