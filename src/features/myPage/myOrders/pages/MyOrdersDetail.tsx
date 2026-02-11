import { useAuth } from "@/features/auth/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  thumbnailImageUrl: string;
}
interface Order {
  id: string;
  items: OrderItem[];
  totalPrice: number;
  status: "PAID" | "PREPARING" | "SHIPPED" | "DELIVERED";
  createdAt: any;
}

const STATUS_LABEL: Record<Order["status"], string> = {
  PAID: "결제 완료",
  PREPARING: "상품 준비중",
  SHIPPED: "배송중",
  DELIVERED: "배송 완료",
};

const MyOrdersDetail = () => {
  const { user } = useAuth;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      setLoading(true);
      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        orderBy("createAt", "desc")
      );

      const snapshot = await getDocs(q);
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  if (!user) return <div>로그인 후 확인 가능합니다.</div>;
  if (loading) return <div>로딩중...</div>;
  if (orders.length === 0) return <div>주문 내역이 없습니다.</div>;
  return (
    <div>
      {orders.map((order) => (
        <div key={order.id} className="order-card border p-4 mb-4">
          <p>
            주문일: {new Date(order.createdAt.seconds * 1000).toLocaleString()}
          </p>
          <p>상태: {STATUS_LABEL[order.status]}</p>
          <div className="items mt-2">
            {order.items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 items-center mb-2"
              >
                <img
                  src={item.thumbnailImageUrl}
                  alt={item.name}
                  className="w-16 h-16 object-cover"
                />
                <div>
                  <p>{item.name}</p>
                  <p>
                    {item.quantity} x ${item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 font-bold">총액: ${order.totalPrice}</p>
        </div>
      ))}
    </div>
  );
};

export default MyOrdersDetail;
