// src/features/checkout/pages/Success.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface OrderData {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_address?: string;
  order_items: OrderItem[];
  total_amount: number;
  currency: string;
  created_at: any;
}

const Success = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get("email"); // Stripe metadata에서 전달한 이메일

  useEffect(() => {
    const fetchOrders = async () => {
      if (!emailParam) {
        setLoading(false);
        return;
      }

      try {
        const ordersRef = collection(db, "orders");
        const q = query(
          ordersRef,
          where("customer_email", "==", emailParam),
          orderBy("created_at", "desc"),
          limit(5) // 최근 5개만 가져오기
        );
        const snapshot = await getDocs(q);
        const fetchedOrders: OrderData[] = snapshot.docs.map(
          (doc) => doc.data() as OrderData
        );
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [emailParam]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!orders.length)
    return <div className="text-center mt-10">주문 내역이 없습니다.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">결제 완료</h1>
      {orders.map((order, idx) => (
        <div key={idx} className="border rounded p-4 mb-4 shadow">
          <h2 className="font-semibold mb-2">주문자: {order.customer_name}</h2>
          <p>Email: {order.customer_email}</p>
          {order.customer_phone && <p>Phone: {order.customer_phone}</p>}
          {order.customer_address && <p>Address: {order.customer_address}</p>}
          <div className="mt-2">
            <h3 className="font-semibold">주문 상품:</h3>
            {order.order_items.map((item) => (
              <div key={item.id} className="flex justify-between border-b py-1">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>${((item.price * item.quantity) / 100).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 font-bold">
            총 결제금액: ${(order.total_amount / 100).toFixed(2)}{" "}
            {order.currency.toUpperCase()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Success;
