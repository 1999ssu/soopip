export interface Product {
  id?: string;
  name: string;
  price: number; // 센트로 저장
  stock: number;
  category: string;
  description?: string;
  imageUrl: string;
  createdBy: string;
  createdAt: any;
  updatedAt: any;
}
