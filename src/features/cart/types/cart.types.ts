import { type Product as OriginalProduct } from "@/features/product/types/product.types";

// Cart용 Product 타입
export interface CartProduct extends OriginalProduct {
  thumbnailImageUrl: string; // 장바구니에서 필요한 필드 추가
}

export interface CartItem {
  product: CartProduct; // CartProduct 사용
  quantity: number;
}
