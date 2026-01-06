'use client';

import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../_state/_global/cart/CartSlice';
export default function AddToCart({ id }) {
  const dispatch = useDispatch();
  const hasAlreadyAddToCart =
    useSelector((state) => state.cart.cart).filter((pokemon) => pokemon.id === id)?.length > 0;

  if (hasAlreadyAddToCart) return null;

  return (
    <button
      className="bg-gray-700  text-white px-3 py-1 rounded-sm shadow-md"
      onClick={() => {
        console.log('click!');
        dispatch(addToCart({ id: id }));
      }}
    >
      Add
    </button>
  );
}
