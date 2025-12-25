import { useDispatch } from 'react-redux';
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from '../_state/_global/cart/CartSlice';

export default function AmendCartQuanityButton({ id, view }) {
  const dispatch = useDispatch();

  return (
    <div className={`flex gap-3 flex-wrap `}>
      <div>
        <button
          className={`hover:bg-red-500 hover:text-white active:scale-95 flex place-items-center px-2 px-1 rounded-2xl ${view?.toLowerCase() === 'mobile' ? 'absolute top-2 right-2' : ''}`}
          onClick={() => dispatch(removeFromCart({ id: id }))}
        >
          <i className="pi pi-delete-left" style={{ fontSize: '1.5rem' }}></i>
        </button>
      </div>
      <div className={`flex gap-1 ${view?.toLowerCase() === 'mobile' ? 'mt-3' : ''}`}>
        <button
          className={`hover:text-blue-500 active:scale-95`}
          onClick={() => dispatch(incrementQuantity({ id: id }))}
        >
          <i className="pi pi-cart-plus" style={{ fontSize: '1.5rem' }}></i>
        </button>
        <button
          className={`hover:text-red-500 active:scale-95`}
          onClick={() => dispatch(decrementQuantity({ id: id }))}
        >
          <i className="pi pi-cart-minus " style={{ fontSize: '1.5rem' }}></i>
        </button>
      </div>
    </div>
  );
}
