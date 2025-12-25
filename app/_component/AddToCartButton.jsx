'use client';

import { useDispatch } from 'react-redux';
import { addToCart } from '../_state/_global/cart/CartSlice';
export default function AddToCart({ id }) {
  const dispatch = useDispatch();

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
