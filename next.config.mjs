/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ntcfaqkdafuaxfxoweab.supabase.co',
        pathname: '/storage/v1/object/public/pokemons/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/a/**',
      },
      {
        protocol: 'https',
        hostname: 'authjs.dev',
        pathname: '/img/providers/**',
      },
      {
        protocol: 'https',
        hostname: 'img.pokemondb.net',
        pathname: '/artwork/**',
      },
    ],
  },
};

export default nextConfig;
