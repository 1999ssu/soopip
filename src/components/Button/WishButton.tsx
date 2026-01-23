import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import {
  addItem,
  removeItem,
  removeWishItem,
  saveWishItem,
} from "@/routes/store/wishStore";
import { Product } from "@/features/product/types/product.types";
import { WishActiveIcon, WishIcon } from "@/assets/icons";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

const WishButton = ({ product }: { product: Product }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const wishlistItems = useAppSelector((state) => state.wish.items);

  const isInWishlist = wishlistItems.some(
    (item) => item.product.id === product.id
  );
  const toggleWishlist = () => {
    // 1. 로그인 안 되어 있으면 로그인 페이지로 이동
    if (!auth.currentUser) {
      alert("로그인 후 위시리스트를 사용할 수 있습니다.");
      navigate("/login"); // 또는 "/signin" 등 당신 로그인 페이지 경로
      return;
    }

    // 2. 로그인 되어 있으면 Thunk 호출
    if (isInWishlist) {
      dispatch(removeWishItem(product.id)); // Firestore 삭제 + Redux 제거
    } else {
      dispatch(saveWishItem(product)); // Firestore 저장 + Redux 추가
    }
  };

  return (
    <div className="wish">
      <button
        className="icon"
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist();
        }}
      >
        {isInWishlist ? <WishActiveIcon /> : <WishIcon />}
      </button>
    </div>
  );
};
export default WishButton;
