import React, { forwardRef, useState, useImperativeHandle } from "react";
import { FieldGroup, FieldSet, FieldLegend } from "@/components/ui/field";
import InfoFields from "../components/InfoFields";
import AddressSearchFields from "../components/AddressSearchFields";
import AddressFields from "../components/AddressFields";
import { useAddressAutocomplete } from "../hooks/useAddressAutocomplete";
import { InfoComponent } from "../types/info";

const AddressForm = forwardRef((props, ref) => {
  const [detailQuery, setDetailQuery] = useState("");
  const [infoComponents, setInfoComponents] = useState<InfoComponent>({
    firstName: "",
    lastName: "",
    phoneNum: "",
  });
  const {
    query,
    suggestions,
    selected,
    loading,
    handleChange,
    handleSelect,
    handleEditableChange,
  } = useAddressAutocomplete();

  const handleInfoChange = (field: keyof InfoComponent, value: string) => {
    setInfoComponents((prev) => ({ ...prev, [field]: value }));
  };

  const onClick = () => {
    console.log("click ::: ", selected?.components);
    console.log("detailQuery", detailQuery);
    console.log("info", infoComponents);
  };
  useImperativeHandle(ref, () => ({
    getValues() {
      return {
        info: infoComponents,
        address: selected?.components,
        detail: detailQuery,
      };
    },
  }));
  return (
    <div className="w-full max-w-md">
      <form>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>SETTING ADDRESS</FieldLegend>
            <FieldGroup>
              <InfoFields
                infoComponents={infoComponents}
                handleInfoChange={handleInfoChange}
              />
              <AddressSearchFields
                query={query}
                handleChange={handleChange}
                suggestions={suggestions}
                handleSelect={handleSelect}
                loading={loading}
              />
              {selected && (
                <AddressFields
                  selected={selected}
                  handleEditableChange={handleEditableChange}
                  detailQuery={detailQuery}
                  setDetailQuery={setDetailQuery}
                />
              )}
            </FieldGroup>
          </FieldSet>
        </FieldGroup>
      </form>
      {/* <div
        style={{
          padding: "40px",
          maxWidth: "640px",
          margin: "0 auto",
          fontFamily: "system-ui",
        }}
      >
        <button onClick={onClick}>save</button>
      </div> */}
    </div>
  );
});

export default AddressForm;
