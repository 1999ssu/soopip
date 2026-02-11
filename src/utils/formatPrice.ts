export interface OrderSummary {
  subTotal: number; // 달러 단위
  shipping: number;
  tax: number;
  total: number;
  totalQty: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number; // 센트 단위
  quantity: number;
  imageUrl: string;
}

export const formatPrice = (value: number) => {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(value);
};

export const roundToCent = (amount: number): number => {
  // 1. 센트 단위 정수로 변환
  const cents = Math.round(amount * 100);

  const lastDigit = cents % 10;
  let adjustedCents = cents;

  if (lastDigit === 1 || lastDigit === 2) {
    adjustedCents = cents - lastDigit;
  } else if (lastDigit >= 3 && lastDigit <= 7) {
    adjustedCents = cents + (5 - lastDigit);
  } else if (lastDigit === 8 || lastDigit === 9) {
    adjustedCents = cents + (10 - lastDigit);
  }

  // 다시 달러 단위로
  return adjustedCents / 100;
};

export function calculateOrderSummary(items: CartItem[]): OrderSummary {
  const subTotalCents = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const subTotal = subTotalCents / 100;

  // 배송비 10달러 고정
  const shipping = subTotal > 100 ? 0 : 10;

  // 세금 13%
  const tax = parseFloat((subTotal * 0.13).toFixed(2));

  // 총액
  const total = parseFloat((subTotal + shipping + tax).toFixed(2));

  // 총 수량
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

  return { subTotal, shipping, tax, total, totalQty };
}
