import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Product } from "@/features/admin/types/admin.types";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>(); // id가 string임을 명시
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const docRef = doc(db, "products", id);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        // Product 타입에 맞게 매핑
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
          detailImagesUrl: data.detailImagesUrl ?? [], // 만약 Product 타입에 추가
        } as Product;
        setProduct(mappedProduct);
      }
    };
    fetchData();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <img src={product.thumbnailImageUrl} alt="" />
      <h1>{product.name}</h1>
      <p>${product.price}</p>
      <p>{product.description}</p>

      {product.detailImagesUrl?.map((img: string, i: number) => (
        <img key={i} src={img} alt="" />
      ))}
    </div>
  );
};

export default ProductDetail;
