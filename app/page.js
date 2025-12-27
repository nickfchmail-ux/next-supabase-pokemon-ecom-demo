'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

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
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
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

export default function Page() {
  return (
    <div className="min-h-full bg-white">
      {/* Hero Section */}
      <motion.div
        className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={container}
      >
        <Image src="/header-sky.jpg" alt="" fill className="-z-10 object-cover" />
        {/* Background blur elements remain unchanged */}
        <div
          className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
          aria-hidden="true"
        >
          <div
            className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div
          className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
          aria-hidden="true"
        >
          <div
            className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className="mx-auto max-w-2xl text-center">
          <motion.h1
            variants={headingVariants}
            className="text-4xl font-bold tracking-tight text-gray-800 sm:text-6xl"
          >
            Find Your Perfect Pokémon Companion
          </motion.h1>
          <motion.p variants={textVariants} className="mt-6 text-2xl leading-8 text-gray-500">
            Explore our collection of ethically sourced Pokémon and start your adventure today.
            Fast, safe, and reliable delivery to your doorstep.
          </motion.p>
          <motion.div
            variants={itemFadeUp}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Link
              href="/shop"
              className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              Shop Now
            </Link>
            <Link href="/about" className="text-sm font-semibold leading-6 text-white">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>

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
          <div className="mt-10 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {/* Each card gets its own fade-up animation */}
            {['Bulbasaur', 'Charmander', 'Squirtle', 'Pikachu'].map((name, i) => (
              <motion.div key={name} variants={itemFadeUp} className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <Image
                    src={`https://img.pokemondb.net/artwork/large/${name.toLowerCase()}.jpg`}
                    alt={name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="mt-4 flex justify-between">
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
                  <p className="text-sm font-medium text-gray-900">
                    $
                    {name === 'Bulbasaur'
                      ? 45
                      : name === 'Charmander'
                        ? 50
                        : name === 'Squirtle'
                          ? 55
                          : 75}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={container}
        className="bg-gray-50 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <motion.h2
              variants={headingVariants}
              className="text-base font-semibold leading-7 text-indigo-600"
            >
              Your Adventure Awaits
            </motion.h2>
            <motion.p
              variants={headingVariants}
              className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
              Everything you need to start your Pokémon journey
            </motion.p>
            <motion.p variants={textVariants} className="mt-6 text-lg leading-8 text-gray-600">
              We provide only the highest quality, ethically sourced Pokémon, ready for a lifetime
              of companionship and adventure.
            </motion.p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {/* Each feature item fades in sequentially */}
              {[
                {
                  title: 'Ethically Sourced',
                  desc: 'All our Pokémon are raised with care and love...',
                },
                { title: 'Fast & Safe Delivery', desc: 'Your new companion will be delivered...' },
                { title: 'Expert Support', desc: 'Our team of Pokémon experts is here...' },
                { title: '24/7 Adventure Support', desc: 'Our support team is available 24/7...' },
              ].map((feature) => (
                <motion.div key={feature.title} variants={itemFadeUp} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                      {/* SVG icons unchanged */}
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">{feature.desc}</dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={container}
        className="bg-white"
      >
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
            {/* Background SVG unchanged */}
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <motion.h2
                variants={headingVariants}
                className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
              >
                Ready to start your adventure?
                <br />
                Create an account today.
              </motion.h2>
              <motion.p variants={textVariants} className="mt-6 text-lg leading-8 text-gray-300">
                Join our community of Pokémon trainers and get access to exclusive offers and
                events.
              </motion.p>
              <motion.div
                variants={itemFadeUp}
                className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start"
              >
                <Link
                  href="/login"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100"
                >
                  Create Account
                </Link>
                <Link href="/contact" className="text-sm font-semibold leading-6 text-white">
                  Contact us <span aria-hidden="true">→</span>
                </Link>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative mt-16 h-80 lg:mt-8"
            >
              <Image
                className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
                src="https://img.pokemondb.net/artwork/large/charizard.jpg"
                alt="Charizard"
                fill
              />
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
