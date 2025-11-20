import { Outlet } from "react-router-dom";
import "@/styles/admin/admin.css";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Home",
    url: "/admin",
  },
  {
    title: "상품 목록",
    url: "/admin/products/list",
  },
  {
    title: "상품 등록",
    url: "/admin/products/add",
  },
  {
    title: "주문 관리",
    url: "/admin/orders",
  },
];
const AdminLayout = () => {
  return (
    <SidebarProvider>
      <Sidebar>
        {/* <Header /> */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="layout">
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

/* <aside className="w-60 bg-gray-800 text-white p-4 flex flex-col gap-2">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <Link to="/admin">대시보드</Link>
        <Link to="/admin/products/list">상품 목록</Link>
        <Link to="/admin/products/add">상품 등록</Link>
        <Link to="/admin/orders">주문 관리</Link>
      </aside> */

export default AdminLayout;
