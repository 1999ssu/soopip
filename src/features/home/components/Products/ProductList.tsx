import BasicCard from "@/components/Card/BasicCard";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import BasicCardLayout from "@/components/Card/BasicCardLayout";
import { useNavigate } from "react-router-dom";
import { goToPageByNameWithId } from "@/utils/RouterUtil";
import WishButton from "@/components/Button/WishButton";
import { Product } from "@/features/product/types/product.types";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snapshot) => {
      const list = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          price: data.price,
          thumbnailImageUrl: data.thumbnailImageUrl,
          stock: data.stock,
          isSoldOut: data.isSoldOut,
          description: data.description || "", // 필수 타입 맞추기
        };
      }) as Product[];
      setProducts(list);
    });

    return () => unsub();
  }, []);
  return (
    <div className="content">
      <h2>상품들</h2>
      <BasicCardLayout>
        {products.map((item) => (
          <BasicCard
            key={item.id}
            thumbnailImageUrl={item.thumbnailImageUrl}
            title={item.name}
            subTitle={`$${item.price}`}
            onClick={() => goToPageByNameWithId(navigate, "product", item.id)}
          >
            <WishButton product={item} />
          </BasicCard>
        ))}
      </BasicCardLayout>
    </div>
  );
};

export default ProductList;
