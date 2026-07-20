import PokemonDetails from '../../_component/PokemonDetails';
import { getCartItems, getPokemonById } from '../../_lib/data-service';


export const dynamic = 'force-dynamic';
export const dynamicParams = false;

export async function generateMetadata(props) {
  const params = await props.params;
  const { itemId } = params;
  if (!itemId) return { title: 'Pokémon' };
  const { name } = await getPokemonById(itemId);

  return { title: `${name}` };
}


export default async function Page(props) {
  const params = await props.params;
  const { itemId } = params;

  const selectedPokemon = await getPokemonById(itemId);
  const cartFromDatabase = await getCartItems();
  return <PokemonDetails selectedPokemon={selectedPokemon} cartData={cartFromDatabase} />;
}
