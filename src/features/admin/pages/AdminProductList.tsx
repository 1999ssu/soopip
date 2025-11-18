import { useCallback, useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { Product } from "@/features/admin/types/admin.types";
import { deleteObject, ref } from "firebase/storage";

const AdminProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const list: Product[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Product, "id">), // TS용 타입 단언
      }));
      setProducts(list);
    } catch (err) {
      console.error("상품 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!window.confirm("진짜 삭제할래? 되돌릴 수 없다잉")) return;

    try {
      // 1️⃣ Firestore에서 문서 삭제
      await deleteDoc(doc(db, "products", id));

      // 2️⃣ Storage 이미지 삭제
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);

      // 3️⃣ 로컬 state 업데이트
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 실패!");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) return <p>상품 불러오는 중…</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">등록된 상품 목록</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">이미지</th>
            <th className="border p-2">상품명</th>
            <th className="border p-2">가격</th>
            <th className="border p-2">재고</th>
            <th className="border p-2">카테고리</th>
            <th className="border p-2">관리</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="border p-2 text-center">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-16 h-16 object-cover mx-auto rounded"
                />
              </td>
              <td className="border p-2 text-center">{p.name}</td>
              <td className="border p-2 text-center">{p.price} CAD</td>
              <td className="border p-2 text-center">{p.stock}</td>
              <td className="border p-2 text-center">{p.category}</td>
              <td className="border p-2 flex justify-center gap-2">
                <button
                  onClick={() => handleDelete(p.id, p.imageUrl)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductList;
