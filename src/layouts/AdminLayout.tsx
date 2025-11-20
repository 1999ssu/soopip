import Footer from "@/components/Footer/Footer";
// import Header from "@/components/Header/Header";
import { Link, Outlet } from "react-router-dom";
import "@/styles/admin/admin.css";

const AdminLayout = () => {
  return (
    <>
      {/* <Header /> */}
      <aside className="w-60 bg-gray-800 text-white p-4 flex flex-col gap-2">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <Link to="/admin">대시보드</Link>
        <Link to="/admin/products/list">(상품 목록)</Link>
        <Link to="/admin/products/add">(상품 등록)</Link>
        <Link to="/admin/orders">(주문 관리)</Link>
      </aside>
      <main className="layout">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default AdminLayout;
