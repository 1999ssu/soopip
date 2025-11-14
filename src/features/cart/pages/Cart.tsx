// import React from "react";
import { useCart } from "../hooks/useCart";

const Cart = () => {
  const { items } = useCart();

  if (!items.length) return <p>장바구니가 비어있습니다.</p>;

  return (
    <div>
      <h1>장바구니</h1>
      <ul>
        {items.map((item, idx) => (
          <li key={idx}>
            {item.product.name} x {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cart;
