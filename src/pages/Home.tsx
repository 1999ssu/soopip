import { slides } from "@/features/home/components/Banner/bannerData";
import BannerList from "@/features/home/components/Banner/BannerList";
import ProductList from "@/features/home/components/Products/ProductList";
import React from "react";

const Home = () => {
  return (
    <div>
      <BannerList slides={slides} interval={5000} />
      <ProductList />
      <div className="content">ddddd</div>
    </div>
  );
};

export default Home;
