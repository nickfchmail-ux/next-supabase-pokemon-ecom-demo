# Poke 芒 – Pokémon E-commerce 🛒🔥

Pokémon-themed online shop with a **web version** (Next.js) and **mobile app** (React Native).
One project, two platforms – built to deliver fun shopping on desktop and on the go!

Live demo (Web): https://next-pokemon-ecom-demo.vercel.app/

## Why This Project?

- Products pulled from free open-source Pokémon APIs – no manual data entry needed.
- ~70% hand-written code + AI help for the rest → fast development!
- Web uses Next.js for full-stack power; mobile uses React Native + Expo for iOS & Android from one codebase.

## Key Tech Stack

| Category       | Web (Next.js)                          | Mobile (React Native)             |
|----------------|----------------------------------------|-----------------------------------|
| Framework      | Next.js                                | React Native + Expo Router        |
| State          | Redux, TanStack Query                  | (Add yours – Redux?)              |
| Backend        | Supabase (DB + realtime)               | Supabase                          |
| Auth           | NextAuth                               | (Expo auth or Supabase)           |
| Payments       | Stripe                                 | (Stripe integration?)             |
| Chat           | Socket.io                              | (Socket.io or similar)            |
| Styling        | Tailwind CSS                           | (NativeWind / Tailwind?)          |
| AI Features    | OpenAI / DeepSeek API (chat bot)       | (Possible chat bot port)          |

## Main Features

| # | Feature              | Description                                                                 | Web Screenshot                  | Mobile Screenshot               |
|---|----------------------|-----------------------------------------------------------------------------|---------------------------------|---------------------------------|
| 1 | Stripe               | Payments    | ![Stripe](image-2.png)                                                      | in-progress                          |
| 2 | User Profile         | Update info with TanStack Query mutations & loading states                  | ![Profile](image-4.png)        | in-progress              |
| 3 | Infinite Scrolling   | Lazy-load products like YouTube using TanStack Query                        | ![Shop](image-3.png)            | ![Shop](shop.jpg)               |
| 4 | Stripe Payments      | Real online checkout – learned from docs + YouTube                          | ![Payment](image-2.png)         | In progress                 |
| 5 | Live Chat (Socket.io)| Anonymous realtime chat, saved to Supabase if logged in                    | ![Chat](image-8.png)            | In-progress    |
| 6 | Live User Tracking   | Shows online users in realtime via Supabase                                 | ![Tracking](image-11.png)       | In-progress           |
| 7 | AI Chat Bot          | 24/7 sales assistant – suggests Pokémon in JSON, remembers preferences     | ![AI Bot](image-14.png) ![History](image-16.png) | In-progress     |

## Screenshots Overview

### Web Version

<table>
  <tr>
    <td><img src="image-5.png" alt="Home Page" width="220"/></td>
    <td><img src="image-6.png" alt="About Page" width="220"/></td>
    <td><img src="image-7.png" alt="Product Grid" width="220"/></td>
    <td><img src="image.png" alt="Tailwind UI Example" width="220"/></td>
  </tr>
</table>

### Mobile Version

<table>
  <tr>
    <td><img src="favorites.jpg" alt="Favorites" width="220"/></td>
    <td><img src="about.jpg" alt="About" width="220"/></td>
    <td><img src="shop.jpg" alt="Shop" width="220"/></td>
    <td><img src="cart.jpg" alt="Cart" width="220"/></td>
  </tr>
</table>

## UI Inspiration (Modern Clean Vibes)

Here are some sleek e-commerce designs to inspire further improvements for both web and mobile:

<grok-card data-id="706012" data-type="image_card" data-plain-type="render_searched_image"  data-arg-size="LARGE" ></grok-card>



<grok-card data-id="4bf53e" data-type="image_card" data-plain-type="render_searched_image"  data-arg-size="LARGE" ></grok-card>



<grok-card data-id="a6522a" data-type="image_card" data-plain-type="render_searched_image"  data-arg-size="LARGE" ></grok-card>



<grok-card data-id="98326b" data-type="image_card" data-plain-type="render_searched_image"  data-arg-size="LARGE" ></grok-card>


Star ⭐ if you enjoy Pokémon + smart shopping tech!
