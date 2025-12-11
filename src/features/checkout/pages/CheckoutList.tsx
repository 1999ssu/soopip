import { useLocation, useNavigate } from "react-router-dom";
import CheckoutDetail from "./CheckoutDetail";

const CheckoutList = () => {
  const { state } = useLocation() as { state?: { items: any[] } };
  const navigate = useNavigate();

  if (!state?.items || state.items.length === 0) {
    navigate("/cart");
    return null;
  }

  return <CheckoutDetail items={state.items} />;
};

export default CheckoutList;
