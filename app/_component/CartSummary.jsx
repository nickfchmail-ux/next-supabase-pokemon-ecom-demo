'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { createOrderAction } from '../_lib/actions';
import useGetPokemon from '../_state/_remote/pokemon/useGetPokemon';
import Loading from '../loading';
import ClearCartButton from './ClearCartButton';
import LoginNavigation from './LoginNavigation';

export default function CartSummary({ user }) {
  if (!user) return <LoginNavigation />;

  const queryClient = useQueryClient();
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.cart);
  const { pokemonList } = useGetPokemon();

  const { mutateAsync: createOrder, isLoading: isLoadingStripePayment } = useMutation({
    mutationFn: createOrderAction,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      router.push(`/checkout?orderId=${data.orderId}`);
    },
  });

  if (!pokemonList || pokemonList.length === 0) return <Loading />;

  const cartMap = {};
  cartItems.forEach((item) => {
    cartMap[item.id] = item.quantity;
  });

  let totalRegularPrice = 0,
    totalDiscountSavings = 0,
    billingAmount = 0;

  pokemonList.forEach((pokemon) => {
    const qty = cartMap[pokemon.id] || 0;
    if (qty === 0) return;
    const price = pokemon.pokemons_selling.regular_price;
    const discount = pokemon.pokemons_selling.discount;
    totalRegularPrice += price * qty;
    totalDiscountSavings += (price * qty * discount) / 100;
    billingAmount += price * qty * (1 - discount / 100);
  });

  if (cartItems.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

      {/* Price Breakdown */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>${totalRegularPrice.toFixed(2)}</span>
        </div>
        {totalDiscountSavings > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${totalDiscountSavings.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>
        <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-semibold text-gray-900">
          <span>Total</span>
          <span>${billingAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={() => createOrder({ orderedItems: cartItems })}
        disabled={isLoadingStripePayment}
        className="w-full mt-5 bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
      >
        {isLoadingStripePayment ? 'Processing...' : 'Proceed to Checkout'}
      </button>

      {/* Clear Cart */}
      <div className="mt-3 text-center">
        <ClearCartButton />
      </div>

      {/* Trust badges */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-3 text-xs text-gray-400">
        <span>🔒 Secure Checkout</span>
        <span>·</span>
        <span>🚚 Free Shipping</span>
      </div>
    </div>
  );
}
