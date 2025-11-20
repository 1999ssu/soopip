//extends React.HTMLAttributes<HTMLDivElement>:::className, style, onMouseEnter 등 HTML 기본 속성도 자동 지원
export interface BasicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  thumbnailImageUrl: string;
  title: string;
  subTitle?: string | number;
  onClick?: () => void;
}
