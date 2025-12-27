/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      // Your original patterns
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

      // Previous sources
      {
        protocol: 'https',
        hostname: 'images.alphacoders.com',
      },
      {
        protocol: 'https',
        hostname: 'images5.alphacoders.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.stickpng.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.pokemon.com',
      },
      {
        protocol: 'https',
        hostname: 'pisces.bbystatic.com',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ebayimg.com',
      },
      {
        protocol: 'https',
        hostname: 'i.redd.it',
      },
      {
        protocol: 'https',
        hostname: 'images-cdn.ubuy.co.in',
      },
      {
        protocol: 'https',
        hostname: 'coregamingnh.com',
      },
      {
        protocol: 'https',
        hostname: 'www.merchoid.com',
      },
      {
        protocol: 'https',
        hostname: 'u-mercari-images.mercdn.net',
      },
      {
        protocol: 'https',
        hostname: 'www.shutterstock.com',
      },
      {
        protocol: 'https',
        hostname: 'thumbs.dreamstime.com',
      },
      {
        protocol: 'https',
        hostname: 'c8.alamy.com',
      },
      {
        protocol: 'https',
        hostname: 'lookaside.fbsbx.com',
      },
      {
        protocol: 'https',
        hostname: 'ic.pics.livejournal.com',
      },
      {
        protocol: 'https',
        hostname: 'pokemonnewspaper.com.au',
      },

      // NEW: For the subtle white-dominant background image
      {
        protocol: 'https',
        hostname: 'wallpapers.com',
      },

      {
        protocol: 'https',
        hostname: 'wallpapers.com',
      },
      {
        protocol: 'https',
        hostname: 'wallpapers.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;
