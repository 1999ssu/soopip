import React, { useState, useEffect } from "react";
import BannerSlide from "./BannerSlide";
import { BannerSlideData } from "./Banner.types";

interface Props {
  slides: BannerSlideData[];
  interval?: number; // ms 단위
}

const BannerList = ({ slides, interval = 5000 }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const urls = slides.map((slide) => slide.imageUrl); // slide.image = "../assets/images/banner_X.png"
    urls.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [slides]);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentIndex((prev) => (prev + 1) % slides.length);
  //   }, interval);

  //   return () => clearInterval(timer);
  // }, [slides.length, interval]);

  return (
    <div className={`content banner_wrap banner_bg_${currentIndex}`}>
      {/* <BannerSlide slide={slides[currentIndex]} /> */}
      <BannerSlide slide={slides[1]} />
    </div>
  );
};

export default BannerList;
