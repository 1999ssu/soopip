// EditAddressList.tsx

import BasicSheetLayout from "@/components/Modal/BasicSheetLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SheetClose } from "@/components/ui/sheet";
import { Plus } from "lucide-react";

interface Address {
  id: string;
  info: { firstName: string; lastName: string; phoneNum: string };
  address: { address: string; city: string; state: string; postalCode: string };
  detail: string;
}

interface EditAddressListProps {
  addresses: Address[];
  defaultAddressId: string | null;
  selectedAddressId: string | null;

  onSelect: (id: string) => void; // ⭐ radio 선택
  // onSetDefault: (id: string) => void; // ⭐ default 지정
  onSave: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onBackClick: () => void;
}

const EditAddressList = ({
  addresses,
  defaultAddressId,
  selectedAddressId,
  onSelect,
  onSave,
  onSetDefault,
  onEdit,
  onDelete,
  onBackClick,
}: EditAddressListProps) => {
  return (
    <BasicSheetLayout
      showTitle={false}
      showFooter={true}
      footerContent={
        <div className="w-full flex gap-4">
          <div className="flex-1 border text-center  border-[#852623] text-[#852623]">
            <Button variant="outline" className="flex-1" onClick={onBackClick}>
              <Plus />
              Add New Address
            </Button>
          </div>
          <SheetClose className="bg-[#852623] text-[#f5f6dc]">
            <Button className="flex-1" onClick={onSave}>
              Save
            </Button>
          </SheetClose>
        </div>
      }
    >
      <RadioGroup
        value={selectedAddressId || undefined}
        onValueChange={onSelect}
      >
        {addresses.map((addr) => (
          <div
            key={addr.id}
            id={addr.id}
            className="flex gap-4 items-start mb-8 border-b pb-6 last:border-0"
          >
            <RadioGroupItem
              className="w-[28px] h-[28px] mt-1"
              value={addr.id}
              id={addr.id}
            />

            <div className="flex-1">
              <Label
                htmlFor={addr.id}
                className="text-lg font-bold cursor-pointer"
              >
                {addr.info.firstName} {addr.info.lastName}
                {addr.id === defaultAddressId && (
                  <span className="ml-3 inline-block bg-[#852623] text-[#f5f6dc] text-xs px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </Label>

              <p className="text-base text-gray-700">+1 {addr.info.phoneNum}</p>
              <p className="text-base text-gray-700">
                {[
                  addr.detail,
                  addr.address?.address,
                  addr.address?.city,
                  `${addr.address?.state}, ${addr.address?.postalCode}`,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              <div className="mt-4 flex gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-solid border-[1px] border-[#852623] bg-[#f5f6dc] text-[#852623] text-xs px-2 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit(addr.id);
                  }}
                >
                  Edit
                </Button>

                {/* 기본 주소가 아니면 삭제 버튼 표시 */}
                {addr.id !== defaultAddressId && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="border-solid border-[1px] border-[#852623] bg-[#f5f6dc] text-[#852623] text-xs px-2 rounded"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete(addr.id);
                    }}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </RadioGroup>
    </BasicSheetLayout>
  );
};

export default EditAddressList;
