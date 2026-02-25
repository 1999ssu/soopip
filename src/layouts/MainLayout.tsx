import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="layout">
        <Outlet />
      </main>
      <Toaster />
      {/* <Footer /> */}
    </>
  );
};

export default MainLayout;
