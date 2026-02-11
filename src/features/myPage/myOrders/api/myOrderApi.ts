import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function createOrder(
  userId: string,
  cartItems: any[],
  totalPrice: number,
  shippingAddress: string[]
) {
  const orderData = {
    userId,
    items: cartItems.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      thumbnailImageUrl: item.product.thumbnailImageUrl,
    })),
    shippingAddress,
    totalPrice,
    status: "PAID",
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "orders"), orderData);
  return docRef.id;
}
