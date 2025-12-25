'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LuFilter } from 'react-icons/lu';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { useInView } from 'react-intersection-observer';
import { getPokemons } from '../_lib/data-client-service';
import Loading from '../loading';
import FilterCount from './FilterCount';
import { Modal, Open, Window } from './Modal';
import PokemonCard from './PokemonCard';
import TagFilter from './TagFilter';
export default function InfinitePokemonList({ species }) {
  const [expand, setExpand] = useState(false);
  const searchParams = useSearchParams();
  const tags = searchParams.getAll('tag');
  const headerRef = useRef(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error } = useInfiniteQuery({
    queryKey: ['pokemons', tags],
    queryFn: ({ pageParam }) => getPokemons({ pageParam, species: tags }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const { ref, inView } = useInView();
  useEffect(() => {
    if (headerRef.current) {
      document.addEventListener(
        'click',
        (e) => {
          if (expand && headerRef.current && !headerRef.current.contains(e.target)) {
            setExpand(false);
          }
        },
        true
      );
    }
  }, [expand, headerRef]);
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === 'pending') return <Loading />;
  if (status === 'error') return <div>Error: {error.message}</div>;

  const pokemons = data.pages.flatMap((page) => page.pokemons);
  const totalCount = data?.pages[0]?.totalCount ?? 0; // Same on every page
  const specialSpecies = data?.pages[0]?.speciesList ?? [];

  return (
    <>
      <div className="h-[87vh] flex flex-col">
        <header
          ref={headerRef}
          className="hidden pt-2  flex-col-reverse bg-gray-800 text-white md:flex sm:flex-col-reverse md:flex-row justify-evenly place-items-baseline"
        >
          <TagFilter expand={expand} specialSpecies={specialSpecies} />

          <button
            className="bg-amber-50 text-black mr-5 flex self-start mt-1"
            onClick={() => setExpand(!expand)}
          >
            {expand ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </button>

          <FilterCount displayedPokemon={pokemons.length} totalCount={totalCount} />
        </header>
        <div className="flex justify-start md:hidden pt-2  bg-gray-800">
          {' '}
          <FilterCount displayedPokemon={pokemons.length} totalCount={totalCount} view={'mobile'} />
          <Modal>
            <Open name={'test'}>
              <button className="bg-white h-[min-content] w-[min-content] m-2 p-2 rounded flex items-center gap-2 hover:bg-gray-200">
                <LuFilter />
              </button>
            </Open>
            <Window name={'test'}>
              <TagFilter expand={expand} specialSpecies={specialSpecies} view={'mobile'} />
            </Window>
          </Modal>
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {pokemons.map((pokemon) => (
              <PokemonCard
                key={pokemon.name}
                id={pokemon.id}
                url={pokemon.image}
                name={pokemon.name}
                description={pokemon.description || pokemon.descriptions}
                price={pokemon.pokemons_selling?.regular_price}
              />
            ))}
          </div>
          <div ref={ref} className="col-span-full text-center py-8">
            {isFetchingNextPage
              ? 'Loading more...'
              : hasNextPage
                ? 'Scroll for more'
                : 'No more items'}
          </div>
        </div>
      </div>
    </>
  );
}
