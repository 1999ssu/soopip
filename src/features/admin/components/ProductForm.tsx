import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db, auth } from "@/lib/firebase";
import { Product } from "@/features/admin/types/admin.types";

const ProductForm = () => {
  /** 기본 정보 */
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  /** 썸네일 */
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  /** 상세 이미지 */
  const [detailFiles, setDetailFiles] = useState<File[]>([]);
  const [detailPreviews, setDetailPreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  /** 썸네일 이미지 핸들러 */
  const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);

    setThumbnailPreview(URL.createObjectURL(file));
  };

  /** 상세 이미지 핸들러 */
  const handleDetailFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setDetailFiles(files);

    const urls = files.map((f) => URL.createObjectURL(f));
    setDetailPreviews(urls);
  };

  /** 저장 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return alert("썸네일을 선택하세요.");

    setLoading(true);

    try {
      /** 1️⃣ 썸네일 업로드 */
      const thumbPath = `products/${Date.now()}_${imageFile.name}`;
      const thumbRef = ref(storage, thumbPath);
      const thumbSnap = await uploadBytes(thumbRef, imageFile);
      const thumbnailImageUrl = await getDownloadURL(thumbSnap.ref);

      /** 2️⃣ 상세 이미지 업로드 */
      const detailImagesUrl: string[] = [];

      for (const file of detailFiles) {
        const filePath = `products/details/${Date.now()}_${file.name}`;
        const fileRef = ref(storage, filePath);
        const snap = await uploadBytes(fileRef, file);
        const url = await getDownloadURL(snap.ref);
        detailImagesUrl.push(url);
      }

      /** 3️⃣ Firestore 저장 */
      const newProduct: Product = {
        name,
        price,
        stock,
        category,
        description,
        thumbnailImageUrl,
        detailImagesUrl,
        createdBy: auth.currentUser?.uid || "anonymous",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "products"), newProduct);
      alert("상품 등록 완료!");

      /** 초기화 */
      setName("");
      setPrice(0);
      setStock(0);
      setCategory("");
      setDescription("");
      setImageFile(null);
      setThumbnailPreview(null);
      setDetailFiles([]);
      setDetailPreviews([]);
    } catch (err) {
      console.error(err);
      alert("등록 중 오류 발생");
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
          placeholder="재고"
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

        {/* 썸네일 */}
        <label>썸네일 이미지</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleThumbnail}
          required
        />

        {thumbnailPreview && (
          <img src={thumbnailPreview} alt="thumbnail" className="w-32" />
        )}

        {/* 상세 이미지 */}
        <label>상세 이미지 (여러 장)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleDetailFiles}
        />

        <div className="flex gap-2 flex-wrap">
          {detailPreviews.map((src, i) => (
            <img key={i} src={src} alt="" className="w-24" />
          ))}
        </div>

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
