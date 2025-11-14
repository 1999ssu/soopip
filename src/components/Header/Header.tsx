import React from "react";
import "./header.css";
import { Link } from "react-router-dom";
import { UserIcon, CartIcon, SearchIcon, WishIcon } from "@/assets/icons";
const Header = () => {
  return (
    <header className="header">
      <div className="top flex-row">
        <Link to="/products" className="icon">
          <SearchIcon />
        </Link>
        <div className="logo">
          <Link to="/">Soopip로고자리</Link>
        </div>
        <div className="flex-row gap-20">
          <Link to="/wish" className="icon">
            <WishIcon />
          </Link>
          <Link to="/cart" className="icon">
            <CartIcon />
          </Link>
          <Link to="/login" className="icon">
            <UserIcon />
          </Link>
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
    </header>
  );
};

export default Header;
