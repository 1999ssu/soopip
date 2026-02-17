import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { decrement, increment } from "@/routes/store/productStore";
import { formatPrice } from "@/utils/formatPrice";

export const ProductQuantity = () => {
  const dispatch = useAppDispatch();
  const { quantity, totalPrice } = useAppSelector((state) => state.product);

  return (
    <div className="flex flex-col w-full items-center bg-[#f5f6dc] p-4 gap-4 border-2 border-[#852623]">
      <h3 className="w-full">ORDER AMOUNT</h3>
      <div className="w-full flex justify-between items-center gap-4">
        <div className="w-[100px] bg-[#f5f6dc] border flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => dispatch(decrement())}
            disabled={quantity === 1}
          >
            <Minus />
          </Button>

          <span>{quantity}</span>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => dispatch(increment())}
          >
            <Plus />
          </Button>
        </div>
        <p className=" font-bold">{formatPrice(totalPrice)}</p>
      </div>
    </div>
  );
};
