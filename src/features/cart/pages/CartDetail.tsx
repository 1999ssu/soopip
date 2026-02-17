// src/features/cart/pages/CartDetail.tsx
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { formatPrice } from "@/utils/formatPrice";
import {
  increment,
  decrement,
  removeItem,
  deselectAll,
  selectAll,
  deleteSelected,
  toggleSelectItem,
  loadUserCart,
  removeCartItem,
  deleteSelectedCartItems,
} from "@/routes/store/cartStore";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";

const CartDetail = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  // // 로그인 상태일 때 카트 자동 불러오기
  // useEffect(() => {
  //   if (auth.currentUser) {
  //     dispatch(loadUserCart());
  //   }
  // }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(deselectAll()); // 페이지 벗어나면 전체 선택 해제
    };
  }, [dispatch]);

  const totalSelectedPrice = cartItems
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const allSelected =
    cartItems.length > 0 && cartItems.every((item) => item.selected);

  const handleCheckout = () => {
    const selectedItems = cartItems
      .filter((item) => item.selected)
      .map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: Math.floor(item.product.price * 100), // 센트 단위
        quantity: item.quantity,
        imageUrl: item.product.thumbnailImageUrl,
      }));

    if (selectedItems.length === 0) {
      return alert("선택된 상품이 없습니다.");
    }
    setLoadingCheckout(true);
    // Checkout 페이지로 이동, items state 전달
    navigate("/checkout", { state: { items: selectedItems } });
  };

  if (cartItems.length === 0) return <div>장바구니가 비어 있습니다.</div>;

  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <input
          type="checkbox"
          checked={allSelected}
          onChange={() =>
            allSelected ? dispatch(deselectAll()) : dispatch(selectAll())
          }
        />
        Select All
        <button onClick={() => dispatch(deleteSelectedCartItems())}>
          Delete Selected
        </button>
      </div>

      {cartItems.map((item) => (
        <div
          key={item.product.id}
          className="flex items-center justify-between border-b pb-4"
        >
          <div className="flex gap-4 items-center">
            <input
              type="checkbox"
              checked={item.selected}
              onChange={() => dispatch(toggleSelectItem(item.product.id))}
            />
            <img
              src={item.product.thumbnailImageUrl}
              alt={item.product.name}
              className="w-24 h-24 object-cover"
            />
            <div>
              <h3 className="font-bold">{item.product.name}</h3>
              <p>{formatPrice(item.product.price)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => dispatch(decrement(item.product.id))}
              disabled={item.quantity === 1}
            >
              <Minus />
            </Button>
            <span>{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => dispatch(increment(item.product.id))}
            >
              <Plus />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => dispatch(removeCartItem(item.product.id))}
            >
              <Trash2 strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      ))}

      <div className="mt-6 flex justify-end items-center gap-4">
        <span className="font-semibold text-lg">Total:</span>
        <span className="font-bold text-xl">
          {formatPrice(totalSelectedPrice)}
        </span>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          onClick={handleCheckout}
          disabled={loadingCheckout}
          className="bg-black text-white"
        >
          {loadingCheckout ? "결제 중..." : "결제하기"}
        </Button>
      </div>
    </div>
  );
};

export default CartDetail;
