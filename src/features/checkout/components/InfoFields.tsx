import React from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InfoComponent } from "../types/info";

interface Props {
  infoComponents: InfoComponent;
  handleInfoChange: (field: keyof InfoComponent, value: string) => void;
}

const InfoFields: React.FC<Props> = ({ infoComponents, handleInfoChange }) => (
  <>
    <Field>
      <FieldLabel>First Name</FieldLabel>
      <Input
        value={infoComponents.firstName}
        onChange={(e) => handleInfoChange("firstName", e.target.value)}
        placeholder="Enter your first name."
        required
      />
    </Field>
    <Field>
      <FieldLabel>Last Name</FieldLabel>
      <Input
        value={infoComponents.lastName}
        onChange={(e) => handleInfoChange("lastName", e.target.value)}
        placeholder="Enter your last name."
        required
      />
    </Field>
    <div className="grid grid-cols-2 gap-4 items-end">
      <Field>
        <FieldLabel>Phone Number</FieldLabel>
        <Input disabled placeholder="+1" />
      </Field>
      <Field>
        <Input
          value={infoComponents.phoneNum}
          onChange={(e) => handleInfoChange("phoneNum", e.target.value)}
          placeholder="Please enter your mobile phone"
          required
        />
      </Field>
    </div>
  </>
);

export default InfoFields;
