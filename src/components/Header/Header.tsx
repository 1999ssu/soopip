import React, { useEffect } from "react";
import "./header.css";
import { Link, useNavigate } from "react-router-dom";
import {
  UserIcon,
  CartIcon,
  SearchIcon,
  WishIcon,
  WishActiveIcon,
} from "@/assets/icons";
import { useAppSelector } from "@/hooks/hooks";
import { selectCartCount } from "@/routes/store/cartStore";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/hooks/useAuth";
import DropdownButton from "../Button/DropdownButton";
import { Search, ShoppingCart, User } from "lucide-react";
const Header = () => {
  const wishItems = useAppSelector((state) => state.wish.items);

  const cartCount = useAppSelector(selectCartCount);

  const hasItems = wishItems.length > 0; // 1개라도 있으면 Active
  const { user, logout, userData } = useAuth();

  const navigate = useNavigate();

  return (
    <header className="header_wrap">
      <div className="header">
        <div className="top flex flex-row items-center">
          <Link to="/products" className="icon">
            <Search strokeWidth={1.5} />
          </Link>
          <div className="logo">
            <Link to="/">Soopip로고자리</Link>
          </div>
          <div className="flex flex-row gap-6 items-center">
            <Link to="/wish" className="icon">
              {hasItems ? <WishActiveIcon /> : <WishIcon />}
            </Link>
            <Link to="/cart" className="icon">
              <div className="relative">
                <ShoppingCart strokeWidth={1.5} />
                {cartCount > 0 && (
                  <Badge className="bg-black text-white flex items-center justify-center h-5 min-w-5 rounded-full px-1 font-mono tabular-nums absolute right-[-14px] top-[-6px]">
                    {cartCount}
                  </Badge>
                )}
              </div>
            </Link>
            {user ? (
              <DropdownButton
                buttonContent={<User strokeWidth={1.5} className="icon" />}
                options={[
                  {
                    subTitle: userData?.name,
                    items: [
                      {
                        label: "My Profile",
                        onClick: () => {
                          navigate("/myProfile");
                        },
                      },
                      {
                        label: "My Orders",
                        onClick: () => {
                          navigate("/myOrders");
                        },
                      },
                      {
                        label: "My Addresses",
                        onClick: () => {
                          navigate("/myAddresses");
                        },
                      },
                      {
                        label: "Log Out",
                        onClick: async () => {
                          await logout();
                          navigate("/");
                        },
                      },
                    ],
                  },
                ]}
              />
            ) : (
              <Link to="/login">
                <User strokeWidth={1.5} className="icon" />
              </Link>
              // <DropdownButton
              //   buttonContent={<UserIcon className="icon" />}
              //   options={[
              //     {
              //       subTitle: "계정2222",
              //       items: [
              //         { label: "로그인", onClick: () => navigate("/login") },
              //         { label: "회원가입", onClick: () => navigate("/signup") },
              //       ],
              //     },
              //   ]}
              // />
            )}
          </div>
        </div>
        <nav className="nav bottom">
          <ul>
            <li>
              <Link to="/">ALL</Link>
            </li>
            <li>
              <Link to="/">BEST</Link>
            </li>
            <li>
              <Link to="/">NEW</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
