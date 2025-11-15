// bannerData.ts
import { BannerSlideData } from "@/features/home/components/Banner/Banner.types";
import { Banner1, Banner2, Banner3 } from "@/assets/images";
export const slides: BannerSlideData[] = [
  {
    id: 1,
    imageUrl: Banner1,
    title: "첫 번째 배너",
    subtitle: "서브 텍스트1",
  },
  {
    id: 2,
    imageUrl: Banner2,
    title: "두 번째 배너",
    subtitle: "서브 텍스트2",
  },
  {
    id: 3,
    imageUrl: Banner3,
    title: "세 번째 배너",
    subtitle: "서브 텍스트3",
  },
];
