import BasicField from "@/components/Input/BasicField";
import { useProductForm } from "../hooks/useProductForm";
import { productsFields } from "@/components/Input/ProductsFields";
import ImageFields from "@/components/Input/ImageFields";

const ProductForm = () => {
  const form = useProductForm();

  const fields = productsFields(
    form.name,
    form.setName,
    form.price,
    form.setPrice,
    form.stock,
    form.setStock,
    form.category,
    form.setCategory,
    form.description,
    form.setDescription
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    form.setLoading(true);

    try {
      await form.submit();
      alert("상품 등록 완료!");
      form.reset();
    } catch (err) {
      console.error(err);
      alert("등록 중 오류 발생");
    } finally {
      form.setLoading(false);
    }
  };

  return (
    <div className=" mx-auto p-4 bg-white shadow rounded">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <BasicField description="상품 정보를 입력해주세요" fields={fields}>
          <ImageFields
            thumbnailPreview={form.thumbnailPreview}
            detailPreviews={form.detailPreviews}
            onThumbnailChange={form.handleThumbnail}
            onDetailsChange={form.handleDetailFiles}
          />

          <button
            type="submit"
            disabled={form.loading}
            className="bg-blue-500 text-white py-2 rounded mt-4 w-full"
          >
            {form.loading ? "등록 중..." : "상품 등록"}
          </button>
        </BasicField>
      </form>
    </div>
  );
};

export default ProductForm;
