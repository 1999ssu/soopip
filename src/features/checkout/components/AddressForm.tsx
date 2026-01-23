import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  useEffect,
} from "react";
import { FieldGroup, FieldSet, FieldLegend } from "@/components/ui/field";
import InfoFields from "../components/InfoFields";
import AddressSearchFields from "../components/AddressSearchFields";
import AddressFields from "../components/AddressFields";
import { useAddressAutocomplete } from "../hooks/useAddressAutocomplete";
import { InfoComponent } from "../types/info";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AddressFormProps {
  initialData?: {
    info: InfoComponent;
    address: any; // 실제 타입은 hook에 따라 다름
    detail: string;
    placeId?: string; // ← 추가! (edit 모드에서 필요)
  } | null;
  isDefault?: boolean;
  onDefaultChange?: (checked: boolean) => void;
}

const AddressForm = forwardRef(
  (
    {
      initialData,
      isDefault: propIsDefault,
      onDefaultChange,
    }: AddressFormProps,
    ref
  ) => {
    const [detailQuery, setDetailQuery] = useState(initialData?.detail || "");
    const [infoComponents, setInfoComponents] = useState<InfoComponent>(
      initialData?.info || { firstName: "", lastName: "", phoneNum: "" }
    );
    const [isDefault, setIsDefault] = useState(false);

    const {
      query,
      suggestions,
      selected,
      loading,
      handleChange,
      handleSelect,
      handleEditableChange,
      setSelected, // 초기값 설정을 위해 필요
    } = useAddressAutocomplete();

    // initialData가 있을 때 (edit 모드) 폼에 값 채우기
    // selected만 별도 effect로 초기화 (외부 훅 상태라서 필요)
    useEffect(() => {
      if (initialData?.address && initialData?.placeId) {
        setSelected({
          components: initialData.address,
          placeId: initialData.placeId,
        });
      } else if (!initialData) {
        // add 모드일 때 초기화
        setSelected(null);
      }
    }, [initialData?.address, initialData?.placeId, setSelected]);

    const handleInfoChange = (field: keyof InfoComponent, value: string) => {
      setInfoComponents((prev) => ({ ...prev, [field]: value }));
    };

    useImperativeHandle(ref, () => ({
      getValues() {
        return {
          info: infoComponents,
          address: selected?.components,
          detail: detailQuery,
          placeId: selected?.placeId,
          isDefault, // 체크박스 값도 함께 반환!
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
              <div className="mt-8 flex items-center space-x-2">
                <Checkbox
                  id="default-address"
                  checked={isDefault}
                  onCheckedChange={(checked) => {
                    const boolChecked = checked as boolean;
                    setIsDefault(boolChecked);
                    onDefaultChange?.(boolChecked);
                  }}
                />
                <Label
                  htmlFor="default-address"
                  className="text-base font-medium cursor-pointer"
                >
                  Set as default shipping address
                </Label>
              </div>
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
  }
);
AddressForm.displayName = "AddressForm";
export default AddressForm;
