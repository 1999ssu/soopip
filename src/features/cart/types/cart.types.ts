import { type Product } from "@/features/product/types/product.types";

export interface CartItem {
  product: Product;
  quantity: number;
}
