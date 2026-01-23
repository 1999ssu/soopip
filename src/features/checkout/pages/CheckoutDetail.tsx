import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import {
  deleteAddress,
  setSelectedAddress,
  confirmAddress,
  loadUserAddresses,
  updateUserAddress,
  saveAddress,
} from "@/routes/store/addressStore";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PlusIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AddressForm from "../components/AddressForm";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import EditAddressList from "../components/EditAddressList";
import { auth } from "@/lib/firebase";

interface CartItem {
  id: string;
  name: string;
  price: number; // 센트 단위
  quantity: number;
  imageUrl: string;
}
interface CheckoutFormProps {
  items: CartItem[];
}

//수정 추가
interface Address {
  id: string;
  info: { firstName: string; lastName: string; phoneNum: string };
  address: { address: string; city: string; state: string; postalCode: string };
  detail: string;
  placeId?: string;

  //1.19 추가
  isDefault?: boolean;
}

const CheckoutDetail = ({ items }: CheckoutFormProps) => {
  const dispatch = useAppDispatch();

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const [openItem, setOpenItem] = useState<string | null>(null);
  const [addressFormOpen, setAddressFormOpen] = useState(false);

  const subTotal =
    items.reduce((sum, item) => sum + item.price * item.quantity, 0) / 100;
  const total = subTotal + 10 + subTotal * 0.13;

  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

  const [editingAddressId, setEditingAddressId] = useState<string | null>(null); // 수정 중인 주소 ID

  const [mode, setMode] = useState<"add" | "edit">("add");
  const goToAdd = () => {
    setMode("add");
    setEditingAddressId(null); // ← 이거 추가! (중요!!)
  };

  const formRef = useRef(null);

  const {
    addresses,
    defaultAddressId,
    selectedAddressId,
    confirmedAddressId,
    loading: addressLoading,
  } = useAppSelector((state) => state.address);

  const displayAddress: Address | null =
    addresses.length > 0
      ? addresses.find((a) => a.id === confirmedAddressId) ||
        addresses.find((a) => a.id === defaultAddressId) ||
        addresses[0] ||
        null
      : null;

  // 로그인 상태일 때 주소 불러오기 (최초 1회)
  useEffect(() => {
    if (auth.currentUser) {
      dispatch(loadUserAddresses());
    }
  }, [dispatch]);

  const handleAddressClick = async () => {
    const result = formRef.current?.getValues();
    if (!result) return;

    const { info, address, detail, placeId, isDefault } = result;

    // 필수 필드 검사
    if (!info?.firstName || !info?.lastName || !info?.phoneNum) {
      alert("이름, 성, 전화번호는 필수입니다.");
      return;
    }
    if (
      !address?.address ||
      !address?.city ||
      !address?.state ||
      !address?.postalCode
    ) {
      alert("주소 검색을 완료해주세요.");
      return;
    }

    const addressData = {
      info,
      address,
      detail: detail || "",
      placeId: placeId || undefined,
    };

    try {
      if (editingAddressId) {
        await dispatch(
          updateUserAddress({ ...addressData, id: editingAddressId }, isDefault)
        );
      } else {
        await dispatch(saveAddress(addressData, isDefault));
      }

      dispatch(setSelectedAddress(editingAddressId || "new-id")); // 실제 ID는 thunk에서 처리됨
      dispatch(confirmAddress());

      setEditingAddressId(null);
      setAddressFormOpen(false);
    } catch (error) {
      alert("주소 저장에 실패했습니다.");
    }
  };

  ////////////////////////////////////////////////

  const handleCheckout = async () => {
    if (!userInfo.name || !userInfo.email || !userInfo.address) {
      return alert("이름, 이메일, 주소는 필수입니다.");
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://us-central1-soopip.cloudfunctions.net/createCheckoutSession",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, userInfo }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "결제 세션 생성 실패");
      }

      const data = await res.json();
      if (!data.url) throw new Error("결제 URL이 존재하지 않습니다.");

      // Stripe 결제 페이지로 이동
      window.location.href = data.url;
    } catch (err: any) {
      alert(err.message || "결제 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-[1040px] mx-auto px-[20px]">
      <div className="flex flex-row gap-14">
        <div className="w-7/12">
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel className="text-lg font-bold">
                  Shipping address
                </FieldLabel>
                <Sheet
                  open={addressFormOpen}
                  onOpenChange={(open) => {
                    setAddressFormOpen(open);
                    if (!open) {
                      // Sheet 닫힐 때 항상 초기화
                      setMode("add");
                      setEditingAddressId(null);
                    }
                  }}
                >
                  {addresses.length === 0 ? (
                    // 1. 주소 없을 때: Add 버튼 (기존 그대로)
                    <SheetTrigger asChild>
                      <Button className="w-full h-[100px] flex flex-col justify-center bg-[#f8f9fa] border-[#e7e9ec] hover:bg-gray-100">
                        <PlusIcon className="w-6 h-6 mb-2" />
                        <span>Add new address</span>
                      </Button>
                    </SheetTrigger>
                  ) : (
                    // 주소 있을 때: 카드는 그냥 표시용, "Edit" 문구만 트리거
                    <div className="relative w-full h-[100px] bg-[#f8f9fa] border border-[#e7e9ec] rounded-md p-4 flex justify-between items-center">
                      {/* 주소 정보 표시 (클릭 안 됨) */}
                      <div className="flex flex-col justify-between h-full pr-20">
                        {/* Edit 공간 확보 */}
                        {displayAddress && (
                          <>
                            <p className="font-semibold">
                              {displayAddress.info.firstName}{" "}
                              {displayAddress.info.lastName}
                              {displayAddress.id === defaultAddressId && (
                                <span className="ml-3 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                  Default
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-600">
                              +1 {displayAddress.info.phoneNum}
                            </p>
                            <p className="text-sm text-gray-600">
                              {[
                                displayAddress.detail,
                                displayAddress.address?.address,
                                displayAddress.address?.city,
                                `${displayAddress.address?.state}, ${displayAddress.address?.postalCode}`,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          </>
                        )}
                      </div>

                      {/* Edit 문구만 SheetTrigger → 클릭 시 바로 수정 폼 열림 */}
                      <SheetTrigger asChild>
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
                          onClick={() => {
                            const defaultAddr =
                              addresses.find(
                                (a) => a.id === defaultAddressId
                              ) || addresses[0];
                            setEditingAddressId(defaultAddr.id);
                            setMode("edit"); // AddressForm 사용
                            // setAddressFormOpen(true); ← SheetTrigger가 자동으로 열어줌
                          }}
                        >
                          Edit
                        </button>
                      </SheetTrigger>
                    </div>
                  )}
                  <SheetContent className="bg-white overflow-y-auto">
                    {/* <SheetTitle>Add new Address</SheetTitle> */}
                    <SheetTitle>
                      {mode === "add" ? "ADD NEW ADDRESS" : "EDIT MY ADDRESS"}
                    </SheetTitle>
                    {mode === "add" ? (
                      <AddressForm
                        ref={formRef}
                        initialData={
                          editingAddressId
                            ? addresses.find(
                                (a) => a.id === editingAddressId
                              ) || null
                            : null
                        }
                        isDefault={
                          editingAddressId
                            ? addresses.find((a) => a.id === editingAddressId)
                                ?.id === defaultAddressId
                            : false
                        }
                      />
                    ) : (
                      <EditAddressList
                        addresses={addresses}
                        defaultAddressId={defaultAddressId}
                        selectedAddressId={selectedAddressId}
                        // onSelect={setSelectedAddressId} // radio
                        onSelect={(id) => dispatch(setSelectedAddress(id))}
                        onEdit={(id) => {
                          setEditingAddressId(id);
                          setMode("add");
                        }}
                        // onDelete={(id) => {
                        //   setAddresses((prev) =>
                        //     prev.filter((a) => a.id !== id)
                        //   );
                        //   if (id === defaultAddressId)
                        //     setDefaultAddressId(null);
                        //   if (id === selectedAddressId)
                        //     setSelectedAddressId(null);
                        // }}
                        onDelete={(id) => dispatch(deleteAddress(id))}
                        onBackClick={goToAdd}
                        // onSave={() => {
                        //   // ⭐ Save 버튼 눌렀을 때
                        //   setConfirmedAddressId(
                        //     selectedAddressId ||
                        //       defaultAddressId ||
                        //       addresses[0]?.id ||
                        //       null
                        //   );
                        //   setAddressFormOpen(false);
                        // }}
                        onSave={() => {
                          dispatch(confirmAddress());
                          setAddressFormOpen(false);
                        }}
                      />
                    )}
                    {/* <AddressForm ref={formRef} /> */}
                    <SheetFooter>
                      {mode === "add" && (
                        <Button type="button" onClick={handleAddressClick}>
                          {editingAddressId ? "Save Changes" : "Add Address"}
                        </Button>
                      )}
                      <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </Field>
              <Field>
                <FieldLabel className="text-lg font-bold">
                  Shipping Method
                </FieldLabel>
                <Accordion
                  type="single"
                  collapsible
                  className="w-full border border-solid border-[#e7e9ec] p-5"
                  defaultValue="item-1"
                  value={openItem}
                  onValueChange={setOpenItem}
                >
                  <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="flex items-start pt-0 pb-0">
                      <div>
                        <div>
                          <h3>
                            International Shipping - <span>FREE</span>
                          </h3>
                          <span className="flex text-xs text-[#7a808b]">
                            Ships in an average of 6 days. (※ within 3–9 days,
                            excluding weekends/holidays)
                          </span>
                        </div>
                        {openItem !== "item-1" && (
                          <div className="mt-5 grid grid-cols-[repeat(5,40px)] gap-2 height-[50px]">
                            {items.map((item) => (
                              <img
                                className="w-full h-full"
                                key={item.id}
                                src={item.imageUrl}
                                alt={item.name}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance pb-0 mt-5">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <div className="flex gap-4">
                            <p className="w-[40px] h-[50px]">
                              <img src={item.imageUrl} alt={item.name} />
                            </p>
                            <p className="flex flex-col justify-center">
                              <span className="font-bold">{item.name} </span>
                              <span>QTY {item.quantity}</span>
                            </p>
                          </div>

                          <span>
                            ${((item.price * item.quantity) / 100).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Field>
            </FieldGroup>
          </form>
        </div>
        <div className="w-5/12 flex-1 mt-6">
          <Card className="shadow-none rounded-[4px] border-[#e7e9ec]">
            <CardHeader>
              <CardTitle className="text-xl text-center justify-between">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="w-full">
              <div className=" flex flex-row justify-between items-center">
                <p>Subtotal</p>
                <p>
                  $<span>{subTotal.toFixed(2)}</span>
                </p>
              </div>
              <div className="flex flex-row justify-between items-center pt-2">
                <p>Shipping</p>
                {subTotal > 100 ? <p>FREE</p> : <p>$10</p>}
              </div>
              <div className="flex flex-row justify-between items-center pt-2">
                <p>Taxes</p>
                <p>13%</p>
              </div>
            </CardContent>
            <CardFooter className="w-full flex flex-row justify-between items-center pt-2">
              <p>
                Total (<span>{totalQty}</span>)
              </p>
              <p>
                CAD $<span>{total.toFixed(2)}</span>
              </p>
            </CardFooter>
          </Card>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full h-[48px] bg-black text-white p-2 relative top-[75px]"
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDetail;
