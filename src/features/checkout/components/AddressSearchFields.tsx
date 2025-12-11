import React from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";

interface Props {
  query: string;
  handleChange: (value: string) => void;
  suggestions: any[];
  handleSelect: (item: any) => void;
  loading: boolean;
}

const AddressSearchFields: React.FC<Props> = ({
  query,
  handleChange,
  suggestions,
  handleSelect,
  loading,
}) => (
  <Field className="relative ssss">
    <FieldLabel>Search address</FieldLabel>
    <InputGroup>
      <InputGroupInput
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search..."
        required
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
    {loading && (
      <div style={{ position: "absolute", right: "16px", top: "18px" }}>
        검색 중...
      </div>
    )}
    {suggestions.length > 0 && (
      <div
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "white",
          border: "1px solid #ddd",
          borderRadius: "12px",
          marginTop: "8px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          zIndex: 1000,
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        {suggestions.map((item, i) => (
          <div
            key={i}
            onClick={() => handleSelect(item)}
            style={{
              padding: "14px 20px",
              cursor: "pointer",
              borderBottom:
                i < suggestions.length - 1 ? "1px solid #eee" : "none",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f8f9fa")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "white")
            }
          >
            <div style={{ fontWeight: 600 }}>
              {item.placePrediction.structuredFormat?.mainText?.text ||
                item.placePrediction.text.text}
            </div>
            <div style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>
              {item.placePrediction.structuredFormat?.secondaryText?.text}
            </div>
          </div>
        ))}
      </div>
    )}
  </Field>
);

export default AddressSearchFields;
