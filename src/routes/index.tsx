import { BrowserRouter, Routes, Route } from "react-router-dom";

// 공용 페이지
import Home from "@/pages/Home";
// import About from "@/pages/About";
// import Contact from "@/pages/Contact";
// import NotFound from "@/pages/NotFound";

// Auth
// import Login from "@/features/auth/pages/Login";
// import SignUp from "@/features/auth/pages/SignUp";
import MainLayout from "@/layouts/MainLayout";
import RequireAdmin from "../features/admin/components/RequireAdmin";

//Admin
import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboard from "@/features/admin/pages/AdminDashboard";
import AdminProducts from "@/features/admin/pages/AdminProducts";
import AdminOrders from "@/features/admin/pages/AdminOrders";
import AdminProductAdd from "@/features/admin/pages/AdminProductAdd";
import AdminProductList from "@/features/admin/pages/AdminProductList";
import ProductDetail from "@/features/product/pages/ProductDetail";
// import ResetPassword from "@/features/auth/pages/ResetPassword";

// Product
// import ProductList from "@/features/product/pages/ProductList";
// import ProductDetail from "@/features/product/pages/ProductDetail";
// import AddProduct from "@/features/product/pages/AddProduct";

// // Payment
// import Checkout from "@/features/payment/pages/Checkout";

// // Layouts
// import MainLayout from "@/layouts/MainLayout";
// import AuthLayout from "@/layouts/AuthLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 사용자 레이아웃 */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="product/:id" element={<ProductDetail />} />
          {/* <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} /> */}
        </Route>

        {/* 관리자 전용 라우트 묶음 */}
        {/* <Route element={<RequireAdmin />}> */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* <Route path="/admin" element={<AdminDashboard />} /> */}
          {/* <Route path="/admin/products" element={<AdminProducts />} /> */}
          <Route path="/admin/products/list" element={<AdminProductList />} />

          <Route path="/admin/products/add" element={<AdminProductAdd />} />

          <Route path="/admin/orders" element={<AdminOrders />} />
        </Route>
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

// export default function AppRoutes() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* 공용 페이지 */}
//         <Route element={<MainLayout />}>

//         {/* <Route element={<MainLayout />}> */}
//           <Route path="/" element={<Home />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/contact" element={<Contact />} />
//           <Route path="/products" element={<ProductList />} />
//           <Route path="/products/:id" element={<ProductDetail />} />
//           <Route path="/checkout" element={<Checkout />} />
//         </Route>

//         {/* Auth 전용 페이지 */}
//         <Route element={<AuthLayout />}>
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<SignUp />} />
//           <Route path="/reset" element={<ResetPassword />} />
//         </Route>

//         {/* 관리자용 페이지 */}
//         <Route element={<MainLayout />}>
//           <Route path="/admin/add-product" element={<AddProduct />} />
//         </Route>

//         {/* 404 */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }
