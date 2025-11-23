import BasicCard from "@/components/Card/BasicCard";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import BasicCardLayout from "@/components/Card/BasicCardLayout";
import { WishIcon } from "@/assets/icons";
import { useNavigate } from "react-router-dom";
import { goToPageByNameWithId } from "@/utils/RouterUtil";
// const productList = [
//   {
//     id: 1,
//     imageUrl: "@/assets/images/banner_2.png",
//     title: "키링1",
//     subTitle: "$12",
//   },
//   {
//     id: 2,
//     imageUrl: "@/assets/images/banner_2.png",
//     title: "키링2",
//     subTitle: "$5",
//   },
//   {
//     id: 3,
//     imageUrl: "@/assets/images/banner_3.png",
//     title: "키링3",
//     subTitle: "$9",
//   },
// ];

interface Product {
  id: string;
  name: string;
  price: number;
  thumbnailImageUrl: string;
  stock: number;
  isSoldOut: boolean;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    // products 컬렉션 실시간 구독
    const unsub = onSnapshot(collection(db, "products"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(list);
    });

    // 컴포넌트 언마운트 시 구독 해제
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
            <div className="wish">
              <button
                className="icon"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <WishIcon />
              </button>
            </div>
          </BasicCard>
        ))}
      </BasicCardLayout>
    </div>
  );
};

export default ProductList;
