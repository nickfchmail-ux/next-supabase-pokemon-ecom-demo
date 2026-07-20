'use client';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';
import AmendCartQuanityButton from './AmendCartQuanityButton';
import BackButton from './BackButton';
import ElectricBorder from './ElectricBorder';
import PurchaseQuanity from './PurchaseQuanity';
import ScrambleText from './ScrambleText';
import Text from './Text';
import UserCursor from './UserCursor';

import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartItemsAction } from '../_lib/actions';
import { synchronizeRemoteCartData } from '../_state/_global/cart/CartSlice';

export default function PokemonDetails({ selectedPokemon, cartData }) {
  const { image, name, descriptions, species } = selectedPokemon;
  const price = selectedPokemon?.pokemons_selling?.regular_price ?? selectedPokemon?.price;
  const [hasDoneInitailCartUpdate, setHasDoneInitailCartUpdate] = useState(false);
  const dispatch = useDispatch();
  const unitedSpecies = new Set(species);
  const primaryType = species?.[0]?.toLowerCase() || 'normal';

  // Pokémon type → electric border colors
  const typeColors = {
    normal: { color: '#D4D4D4', glow: '#E5E5E5' },
    fire: { color: '#FF6B35', glow: '#FF9A5C' },
    water: { color: '#3B9AE1', glow: '#6EC6FF' },
    electric: { color: '#FFD700', glow: '#FFF44F' },
    grass: { color: '#4CAF50', glow: '#81C784' },
    ice: { color: '#7DD3FC', glow: '#BAE6FD' },
    fighting: { color: '#C62828', glow: '#EF5350' },
    poison: { color: '#9C27B0', glow: '#CE93D8' },
    ground: { color: '#8D6E63', glow: '#BCAAA4' },
    flying: { color: '#90CAF9', glow: '#BBDEFB' },
    psychic: { color: '#E91E63', glow: '#F48FB1' },
    bug: { color: '#8BC34A', glow: '#AED581' },
    rock: { color: '#795548', glow: '#A1887F' },
    ghost: { color: '#673AB7', glow: '#B39DDB' },
    dragon: { color: '#3F51B5', glow: '#7986CB' },
    dark: { color: '#424242', glow: '#757575' },
    steel: { color: '#90A4AE', glow: '#B0BEC5' },
    fairy: { color: '#F48FB1', glow: '#F8BBD0' },
  };

  const borderColors = typeColors[primaryType] || typeColors.normal;
  const cart = useSelector((state) => state.cart.cart);

  const { mutate: updatePokemon } = useMutation({
    mutationFn: updateCartItemsAction,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  useEffect(() => {
    if (!cartData) return;
    const previousCartItems = cartData.map((item) => ({
      id: item.pokemon_id,
      quantity: item.quantity,
    }));

    dispatch(synchronizeRemoteCartData(previousCartItems));
    setHasDoneInitailCartUpdate(true);
  }, []);

  useEffect(() => {
    if (!hasDoneInitailCartUpdate) return;
    if (cart?.length >= 0) {
      updatePokemon(cart);
    }
  }, [cart]);

  return (
    <UserCursor
      name="Adopt Me"
      color={borderColors.color}
      textColor="#FFFFFF"
      size={28}
      showLabel={true}
    >
      <div className="min-h-screen bg-white">
        {/* Top bar — sticky */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white/95 backdrop-blur md:px-8">
          <BackButton />
          <div className="flex-1 flex justify-center overflow-hidden mx-4">
            <ScrambleText
              words="Find Your Partner"
              color="#9CA3AF"
              fontSize={12}
              fontWeight={600}
              letterSpacing="0.15em"
              textAlign="center"
              enterMode="oneLine"
              enterDuration={1.5}
              enterScrambleIntensity={40}
              enterReplay={true}
              style={{ width: 'auto' }}
            />
          </div>
          <div className="w-8" />
        </div>

        {/* Main content: 2-column on md+, stacked on mobile */}
        <div className="flex flex-col md:flex-row">
          {/* LEFT COLUMN — Image */}
          <div className="md:w-1/2 md:sticky md:top-0 md:self-start bg-gray-50 flex flex-col items-center py-8 px-4 md:py-12 relative">
            {/* Type icons — top left */}
            <div className="absolute top-4 left-4 z-10 flex gap-1.5 md:top-6 md:left-8">
              {Array.from(unitedSpecies).map((spec) => (
                <Image
                  key={`${spec}-icon`}
                  src={`/${spec}.png`}
                  width={56}
                  height={56}
                  alt={spec}
                  className="drop-shadow-md"
                />
              ))}
            </div>

            <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
              <ElectricBorder
                key={selectedPokemon.id}
                color={borderColors.color}
                glowColor={borderColors.glow}
                speed={1.2}
                chaos={6}
                thickness={3}
                borderRadius={20}
                glow={true}
                glowIntensity={8}
              >
                <Image
                  src={image}
                  width={300}
                  height={300}
                  className="object-contain aspect-square w-full h-full"
                  alt={name}
                  priority
                />
              </ElectricBorder>
            </div>

            {/* Dot pagination */}
            <div className="flex gap-1.5 mt-4">
              <span className="w-2 h-2 rounded-full bg-gray-900" />
              <span className="w-2 h-2 rounded-full bg-gray-300" />
              <span className="w-2 h-2 rounded-full bg-gray-300" />
            </div>
          </div>

          {/* RIGHT COLUMN — Product Info */}
          <div className="md:w-1/2 px-5 pt-6 pb-12 md:px-10 md:pt-12 md:pb-16">
            {/* Title + Wishlist */}
            <div className="flex items-start justify-between mb-1">
              <h1 className="text-xl font-bold text-gray-900 leading-snug pr-4 md:text-2xl">
                {name}
              </h1>
              <button className="p-1.5 text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </button>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold text-gray-900 md:text-3xl">${price ?? '—'}</span>
              <span className="text-xs text-gray-400">by supplier</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="w-3.5 h-3.5 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs text-gray-400 ml-1">(128)</span>
            </div>

            {/* Type selector */}
            <div className="mb-6">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2.5">
                Type
              </p>
              <div className="flex gap-2">
                {Array.from(unitedSpecies).map((spec, idx) => {
                  const typeColor = typeColors[spec.toLowerCase()] || typeColors.normal;
                  return (
                    <button
                      key={`${spec}-chip`}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                        idx === 0 ? 'ring-2 ring-offset-1' : 'opacity-50 hover:opacity-80'
                      }`}
                      style={{
                        backgroundColor: `${typeColor.color}12`,
                        color: typeColor.color,
                      }}
                    >
                      {spec}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-end gap-4 mb-6">
              {cart.some((item) => item.id === selectedPokemon?.id) && (
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2.5">
                    Quantity
                  </p>
                  <div className="flex items-center gap-3">
                    <PurchaseQuanity id={selectedPokemon?.id} view={'detail'} />
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <div className="flex-1">
                  <AddToCartButton id={selectedPokemon?.id} view={'detail'} />
                </div>
                <AmendCartQuanityButton id={selectedPokemon?.id} alt={name} view={'detail'} />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                Description
              </h2>
              <div className="text-sm text-gray-500 leading-relaxed">
                <Text textArray={descriptions} />
              </div>
            </div>

            {/* Trust row */}
            <div className="flex items-center justify-center gap-3 mt-8 text-xs text-gray-300">
              <span>🚚 Free Shipping</span>
              <span>·</span>
              <span>🔄 30-Day Returns</span>
              <span>·</span>
              <span>✅ In Stock</span>
            </div>
          </div>
        </div>
      </div>
    </UserCursor>
  );
}
