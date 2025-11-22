import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { WishIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { goToPageByNameWithId } from "@/utils/RouterUtil";

import { useAppDispatch } from "@/hooks/hooks";
import { setPrice } from "@/routes/store/productStore";
import { useProductDetail } from "../hooks/useProductDetail";
import { ProductImages } from "../components/ProductImages";
import { ProductQuantity } from "../components/ProductQuantity";
import ProductInfo from "../components/ProductInfo";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = useProductDetail(id);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  if (!product) return <div>Loading...</div>;

  // 대표 이미지 기본값 설정
  if (!activeTab && product.detailImagesUrl.length > 0) {
    setActiveTab(product.detailImagesUrl[0]);
  }

  // 가격 Redux 세팅
  dispatch(setPrice(product.price));

  return (
    <div>
      <div className="flex gap-16">
        <ProductImages
          images={product.detailImagesUrl}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="right flex flex-col gap-6 relative">
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-bold">{product.name}</h3>
              <div>공유 영역</div>
            </div>
            <div>리뷰 영역</div>
            <h3 className="text-2xl font-bold">${product.price}</h3>
            <ProductInfo />
          </div>

          <div className="flex flex-col absolute left-0 bottom-0 gap-4 w-full items-center">
            <ProductQuantity />
            <div className="flex w-full h-11 items-center gap-3">
              <button className="min-w-[35px] h-[35px]">
                <WishIcon className="w-full h-full" />
              </button>

              <Button
                className="w-full h-full bg-black text-white hover:bg-black"
                onClick={() =>
                  goToPageByNameWithId(navigate, "product/cart", id)
                }
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
