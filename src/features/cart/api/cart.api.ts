import { type CartItem } from "@/features/cart/types/cart.types";

const cart: CartItem[] = []; // 임시 저장용

export const addToCart = (item: CartItem) => {
  cart.push(item);
};

export const getCart = (): CartItem[] => cart;
