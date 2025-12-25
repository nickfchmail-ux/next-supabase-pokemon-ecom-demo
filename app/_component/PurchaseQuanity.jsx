import { useDispatch, useSelector } from 'react-redux';
import { setQuantity } from '../_state/_global/cart/CartSlice';

export default function PurchaseQuanity({ id, view }) {
  const cart = useSelector((state) => state.cart.cart);
  const purchaseQuantity = cart.filter((item) => item.id === id)?.at(0)?.quantity;

  const dispatch = useDispatch();

  return (
    <span className={`w-max ${view?.toLowerCase() !== 'cart' ? 'absolute top-0 left-0' : ''} `}>
      Qty.
      <input
        type="text"
        value={purchaseQuantity}
        onChange={(e) => dispatch(setQuantity({ id: id, quantity: e.target.value }))}
        className={`w-15 `}
      />
    </span>
  );
}
