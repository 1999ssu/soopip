import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PlusIcon } from "lucide-react";
import { useRef, useState } from "react";
import AddressForm from "../components/AddressForm";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
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

const CheckoutDetail = ({ items }: CheckoutFormProps) => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const [openItem, setOpenItem] = useState<string | null>(null);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };
  const formRef = useRef(null);
  const [addressData, setAddressData] = useState(null);

  const handleAddressClick = () => {
    const datas = formRef.current.getValues();

    setAddressData(datas);
    setAddressFormOpen(false);
    console.log("datas::", datas);
    console.log("addressData", addressData);
  };
  console.log("addressData", addressData);
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
                <Sheet open={addressFormOpen} onOpenChange={setAddressFormOpen}>
                  <SheetTrigger asChild>
                    {!addressData ? (
                      <Button className="w-full h-[100px] flex-col bg-[#f8f9fa] border-solid border-[#e7e9ec] shadow-none">
                        <div className="[--radius:9999rem] size-6">
                          <PlusIcon
                            className="w-full h-full rounded-md bg-[#c1c4c9] p-1"
                            color="white"
                          />
                        </div>
                        <span>Add new address</span>
                      </Button>
                    ) : (
                      <div className="flex w-full h-[100px] bg-[#f8f9fa] border border-solid border-[#e7e9ec] p-4 gap-6 justify-between">
                        <div className="flex flex-col justify-between ">
                          <p>
                            {addressData.info.firstName}
                            {addressData.info.lastName}
                          </p>
                          <p>+1 {addressData.info.phoneNum}</p>
                          <p>
                            {addressData.detail}, {addressData.address.address},{" "}
                            {addressData.detail}, {addressData.address.city},{" "}
                            {addressData.address.state},{" "}
                            {addressData.address.postalCode}
                          </p>
                        </div>
                        <div>
                          <button>Edit</button>
                        </div>
                      </div>
                    )}
                  </SheetTrigger>

                  <SheetContent className="bg-white overflow-y-auto">
                    <AddressForm ref={formRef} />
                    {/* <SheetTitle>Add new Address</SheetTitle> */}
                    <SheetFooter>
                      <Button type="button" onClick={handleAddressClick}>
                        Save changes
                      </Button>
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
                  $<span>1,744</span>
                </p>
              </div>
              <div className="flex flex-row justify-between items-center pt-2">
                <p>Shipping</p>
                <p>$10</p>
              </div>
              <div className="flex flex-row justify-between items-center pt-2">
                <p>Taxes</p>
                <p>13%</p>
              </div>
            </CardContent>
            <CardFooter className="w-full flex flex-row justify-between items-center pt-2">
              <p>
                Total <span>12</span>
              </p>
              <p>
                CAD $<span></span>
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
          {/* <div>
            <h2>Order Summary</h2>
            <dl>
              <dt>Subtotal</dt>
              <dd>$ <span>1,744</span></dd>
              <dt>Shipping</dt>
              <dd>$10</dd>
              <dt>Taxes</dt>
              <dd> </dd>
              <dt></dt>
              <dd></dd>
            </dl>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default CheckoutDetail;
