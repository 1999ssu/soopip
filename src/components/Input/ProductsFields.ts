import { FieldItem } from "./BasicField.types";

export const productsFields = (
  name: string,
  setName: (v: string) => void,
  price: number,
  setPrice: (v: number) => void,
  stock: number,
  setStock: (v: number) => void,
  category: string,
  setCategory: (v: string) => void,
  description: string,
  setDescription: (v: string) => void
): FieldItem[] => [
  {
    id: "name",
    label: "상품명",
    type: "text",
    value: name,
    onChange: (e) => setName(e.target.value),
  },
  {
    id: "price",
    label: "가격(센트)",
    type: "number",
    value: price,
    onChange: (e) => setPrice(Number(e.target.value)),
  },
  {
    id: "stock",
    label: "재고",
    type: "number",
    value: stock,
    onChange: (e) => setStock(Number(e.target.value)),
  },
  {
    id: "category",
    label: "카테고리",
    type: "text",
    value: category,
    onChange: (e) => setCategory(e.target.value),
  },
  {
    id: "description",
    label: "설명",
    type: "textarea",
    value: description,
    onChange: (e) => setDescription(e.target.value),
  },
];
