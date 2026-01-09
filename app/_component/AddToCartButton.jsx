'use client';

import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../_state/_global/cart/CartSlice';



export default function AddToCart({ id, view }) {
  const dispatch = useDispatch();
  const hasAlreadyAddToCart =
    useSelector((state) => state.cart.cart).filter((pokemon) => pokemon.id === id)?.length > 0;
  const cart = useSelector((state) => state.cart.cart);
  if (hasAlreadyAddToCart) return null;

  return (
    <button
      className={`  text-primary-200 px-3 py-1 rounded-sm shadow-md hover:bg-primary-600 ${view?.toLowerCase() === 'detail' ? 'bg-primary-400' : 'bg-gray-700'}`}
      onClick={() => {
        console.log('click!');
        dispatch(addToCart({ id: id }));
      }}
    >
      Add
    </button>
  );
}
