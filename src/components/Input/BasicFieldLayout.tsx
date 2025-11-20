import { ReactNode } from "react";
interface Props {
  children: ReactNode;
}
const BasicFieldLayout = ({ children }: Props) => {
  return <div className="field_wrap">{children}</div>;
};

export default BasicFieldLayout;
