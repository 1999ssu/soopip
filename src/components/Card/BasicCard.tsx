import { BasicCardProps } from "./BasicCard.types";

const BasicCard = ({
  imageUrl,
  title,
  subTitle,
  onClick,
  children,
}: BasicCardProps) => {
  return (
    <div
      className={`card ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <div className="img_box">
        <img src={imageUrl} />
        {children}
      </div>
      <div className="text_wrap flex_column gap_10">
        <p className="basic_sub_title">{title}</p>
        <p className="bold_font basic_sub_title">{subTitle}</p>
      </div>
    </div>
  );
};

export default BasicCard;
