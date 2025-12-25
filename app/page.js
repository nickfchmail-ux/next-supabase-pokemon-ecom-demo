import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-full bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
        <Image
          src="https://img.pokemondb.net/artwork/large/gengar.jpg"
          alt=""
          fill
          className="-z-10 object-cover"
        />
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
          <h1 className="text-4xl font-bold tracking-tight text-red-500 sm:text-6xl">
            Find Your Perfect Pokémon Companion
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Explore our collection of ethically sourced Pokémon and start your adventure today. Fast, safe, and reliable delivery to your doorstep.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/shop"
              className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              Shop Now
            </Link>
            <Link href="/about" className="text-sm font-semibold leading-6 text-white">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Pokémon Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">Featured Pokémon</h2>
          <div className="mt-10 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {/* Featured Pokémon Cards - Replace with dynamic data later */}
            <div className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                    <Image
                        src="https://img.pokemondb.net/artwork/large/bulbasaur.jpg"
                        alt="Bulbasaur"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="mt-4 flex justify-between">
                    <div>
                        <h3 className="text-sm text-gray-700">
                            <a href="#">
                                <span aria-hidden="true" className="absolute inset-0"></span>
                                Bulbasaur
                            </a>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">Grass/Poison</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">$45</p>
                </div>
            </div>
            <div className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                    <Image
                        src="https://img.pokemondb.net/artwork/large/charmander.jpg"
                        alt="Charmander"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="mt-4 flex justify-between">
                    <div>
                        <h3 className="text-sm text-gray-700">
                            <a href="#">
                                <span aria-hidden="true" className="absolute inset-0"></span>
                                Charmander
                            </a>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">Fire</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">$50</p>
                </div>
            </div>
            <div className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                    <Image
                        src="https://img.pokemondb.net/artwork/large/squirtle.jpg"
                        alt="Squirtle"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="mt-4 flex justify-between">
                    <div>
                        <h3 className="text-sm text-gray-700">
                            <a href="#">
                                <span aria-hidden="true" className="absolute inset-0"></span>
                                Squirtle
                            </a>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">Water</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">$55</p>
                </div>
            </div>
             <div className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                    <Image
                        src="https://img.pokemondb.net/artwork/large/pikachu.jpg"
                        alt="Pikachu"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="mt-4 flex justify-between">
                    <div>
                        <h3 className="text-sm text-gray-700">
                            <a href="#">
                                <span aria-hidden="true" className="absolute inset-0"></span>
                                Pikachu
                            </a>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">Electric</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">$75</p>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
        <div className="bg-gray-50 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-indigo-600">Your Adventure Awaits</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Everything you need to start your Pokémon journey
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        We provide only the highest quality, ethically sourced Pokémon, ready for a lifetime of companionship and adventure.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        <div className="relative pl-16">
                            <dt className="text-base font-semibold leading-7 text-gray-900">
                                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                Ethically Sourced
                            </dt>
                            <dd className="mt-2 text-base leading-7 text-gray-600">All our Pokémon are raised with care and love, ensuring they are happy and healthy when they join you.</dd>
                        </div>
                        <div className="relative pl-16">
                            <dt className="text-base font-semibold leading-7 text-gray-900">
                                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L6.222 12.852a1.2 1.2 0 010-1.7l8.82-8.82a1.2 1.2 0 011.7 1.7L9.622 12l7.12 7.122a1.2 1.2 0 01-1.7 1.7z" />
                                    </svg>
                                </div>
                                Fast & Safe Delivery
                            </dt>
                            <dd className="mt-2 text-base leading-7 text-gray-600">Your new companion will be delivered to you quickly and safely, with real-time tracking available.</dd>
                        </div>
                        <div className="relative pl-16">
                            <dt className="text-base font-semibold leading-7 text-gray-900">
                                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 15.91a4.5 4.5 0 01-6.364 0 4.5 4.5 0 010-6.364A4.5 4.5 0 0115.91 9.09a4.5 4.5 0 010 6.364z" />
                                </svg>
                                </div>
                                Expert Support
                            </dt>
                            <dd className="mt-2 text-base leading-7 text-gray-600">Our team of Pokémon experts is here to help you with any questions you may have, from diet to training.</dd>
                        </div>
                        <div className="relative pl-16">
                            <dt className="text-base font-semibold leading-7 text-gray-900">
                                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 12a7.5 7.5 0 01-11.636 5.757M12 6v6l4 2" />
                                </svg>

                                </div>
                                24/7 Adventure Support
                            </dt>
                            <dd className="mt-2 text-base leading-7 text-gray-600">Our support team is available 24/7 to assist you on your Pokémon journey, no matter where it takes you.</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>

      {/* Call to Action Section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
              aria-hidden="true"
            >
              <circle cx={512} cy={512} r={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
              <defs>
                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                  <stop stopColor="#7775D6" />
                  <stop offset={1} stopColor="#E935C1" />
                </radialGradient>
              </defs>
            </svg>
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to start your adventure?
                <br />
                Create an account today.
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Join our community of Pokémon trainers and get access to exclusive offers and events.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <Link
                  href="/login"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Create Account
                </Link>
                <Link href="/contact" className="text-sm font-semibold leading-6 text-white">
                  Contact us <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="relative mt-16 h-80 lg:mt-8">
              <Image
                className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
                src="https://img.pokemondb.net/artwork/large/charizard.jpg"
                alt="App screenshot"
                fill
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
