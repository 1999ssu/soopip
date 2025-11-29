// src/features/wish/pages/WishDetail.tsx
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { addItem as addCartItem } from "@/routes/store/cartStore";
import {
  increment,
  decrement,
  removeItem,
  toggleSelectItem,
  selectAll,
  deselectAll,
  deleteSelected,
} from "@/routes/store/wishStore";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";

const WishDetail = () => {
  const dispatch = useAppDispatch();
  const wishItems = useAppSelector((state) => state.wish.items);

  useEffect(() => {
    return () => {
      dispatch(deselectAll()); // 페이지 벗어나면 전체 선택 해제
    };
  }, [dispatch]);

  const totalSelectedPrice = wishItems
    .filter((item) => item.selected)
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const allSelected =
    wishItems.length > 0 && wishItems.every((item) => item.selected);

  if (wishItems.length === 0) return <div>위시리스트가 비어 있습니다.</div>;

  // 선택된 전체 위시리스트 아이템 장바구니 이동 (위시리스트 유지)
  const moveAllToCart = () => {
    const selectedItems = wishItems.filter((i) => i.selected);
    selectedItems.forEach((item) => {
      dispatch(
        addCartItem({
          product: item.product,
          quantity: item.quantity,
          selected: false,
        })
      );
      // 위시리스트에서는 삭제하지 않음
    });
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* 상단 선택/삭제 */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={() =>
            allSelected ? dispatch(deselectAll()) : dispatch(selectAll())
          }
        />
        Select All
        <button onClick={() => dispatch(deleteSelected())}>
          Delete Selected
        </button>
        <Button onClick={moveAllToCart} className="ml-4">
          선택 상품 전체 장바구니 이동
        </Button>
      </div>

      {/* 위시리스트 아이템 */}
      {wishItems.map((item) => (
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

          {/* 수량 및 삭제 */}
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

          {/* 개별 장바구니 이동 버튼 */}
          <Button
            className="add-to-cart-button"
            onClick={() =>
              dispatch(
                addCartItem({
                  product: item.product,
                  quantity: item.quantity,
                  selected: false,
                })
              )
            }
          >
            장바구니에 담기
          </Button>
        </div>
      ))}

      {/* 선택 총액 */}
      <div className="mt-6 flex justify-end items-center gap-4">
        <span className="font-semibold text-lg">Total:</span>
        <span className="font-bold text-xl">
          {formatPrice(totalSelectedPrice)}
        </span>
      </div>
    </div>
  );
};

export default WishDetail;
