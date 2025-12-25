import Image from 'next/image';
import BackButton from '../../_component/BackButton';
import Text from '../../_component/Text';
import { getPokemonById } from '../../_lib/data-service';
export async function generateMetadata({ params }) {
  const { itemId } = await params;

  const selectedPokemon = await getPokemonById(itemId);
  const { name } = selectedPokemon;

  return { title: `${name}` };
}

export default async function Page({ params }) {
  const { itemId } = await params;

  const selectedPokemon = await getPokemonById(itemId);

  const { image, name, descriptions } = selectedPokemon;

  return (
    <>
      <div className="bg-amber-300 flex min-h-[70vh]">
        <div className="bg-amber-600 flex flex-1 relative items-center justify-center min-w-50 max-w-100">
          <Image
            src={image}
            width={300}
            height={300}
            className="object-cover aspect-square h-auto"
            alt="image"
          />
          <h1 className="absolute top-5 bg-amber-300 p-2">{name}</h1>
        </div>
        <div className="">
          <Text textArray={descriptions} />
        </div>
      </div>
      <BackButton />
    </>
  );
}
