import PokemonDetails from '../../_component/PokemonDetails';
import { getCartItems, getPokemonById } from '../../_lib/data-service';

export default async function Page({ params }) {
  const { itemId } = await params;

  const selectedPokemon = await getPokemonById(itemId);
  const cartFromDatabase = await getCartItems();
  return <PokemonDetails selectedPokemon={selectedPokemon} cartData={cartFromDatabase} />;
}
