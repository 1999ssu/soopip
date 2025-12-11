import React from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { SelectedPlace } from "../types/address";

interface Props {
  selected: SelectedPlace;
  handleEditableChange: (field: string, value: string) => void;
  detailQuery: string;
  setDetailQuery: (val: string) => void;
}

const canadianProvinces = [
  { code: "ON", name: "Ontario" },
  { code: "QC", name: "Quebec" },
  { code: "BC", name: "British Columbia" },
  { code: "AB", name: "Alberta" },
  { code: "MB", name: "Manitoba" },
  { code: "SK", name: "Saskatchewan" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "NT", name: "Northwest Territories" },
  { code: "YT", name: "Yukon" },
  { code: "NU", name: "Nunavut" },
];

const AddressFields: React.FC<Props> = ({
  selected,
  handleEditableChange,
  detailQuery,
  setDetailQuery,
}) => (
  <>
    <Field>
      <FieldLabel>Address</FieldLabel>
      <Input
        placeholder="Enter your address."
        value={selected.components.address}
        onChange={(e) => handleEditableChange("address", e.target.value)}
        required
      />
      <Input
        value={detailQuery}
        onChange={(e) => setDetailQuery(e.target.value)}
        placeholder="Enter your details."
      />
    </Field>
    <Field>
      <FieldLabel>City</FieldLabel>
      <Input
        placeholder="Enter your city."
        value={selected.components.city}
        onChange={(e) => handleEditableChange("city", e.target.value)}
        required
      />
    </Field>
    <Field>
      <FieldLabel htmlFor="checkout-state">State</FieldLabel>
      <Select
        value={selected.components.state}
        onValueChange={(val) => handleEditableChange("state", val)}
      >
        <SelectTrigger id="checkout-state">
          <SelectValue placeholder="Select state" />
        </SelectTrigger>
        <SelectContent>
          {canadianProvinces.map((prov) => (
            <SelectItem key={prov.code} value={prov.name}>
              {prov.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
    <Field>
      <FieldLabel>Zip code</FieldLabel>
      <Input
        placeholder="Enter your zip code."
        value={selected.components.postalCode || "—"}
        onChange={(e) => handleEditableChange("postalCode", e.target.value)}
        required
      />
    </Field>
  </>
);

export default AddressFields;
