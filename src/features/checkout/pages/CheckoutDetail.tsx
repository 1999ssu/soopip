import { useState } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number; // 센트 단위
  quantity: number;
  imageUrl: string;
}

interface CheckoutFormProps {
  items: CartItem[];
}

const CheckoutDetail = ({ items }: CheckoutFormProps) => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (!userInfo.name || !userInfo.email || !userInfo.address) {
      return alert("이름, 이메일, 주소는 필수입니다.");
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://us-central1-soopip.cloudfunctions.net/createCheckoutSession",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, userInfo }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "결제 세션 생성 실패");
      }

      const data = await res.json();
      if (!data.url) throw new Error("결제 URL이 존재하지 않습니다.");

      // Stripe 결제 페이지로 이동
      window.location.href = data.url;
    } catch (err: any) {
      alert(err.message || "결제 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto">
      <input
        name="name"
        placeholder="Full Name"
        value={userInfo.name}
        onChange={handleChange}
        className="border p-2"
      />
      <input
        name="email"
        placeholder="Email"
        value={userInfo.email}
        onChange={handleChange}
        className="border p-2"
      />
      <input
        name="phone"
        placeholder="Phone"
        value={userInfo.phone}
        onChange={handleChange}
        className="border p-2"
      />
      <input
        name="address"
        placeholder="Address"
        value={userInfo.address}
        onChange={handleChange}
        className="border p-2"
      />

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="bg-black text-white p-2 mt-2"
      >
        {loading ? "처리중..." : "결제 진행"}
      </button>

      <div className="mt-4">
        <h3 className="font-bold">Order Summary</h3>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between">
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>${((item.price * item.quantity) / 100).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutDetail;
