// bannerData.ts
import { BannerSlideData } from "@/features/home/components/Banner/Banner.types";
import { Banner1, Banner2, Banner3 } from "@/assets/images";
export const slides: BannerSlideData[] = [
  {
    id: 1,
    imageUrl: Banner1,
    title: "A Cozy Contrast to Toronto’s Cold Winter",
    subtitle:
      "Designed for freezing Toronto days, these cute phone keyrings add a soft, cozy touch to your everyday routine — a small detail that makes winter feel a little warmer.",
  },
  {
    id: 2,
    imageUrl: Banner2,
    title: "Small Details That Stay With You.",
    subtitle:
      "Some things don't need to be loud to be noticed. These cute phone keyrings are designed to quietly sit by your side, adding a sense of comfort and personality to your everyday routine.",
  },
  {
    id: 3,
    imageUrl: Banner3,
    title: "For the Little Things You Notice",
    subtitle:
      "Not everyone looks for bold statements. These phone keyrings are made for those who notice small details and enjoy quiet moments of charm throughout the day.",
  },
];
