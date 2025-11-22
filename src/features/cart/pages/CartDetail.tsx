// src/features/cart/pages/CartDetail.tsx
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { formatPrice } from "@/utils/formatPrice";
import { increment, decrement, removeItem } from "@/routes/store/cartStore";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

const CartDetail = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items); // cartStore에서 items 가져오기

  // 총합 계산
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (cartItems.length === 0) return <div>장바구니가 비어 있습니다.</div>;

  return (
    <div className="flex flex-col gap-6 p-4">
      {cartItems.map((item) => (
        <div
          key={item.product.id}
          className="flex items-center justify-between border-b pb-4"
        >
          <div className="flex gap-4 items-center">
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
              onClick={() => dispatch(removeItem(item.product.id))}
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      ))}

      <div className="mt-6 text-right font-bold text-xl">
        총 합계: {formatPrice(total)}
      </div>

      <div className="mt-4 flex justify-end">
        <Button className="bg-black text-white">결제하기</Button>
      </div>
    </div>
  );
};

export default CartDetail;
