import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Product } from "@/features/admin/types/admin.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WishIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const docRef = doc(db, "products", id);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        const mappedProduct: Product = {
          id: snapshot.id,
          name: data.name ?? "",
          price: data.price ?? 0,
          stock: data.stock ?? 0,
          category: data.category ?? "",
          description: data.description ?? "",
          thumbnailImageUrl: data.thumbnailImageUrl ?? "",
          createdBy: data.createdBy ?? "",
          createdAt: data.createdAt ?? null,
          updatedAt: data.updatedAt ?? null,
          detailImagesUrl: data.detailImagesUrl ?? [],
        };
        setProduct(mappedProduct);
        setActiveTab(mappedProduct.detailImagesUrl[0] || null);
      }
    };
    fetchData();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex gap-16">
        <div className="left flex">
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val)}
            orientation="vertical"
            className="w-24"
          >
            <TabsList className="flex flex-col gap-2 h-full justify-start">
              {product.detailImagesUrl.map((img, idx) => (
                <TabsTrigger
                  key={idx}
                  value={img}
                  className="w-[62px] h-[72px] p-0 "
                >
                  <img
                    src={img}
                    alt={`thumb-${idx}`}
                    className="w-full h-full object-cover"
                  />
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex-1">
            {product.detailImagesUrl.map((img, idx) => (
              <div
                key={idx}
                className={`${
                  img === activeTab ? "block" : "hidden"
                } w-[500px] h-[600px]`}
              >
                <img src={img} alt={`product-${idx}`} />
              </div>
            ))}
          </div>
        </div>
        <div className="right flex flex-col gap-6 relative">
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-bold">{product.name}</h3>
              <div>공유 영역</div>
            </div>
            <div>리뷰영역</div>
            <div>
              <h3 className="text-2xl font-bold">${product.price}</h3>
            </div>
          </div>
          <div className="w-full flex flex-col gap-2">
            <div className="flex flex-row gap-10">
              <p className="w-[120px] min-w-[120px]">Duties and Taxes</p>
              <p>You can check the Duties and Taxes in your shopping bag.</p>
            </div>
            <div className="flex flex-row gap-10 ">
              <p className="w-[120px] min-w-[120px]">Estimated Delivery</p>
              <p>
                Ships in an average of 6 days.
                <span className="block mt-1 text-sm text-gray-500">
                  ※ within 3-9 days, excluding weekends/holidays
                </span>
              </p>
            </div>
            <div className="flex flex-row gap-10">
              <p className="w-[120px] min-w-[120px]">Delivery</p>
              <p>
                $8.50<span>Free shipping on orders above $50</span>
              </p>
            </div>
            <div className="w-full h-11 absolute flex flex-row left-0 bottom-0 gap-4 items-center ">
              <div className="min-w-[35px] h-[35px]">
                <button
                  className="w-full h-full "
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("buttonclick");
                  }}
                >
                  <WishIcon className="w-full h-full active:bg-red" />
                </button>
              </div>
              <div className="w-full h-full">
                <Button className="w-full h-full flex bg-black text-zinc-50 hover:bg-black">
                  ADD TO CART
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="productDetail">
        <Tabs defaultValue="detailedImages" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="detailedImages" className="tabs-trigger">
              DETAILED IMAGES
            </TabsTrigger>
            <TabsTrigger value="reviews" className="tabs-trigger">
              REVIEWS <span>(14)</span>
            </TabsTrigger>
            <TabsTrigger value="description" className="tabs-trigger">
              DESCRIPTION
            </TabsTrigger>
            <TabsTrigger value="returns" className="tabs-trigger">
              RETURNS
            </TabsTrigger>
          </TabsList>
          <TabsContent value="detailedImages">
            DETAILED IMAGES 상세 화면
          </TabsContent>
          <TabsContent value="reviews">REVIEWS 상세화면</TabsContent>
          <TabsContent value="description">DESCRIPTION 상세 화면</TabsContent>
          <TabsContent value="returns">RETURNS 상세화면</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetail;
