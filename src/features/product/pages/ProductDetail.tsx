import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { WishIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { goToPageByName, goToPageByNameWithId } from "@/utils/RouterUtil";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { resetQuantity, setPrice } from "@/routes/store/productStore";
import { useProductDetail } from "../hooks/useProductDetail";
import { ProductImages } from "../components/ProductImages";
import { ProductQuantity } from "../components/ProductQuantity";
import ProductInfo from "../components/ProductInfo";
import { addItem, saveCartItem } from "@/routes/store/cartStore";
import { saveWishItem } from "@/routes/store/wishStore";
import WishButton from "@/components/Button/WishButton";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = useProductDetail(id);
  const allImages = product
    ? [product.thumbnailImageUrl, ...(product.detailImagesUrl || [])]
    : [];

  const [activeTab, setActiveTab] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const quantity = useAppSelector((state) => state.product.quantity);

  useEffect(() => {
    // 페이지 들어올 때마다 초기화
    dispatch(resetQuantity());

    return () => {
      // 페이지 떠날 때도 초기화 (안전빵)
      dispatch(resetQuantity());
    };
  }, [dispatch, id]);

  if (!product) return <div>Loading...</div>;

  // 대표 이미지 기본값 설정
  if (!activeTab && product.detailImagesUrl.length > 0) {
    setActiveTab(allImages[0]);
  }

  // 가격 Redux 세팅
  dispatch(setPrice(product.price));

  const handleAddToCart = () => {
    dispatch(
      saveCartItem({
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          thumbnailImageUrl: product.thumbnailImageUrl, // Product 타입에 thumbnail 추가 필요
        },
        quantity: quantity, // 선택한 수량
        selected: true,
      }),
    );
    console.log("qe", quantity);
    // 카트 페이지로 이동
    // goToPageByName(navigate, "cart");
  };

  const handleAddToWish = () => {
    dispatch(saveWishItem(product));

    // 카트 페이지로 이동
    goToPageByName(navigate, "cart");
  };

  return (
    <div className="product">
      <div className="flex gap-16">
        <ProductImages
          images={allImages}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="right flex flex-col gap-6 relative">
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-bold">{product.name}</h3>
              {/* <div>공유 영역</div> */}
            </div>
            {/* <div>리뷰 영역</div> */}
            <h3 className="text-2xl font-bold">${product.price}</h3>
            <ProductInfo />
          </div>

          <div className="flex flex-col absolute left-0 bottom-0 gap-4 w-full items-center">
            <ProductQuantity />
            <div className="flex w-full h-11 items-center gap-3">
              <div className="min-w-[35px] h-[35px]">
                <WishButton product={product} />
              </div>

              <Button
                className="w-full h-full bg-[#852623] text-[#f5f6dc] hover:bg-[#852623]"
                onClick={handleAddToCart}
              >
                ADD TO CART
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs 상세 영역 */}
    </div>
  );
};

export default ProductDetail;
