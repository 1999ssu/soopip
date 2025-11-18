import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export interface AdminProduct {
  name: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  description?: string;
  isSoldOut?: boolean;
}

export const addProduct = async (product: AdminProduct) => {
  return await addDoc(collection(db, "products"), {
    ...product,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};
