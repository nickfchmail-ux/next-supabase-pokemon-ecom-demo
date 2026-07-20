'use client';

import { useRouter } from 'next/navigation';

export default function NoCartItemsNotice() {
  const router = useRouter();

  return (
    <div className="flex-1 flex items-center justify-center w-full h-full bg-gray-50">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="text-7xl mb-6">🛒✨</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
        <p className="text-gray-500 mb-8 text-lg">Discover amazing Pokémon waiting just for you.</p>
        <button
          onClick={() => router.push('/shop')}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
        >
          ← Browse Shop
        </button>
      </div>
    </div>
  );
}
