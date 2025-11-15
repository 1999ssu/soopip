import React from "react";
import { BannerSlideData } from "./Banner.types";

interface Props {
  slide: BannerSlideData;
}
const BannerSlide = ({ slide }: Props) => {
  return (
    <div className="banner_slide banner">
      <div className="img_wrap">
        <img src={slide.imageUrl} alt={slide.title} />
      </div>
      <div className="txt_wrap">
        <h2>{slide.title}</h2>
        {slide.subtitle && <p>{slide.subtitle}</p>}
      </div>
    </div>
  );
};

export default BannerSlide;
