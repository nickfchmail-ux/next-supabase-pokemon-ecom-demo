'use client';
import { useSelector } from 'react-redux';
import useGetPokemon from '../_state/_remote/pokemon/useGetPokemon';
import Loading from '../loading';
import CartItem from './CartItem';
export default function CartList() {
  const cart = useSelector((state) => state.cart.cart);
  console.log('cart: ', cart);
  const { pokemonList = [], isLoadingPokemon, errorForLoadingPokemon } = useGetPokemon();

  if (isLoadingPokemon) return <Loading />;

  return (
    <div className={`flex flex-col   bg-cyan-200 overflow-y-scroll overflow-x-hidden`}>
      {cart.map((item) => {
        const selectedPokemon = pokemonList?.filter((pokemon) => pokemon.id === item.id).at(0);

        return <CartItem key={item.id} item={selectedPokemon} />;
      })}
    </div>
  );
}
