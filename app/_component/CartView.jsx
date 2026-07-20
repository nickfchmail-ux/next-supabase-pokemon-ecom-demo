'use client';
import { useSelector } from 'react-redux';
import CartList from './CartList';
import CartSummary from './CartSummary';

export default function CartView({ children }) {
  const hasCartItem = useSelector((state) => state.cart.cart).length > 0;
  const { cartFromDatabase, user } = children;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Page Header — shrink-0 keeps it from compressing */}
      <div className="bg-white border-b border-gray-200 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Shopping Cart</h1>
          <p className="text-sm text-gray-500 mt-1">
            {hasCartItem ? 'Review your items and proceed to checkout' : 'Your cart is empty'}
          </p>
        </div>
      </div>

      {/* Main Content — flex-1 fills remaining, overflow-hidden prevents page scroll */}
      <div className="flex-1 overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className={`h-full ${hasCartItem ? 'lg:grid lg:grid-cols-12 lg:gap-8' : ''}`}>
          {/* Cart Items — scrollable column */}
          <div
            className={`${hasCartItem ? 'lg:col-span-8 h-full overflow-y-auto pr-1 space-y-4' : ''}`}
          >
            <CartList cartData={cartFromDatabase} />
          </div>

          {/* Order Summary — sticky */}
          {hasCartItem && (
            <div className="lg:col-span-4 mt-6 lg:mt-0">
              <div className="lg:sticky lg:top-4">
                <CartSummary user={user} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
