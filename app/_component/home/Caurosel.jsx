'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

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

export default function Carousel() {
  return (
    <div>
      {/* Featured Pokémon Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={container}
        className="bg-white py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.h2
            variants={headingVariants}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center"
          >
            Featured Pokémon
          </motion.h2>
          <div className="mt-10 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 items-center  justify-center">
            {['Bulbasaur', 'Charmander', 'Squirtle', 'Pikachu'].map((name) => (
              <motion.div
                key={name}
                variants={itemFadeUp}
                className="group flex flex-col items-center relative justify-center  h-full"
              >
                <div className={`bg-amber-900 h-`}>
                  <Image
                    src={`https://img.pokemondb.net/artwork/large/${name.toLowerCase()}.jpg`}
                    alt={name}
                    width={400}
                    height={400}
                    className="object-cover "
                  />
                </div>

                <div className="flex flex-row mt-auto items-end self-start ">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href="#">
                        <span aria-hidden="true" className="absolute inset-0"></span>
                        {name}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {name === 'Bulbasaur'
                        ? 'Grass/Poison'
                        : name === 'Charmander'
                          ? 'Fire'
                          : name === 'Squirtle'
                            ? 'Water'
                            : 'Electric'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
