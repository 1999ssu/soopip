import { BrowserRouter, Routes, Route } from "react-router-dom";

// 공용 페이지
import Home from "@/pages/Home";
// import About from "@/pages/About";
// import Contact from "@/pages/Contact";
// import NotFound from "@/pages/NotFound";

// Auth
import Login from "@/features/auth/pages/Login";
import SignUp from "@/features/auth/pages/SignUp";
import MainLayout from "@/layouts/MainLayout";
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
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          {/* <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} /> */}
        </Route>
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
