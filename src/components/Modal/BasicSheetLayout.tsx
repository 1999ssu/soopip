import { ReactNode } from "react";
import { Button } from "../ui/button";
import { FieldGroup, FieldLegend, FieldSet } from "../ui/field";
import { SheetFooter } from "../ui/sheet";

interface BasicSheetLayoutProps {
  title: string;
  text?: string;
  children: ReactNode;
  showFooter?: boolean;
  footerContent?: ReactNode; // Footer 전체를 자유롭게 커스텀 (버튼 여러 개, 텍스트 자유)
}

const BasicSheetLayout = ({
  title,
  text,
  children,
  showFooter = false,
  footerContent,
}: BasicSheetLayoutProps) => {
  return (
    <div className="w-full max-w-md">
      <form>
        <FieldSet>
          <FieldLegend>{title}</FieldLegend>
          <FieldGroup>{children}</FieldGroup>
          {/* showFooter가 true일 때만 Footer 렌더링 */}
          {showFooter && (
            <SheetFooter className="mt-6">
              {footerContent || (
                // 기본 Footer (필요시)
                <div className="text-center text-gray-500">{text}</div>
              )}
            </SheetFooter>
          )}
        </FieldSet>
      </form>
    </div>
  );
};
export default BasicSheetLayout;
