export type FieldType = "text" | "textarea" | "select" | "number";

export interface FieldItem {
  id: string;
  label: string;
  type: FieldType;
  options?: string[]; // select 전용
  value?: string | number;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export interface BasicFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  fields: FieldItem[];
  children?: React.ReactNode; // 필드 하단 추가 요소용
}
