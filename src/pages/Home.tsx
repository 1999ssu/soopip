import { slides } from "@/features/home/components/Banner/bannerData";
import BannerList from "@/features/home/components/Banner/BannerList";
import React from "react";

const Home = () => {
  return (
    <div>
      <BannerList slides={slides} interval={5000} />
    </div>
  );
};

export default Home;
