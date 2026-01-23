export interface Product {
  id: string;
  name: string;
  price: number; // 센트로 저장
  stock: number;
  category: string;
  thumbnailImageUrl: string; // 대표 이미지
  detailImagesUrl?: string[]; //상세페이지에서 쓸 이미지
  description?: string;
  createdBy: string;
  createdAt: any;
  updatedAt: any;
}
