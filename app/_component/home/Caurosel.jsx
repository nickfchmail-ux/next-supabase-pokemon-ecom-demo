'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getPokemonAction } from '../../_lib/actions';
import styles from './carousel.module.scss';

const typeColors = {
  grass: 'bg-emerald-500', // fresh, natural green
  fire: 'bg-orange-500', // bold flame orange
  water: 'bg-blue-600', // deep aquatic blue
  electric: 'bg-amber-400', // bright lightning yellow
  normal: 'bg-gray-400', // neutral gray
  bug: 'bg-lime-500', // lively lime green
  flying: 'bg-sky-400', // airy sky blue
  poison: 'bg-purple-500', // strong toxic purple
  ground: 'bg-amber-700', // earthy brown
  fairy: 'bg-pink-400', // soft magical pink
  fighting: 'bg-red-600', // intense battle orange-red
  psychic: 'bg-fuchsia-500', // mystical fuchsia
  rock: 'bg-stone-500', // solid stone gray
  ghost: 'bg-indigo-600', // eerie indigo
  ice: 'bg-cyan-300', // cool icy cyan
  dragon: 'bg-violet-700', // majestic deep purple
  dark: 'bg-slate-900', // shadowy dark slate
  steel: 'bg-zinc-500', // metallic zinc gray
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemFadeUp = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9 } },
};

const textVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1, delay: 0.4 },
  },
};

export default function Carousel({ initialPokemons = [] }) {
  const { data: pokemons } = useQuery({
    queryKey: ['pokemons'],
    queryFn: async () => {
      const response = await getPokemonAction();
      return response?.data || [];
    },
    initialData: initialPokemons,
  });

  const [active, setActive] = useState(1);
  const [direction, setDirection] = useState(null);
  const [userInteractionTick, setUserInteractionTick] = useState(0);

  useEffect(() => {
    if (pokemons.length <= 1) return;

    const intervalId = setInterval(() => {
      setActive((prev) => {
        setDirection('right');
        return prev >= pokemons.length - 1 ? 0 : prev + 1;
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, [pokemons.length, userInteractionTick]);

  const handleManualSlide = (newDirection) => {
    setActive((prev) => {
      setDirection(newDirection);
      if (newDirection === 'left') {
        return prev <= 0 ? pokemons.length - 1 : prev - 1;
      } else {
        return prev >= pokemons.length - 1 ? 0 : prev + 1;
      }
    });
    // Trigger useEffect re-run to reset the timer
    setUserInteractionTick((tick) => tick + 1);
  };

  // Safely get the current Pokemon's primary species/type to determine background color
  const currentPokemon = pokemons[active];
  const primarySpecies = currentPokemon?.species?.[0]?.toLowerCase() || 'normal';
  const bgColorClass = typeColors[primarySpecies] || 'bg-gray-200';
  const prevColorClass =
    typeColors[
      pokemons[active - 1 < 0 ? pokemons.length - 1 : active - 1]?.species?.[0]?.toLowerCase()
    ] || 'bg-gray-200';
  return (
    <div className="relative">
      <div
        key={`  ${active}-previous`}
        className={`absolute inset-0 z-0 flex items-center ${prevColorClass || 'bg-gray-200'}`}
      >
        <div className={`pl-[200px] 2xl:flex 2xl:flex-col hidden `}>
          <div className={`border-b border-b-gray-300 w-max mb-2 items-center`}>
            {pokemons[active - 1 < 0 ? pokemons.length - 1 : active - 1]?.name}
          </div>
          <div>Attack: {pokemons[active - 1 < 0 ? pokemons.length - 1 : active - 1]?.attack}</div>
          <div>Defense: {pokemons[active - 1 < 0 ? pokemons.length - 1 : active - 1]?.defense}</div>
          <div>Speed: {pokemons[active - 1 < 0 ? pokemons.length - 1 : active - 1]?.speed}</div>
        </div>
      </div>

      <div
        key={`  ${active}-current`}
        className={`absolute inset-0 z-1 flex items-center ${styles.animatedBg} ${bgColorClass}`}
      >
        <div className={`pl-[200px] 2xl:flex 2xl:flex-col hidden `}>
          <div className={`border-b border-b-gray-300 w-max mb-2 `}>{pokemons[active]?.name}</div>
          <div>Attack: {pokemons[active]?.attack}</div>
          <div>Defense: {pokemons[active]?.defense}</div>
          <div>Speed: {pokemons[active]?.speed}</div>
        </div>
      </div>

      {/* Static fallback background to prevent flashing during animation */}
      <div
        className={`absolute inset-0 -z-10 ${bgColorClass} opacity-50 transition-colors duration-500`}
      />

      {/* Featured Pokémon Section (Content Layer) */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={container}
        className="relative z-10 bg-transparent"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.h2
            variants={headingVariants}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center pt-5"
          >
            Pokémon - on sale
          </motion.h2>
          <div className="flex justify-between items-center gap-10 mt-5 pb-0">
            <button
              className="bg-transparent hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center min-w-[120px]"
              onClick={() => handleManualSlide('left')}
            >
              &larr;
            </button>
            <button
              className="bg-transparent hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center min-w-[120px]"
              onClick={() => handleManualSlide('right')}
            >
              &rarr;
            </button>
          </div>
          <div className="relative overflow-hidden w-full h-[500px] mt-10 p-4  rounded-xl bg-transparent">
            {pokemons.map((pokemon, index) => {
              const name = pokemon.name;
              const current = active;
              const before = active - 1 < 0 ? pokemons.length - 1 : active - 1;
              const after = active + 1 >= pokemons.length ? 0 : active + 1;

              const show = index === current || index === before || index === after;

              let animationClass = '';
              if (direction === 'right') {
                if (index === active) animationClass = styles.activeFromSlidingRight;
                else if (index === before) animationClass = styles.beforeFromSlidingRight;
                else if (index === after) animationClass = styles.afterFromSlidingRight;
              } else if (direction === 'left') {
                if (index === active) animationClass = styles.activeFromSlidingLeft;
                else if (index === before) animationClass = styles.beforeFromSlidingLeft;
                else if (index === after) animationClass = styles.afterFromSlidingLeft;
              } else {
                if (index === active) animationClass = styles.staticActive;
                else if (index === before) animationClass = styles.staticBefore;
                else if (index === after) animationClass = styles.staticAfter;
              }

              return (
                <Link href={`/shop/${pokemon.id}`} key={pokemon.image} className="block">
                  <div
                    key={name}
                    className={`absolute top-1/2 left-1/2 w-[300px]  rounded-2xl shadow-xl overflow-hidden will-change-transform ${show ? 'block' : 'hidden'} ${animationClass}`}
                  >
                    <div
                      className={`${index !== current ? 'bg-white' : 'bg-transparent'} w-full cursor-pointer hover:opacity-90 transition-opacity`}
                    >
                      <Image
                        src={pokemon.image}
                        alt={name}
                        width={300}
                        height={300}
                        className={`object-cover w-full`}
                      />
                    </div>

                    <div
                      className={`flex flex-row mt-auto items-end self-start p-4 ${index === current ? 'bg-transparent' : 'bg-white bg-opacity-80'}`}
                    >
                      <div>
                        <h3 className={`text-md font-semibold text-gray-900`}>
                          <span aria-hidden="true" className={` absolute inset-0 `}></span>
                          {name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 flex gap-2">
                          {pokemon.species.map((type) => (
                            <Image
                              src={`/${type}.png`}
                              alt={type}
                              width={70}
                              height={50}
                              key={type}
                            />
                          ))}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
