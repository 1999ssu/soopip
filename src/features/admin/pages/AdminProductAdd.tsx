//관리자 상품 등록 페이지

import ProductForm from "../components/ProductForm";

const AdminProductAdd = () => {
  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">상품 등록</h2>
      <ProductForm />
    </div>
  );
};

export default AdminProductAdd;
