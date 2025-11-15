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
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [slides.length, interval]);

  return (
    <div className={`content banner_wrap banner_bg_${currentIndex}`}>
      <BannerSlide slide={slides[currentIndex]} />
    </div>
  );
};

export default BannerList;
