import { BrowserRouter, Routes, Route } from "react-router-dom";
// import HomePage from "../pages/Home";
// import LoginPage from "../features/auth/pages/LoginPage";
// import SignUpPage from "../features/auth/pages/SignUpPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
