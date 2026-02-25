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
        placeholder="Enter Your First Name."
        required
      />
    </Field>
    <Field>
      <FieldLabel>Last Name</FieldLabel>
      <Input
        value={infoComponents.lastName}
        onChange={(e) => handleInfoChange("lastName", e.target.value)}
        placeholder="Enter Your Last Name."
        required
      />
    </Field>
    <Field>
      <FieldLabel>Phone Number</FieldLabel>
      <div className="flex gap-2">
        <Input disabled placeholder="+1" className="w-[50px]" />
        <Input
          value={infoComponents.phoneNum}
          onChange={(e) => handleInfoChange("phoneNum", e.target.value)}
          placeholder="Enter Your Mobile Phone"
          required
        />
      </div>
    </Field>
    {/* <Field></Field> */}
  </>
);

export default InfoFields;
