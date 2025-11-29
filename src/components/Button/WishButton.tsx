import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { addItem, removeItem } from "@/routes/store/wishStore";
import { Product } from "@/features/product/types/product.types";
import { WishActiveIcon, WishIcon } from "@/assets/icons";

const WishButton = ({ product }: { product: Product }) => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wish.items);

  const isInWishlist = wishlistItems.some(
    (item) => item.product.id === product.id
  );

  const toggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeItem(product.id));
    } else {
      dispatch(addItem(product));
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
