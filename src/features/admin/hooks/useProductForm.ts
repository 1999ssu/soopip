import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db, auth } from "@/lib/firebase";
import { Product } from "@/features/admin/types/admin.types";

export const useProductForm = () => {
  /** 기본 정보 */
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  /** 이미지 */
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [detailFiles, setDetailFiles] = useState<File[]>([]);
  const [detailPreviews, setDetailPreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  /** 썸네일 핸들러 */
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
    setDetailPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  /** 제출 */
  const submit = async () => {
    if (!imageFile) throw new Error("썸네일이 필요합니다.");

    /** 썸네일 업로드 */
    const thumbPath = `products/${Date.now()}_${imageFile.name}`;
    const thumbRef = ref(storage, thumbPath);
    const thumbSnap = await uploadBytes(thumbRef, imageFile);
    const thumbnailImageUrl = await getDownloadURL(thumbSnap.ref);

    /** 상세 이미지 업로드 */
    const detailImagesUrl: string[] = [];

    for (const file of detailFiles) {
      const filePath = `products/details/${Date.now()}_${file.name}`;
      const fileRef = ref(storage, filePath);
      const snap = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(snap.ref);
      detailImagesUrl.push(url);
    }

    /** Firestore 저장 */
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
  };

  /** 초기화 */
  const reset = () => {
    setName("");
    setPrice(0);
    setStock(0);
    setCategory("");
    setDescription("");
    setImageFile(null);
    setThumbnailPreview(null);
    setDetailFiles([]);
    setDetailPreviews([]);
  };

  return {
    /** state */
    name,
    price,
    stock,
    category,
    description,
    thumbnailPreview,
    detailPreviews,
    loading,

    /** setters */
    setName,
    setPrice,
    setStock,
    setCategory,
    setDescription,
    setLoading,

    /** handlers */
    handleThumbnail,
    handleDetailFiles,

    /** actions */
    submit,
    reset,
  };
};
