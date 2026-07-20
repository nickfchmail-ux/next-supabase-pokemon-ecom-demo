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
      className={`w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] ${
        view?.toLowerCase() === 'detail'
          ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm px-8 py-3.5 text-base rounded-xl font-semibold transition-all active:scale-[0.98]'
          : 'bg-gray-700 text-primary-200 px-3 py-1 rounded-sm shadow-md hover:bg-primary-600'
      }`}
      onClick={() => {
        dispatch(addToCart({ id: id }));
      }}
    >
      Add to Cart
    </button>
  );
}
