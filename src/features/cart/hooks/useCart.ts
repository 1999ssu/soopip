import { useState } from "react";
import { getCart, addToCart } from "../api/cart.api";
import { type CartItem } from "@/features/cart/types/cart.types";

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>(getCart());

  const addItem = (item: CartItem) => {
    addToCart(item);
    setItems(getCart());
  };

  return { items, addItem };
};
