import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/features/admin/types/admin.types";

export const useProductDetail = (id: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
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
      }
    };

    fetchData();
  }, [id]);

  return product;
};
