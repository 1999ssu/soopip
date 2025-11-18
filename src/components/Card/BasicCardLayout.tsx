import { ReactNode } from "react";
import "./card.css";
interface Props {
  children: ReactNode;
}
const BasicCardLayout = ({ children }: Props) => {
  return <div className="card_wrap">{children}</div>;
};

export default BasicCardLayout;
