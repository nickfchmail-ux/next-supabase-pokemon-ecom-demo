import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useDispatch } from 'react-redux';
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from '../_state/_global/cart/CartSlice';
export default function AmendCartQuanityButton({ id, view }) {
  const dispatch = useDispatch();

  return (
    <div className={`flex gap-x-3 flex-wrap `}>
      <div className={`flex w-full gap-1 place-items-center `}>
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

        <button
          className={` hover:text-red-400 active:scale-95 flex place-items-center px-2 px-1 rounded-2xl mb-1`}
          onClick={() => dispatch(removeFromCart({ id: id }))}
        >
          <DeleteOutlineIcon />
        </button>
      </div>
    </div>
  );
}
