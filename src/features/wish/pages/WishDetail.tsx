// src/features/wish/pages/WishDetail.tsx
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { saveCartItem } from "@/routes/store/cartStore";
import {
  toggleSelectItem,
  selectAll,
  deselectAll,
  loadUserWish,
  removeWishItem,
  deleteSelectedWishItems,
} from "@/routes/store/wishStore";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import { auth } from "@/lib/firebase";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const WishDetail = () => {
  const dispatch = useAppDispatch();

  //1.19 주석
  // const wishItems = useAppSelector((state) => state.wish.items);

  //1.19 추가
  const { items: wishItems, loading: wishLoading } = useAppSelector(
    (state) => state.wish,
  );

  // 로그인 상태일 때 위시리스트 자동 불러오기
  useEffect(() => {
    if (auth.currentUser) {
      dispatch(loadUserWish());
    }
  }, [dispatch]);
  ////////////////////////////////////////////////

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

  if (wishItems.length === 0) return <div>This wishlist is empty.</div>;

  // 선택된 전체 위시리스트 아이템 장바구니 이동 (위시리스트 유지)
  const moveAllToCart = () => {
    const selectedItems = wishItems.filter((i) => i.selected);
    selectedItems.forEach((item) => {
      dispatch(
        saveCartItem({
          product: item.product,
          quantity: item.quantity,
          selected: false,
        }),
      );
      // 위시리스트에서는 삭제하지 않음
    });
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* 상단 선택/삭제 */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="wish-products"
          className="border-solid border-[#852623] w-[18px] h-[18px]"
          checked={allSelected}
          onCheckedChange={() =>
            allSelected ? dispatch(deselectAll()) : dispatch(selectAll())
          }
        />
        <Label
          htmlFor="wish-products"
          className="text-base font-medium cursor-pointer"
        >
          Select All
        </Label>

        <Button
          className="text-base font-medium p-0"
          onClick={() => dispatch(deleteSelectedWishItems())}
        >
          Select Remove
        </Button>
        <Button onClick={moveAllToCart} className="text-base font-medium p-0">
          Add All To Cart
        </Button>
      </div>

      {/* 위시리스트 아이템 */}
      {wishItems.map((item) => (
        <div
          key={item.product.id}
          className="flex items-center justify-between border-b pb-4"
        >
          <div className="flex gap-4 items-center">
            <Checkbox
              className="border-solid border-[#852623] w-[18px] h-[18px]"
              checked={item.selected}
              onCheckedChange={() =>
                dispatch(toggleSelectItem(item.product.id))
              }
            />
            <div className="bg-white">
              <img
                src={item.product.thumbnailImageUrl}
                alt={item.product.name}
                className="w-24 h-24 object-contain"
              />
            </div>
            <div>
              <h3 className="font-bold">{item.product.name}</h3>
              <p>{formatPrice(item.product.price)}</p>
            </div>
          </div>
          <div className="flex">
            {/* 개별 장바구니 이동 버튼 */}
            <Button
              className="add-to-cart-button bg-[#852623] text-[#f5f6dc] hover:bg-[#852623]"
              onClick={() => {
                dispatch(
                  saveCartItem({
                    product: item.product,
                    quantity: 1,
                    selected: false,
                  }),
                );
              }}
            >
              ADD TO CART
            </Button>

            {/* 삭제 */}
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                onClick={() => dispatch(removeWishItem(item.product.id))}
              >
                <Trash2 strokeWidth={1.5} />
              </Button>
            </div>
          </div>
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
