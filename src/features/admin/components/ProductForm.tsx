//관리자 상품 등록 페이지
import { useState } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db, auth } from "@/lib/firebase";
import { Product } from "@/features/admin/types/admin.types";

const ProductForm = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  let imageUrl = "";
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return alert("이미지를 선택해주세요.");

    setLoading(true);
    try {
      // 1️⃣ Firebase Storage에 업로드
      const path = `products/${Date.now()}_${imageFile.name}`;
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(snapshot.ref);

      // 2️⃣ Firestore products 컬렉션에 새 문서 추가
      const newProduct: Product = {
        name,
        price,
        stock,
        category,
        description,
        imageUrl,
        // createdBy: auth.currentUser.uid,
        createdBy: auth.currentUser ? auth.currentUser.uid : "anonymous",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "products"), newProduct);
      alert("상품 등록 완료!");

      // 초기화
      setName("");
      setPrice(0);
      setStock(0);
      setCategory("");
      setDescription("");
      setImageFile(null);
    } catch (err) {
      console.error(err);
      alert("등록 중 오류 발생");

      // Firestore 등록 실패 시 Storage 이미지 삭제
      if (imageUrl) {
        const deleteRef = ref(storage, imageUrl);
        deleteObject(deleteRef).catch((delErr) =>
          console.error("Storage 이미지 삭제 실패:", delErr)
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="상품명"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="가격(센트)"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
        />
        <input
          type="number"
          placeholder="재고 수량"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          required
        />
        <input
          type="text"
          placeholder="카테고리"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <textarea
          placeholder="설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded"
        >
          {loading ? "등록 중..." : "상품 등록"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
