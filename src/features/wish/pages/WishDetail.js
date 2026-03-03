import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/features/wish/pages/WishDetail.tsx
import { useEffect } from "react";
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
  const { items: wishItems, loading: wishLoading } = useAppSelector(
    (state) => state.wish,
  );
  // 로그인 상태일 때 위시리스트 자동 불러오기
  useEffect(() => {
    if (auth.currentUser) {
      dispatch(loadUserWish());
    }
  }, [dispatch]);
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
  if (wishItems.length === 0)
    return _jsx("div", { children: "This wishlist is empty." });
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
  return _jsxs("div", {
    className: "flex flex-col gap-6 p-4",
    children: [
      _jsxs("div", {
        className: "flex items-center gap-2",
        children: [
          _jsx(Checkbox, {
            id: "wish-products",
            className: "border-solid border-[#852623] w-[18px] h-[18px]",
            checked: allSelected,
            onCheckedChange: () =>
              allSelected ? dispatch(deselectAll()) : dispatch(selectAll()),
          }),
          _jsx(Label, {
            htmlFor: "wish-products",
            className: "text-base font-medium cursor-pointer",
            children: "Select All |",
          }),
          _jsx(Button, {
            className: "text-base font-medium p-0",
            onClick: () => dispatch(deleteSelectedWishItems()),
            children: "Select Remove |",
          }),
          _jsx(Button, {
            onClick: moveAllToCart,
            className: "text-base font-medium p-0",
            children: "Add All To Cart",
          }),
        ],
      }),
      wishItems.map((item) =>
        _jsxs(
          "div",
          {
            className: "flex items-center justify-between border-b pb-4",
            children: [
              _jsxs("div", {
                className: "flex gap-4 items-center",
                children: [
                  _jsx(Checkbox, {
                    className:
                      "border-solid border-[#852623] w-[18px] h-[18px]",
                    checked: item.selected,
                    onCheckedChange: () =>
                      dispatch(toggleSelectItem(item.product.id)),
                  }),
                  _jsx("div", {
                    className: "bg-white",
                    children: _jsx("img", {
                      src: item.product.thumbnailImageUrl,
                      alt: item.product.name,
                      className: "w-24 h-24 object-contain",
                    }),
                  }),
                  _jsxs("div", {
                    children: [
                      _jsx("h3", {
                        className: "font-bold",
                        children: item.product.name,
                      }),
                      _jsx("p", { children: formatPrice(item.product.price) }),
                    ],
                  }),
                ],
              }),
              _jsxs("div", {
                className: "flex",
                children: [
                  _jsx(Button, {
                    className:
                      "add-to-cart-button bg-[#852623] text-[#f5f6dc] hover:bg-[#852623]",
                    onClick: () => {
                      dispatch(
                        saveCartItem({
                          product: item.product,
                          quantity: 1,
                          selected: false,
                        }),
                      );
                    },
                    children: "ADD TO CART",
                  }),
                  _jsx("div", {
                    className: "flex items-center gap-2",
                    children: _jsx(Button, {
                      size: "icon",
                      onClick: () => dispatch(removeWishItem(item.product.id)),
                      children: _jsx(Trash2, { strokeWidth: 1.5 }),
                    }),
                  }),
                ],
              }),
            ],
          },
          item.product.id,
        ),
      ),
      _jsxs("div", {
        className: "mt-6 flex justify-end items-center gap-4",
        children: [
          _jsx("span", {
            className: "font-semibold text-lg",
            children: "Total:",
          }),
          _jsx("span", {
            className: "font-bold text-xl",
            children: formatPrice(totalSelectedPrice),
          }),
        ],
      }),
    ],
  });
};
export default WishDetail;
