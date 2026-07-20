'use client';

import { useDispatch, useSelector } from 'react-redux';

export default function PurchaseQuanity({ id, view }) {
  const cart = useSelector((state) => state.cart.cart);
  const purchaseQuantity = cart.filter((item) => item.id === id)?.at(0)?.quantity;

  const dispatch = useDispatch();

  if (!purchaseQuantity) return null;

  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-700">
      <span className="text-gray-400">Qty:</span>
      <span className="text-gray-900 font-semibold">{purchaseQuantity}</span>
    </span>
  );
}
