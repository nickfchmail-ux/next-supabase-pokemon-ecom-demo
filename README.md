# Poke 芒 – Pokémon E-commerce


<video controls src="pokemon-next-supabase-demo.mp4" title="Title"></video>


Pokémon-themed online shop with a **web version** (Next.js) and **mobile app** (React Native).
One project, two platforms – built to deliver fun shopping on desktop and on the go!

Live demo (Web): https://next-pokemon-ecom-demo.vercel.app/

## Why This Project?

- Products pulled from free open-source Pokémon APIs – no manual data entry needed.
- ~70% hand-written code + AI help for the rest → fast development!
- Web uses Next.js for full-stack power; mobile uses React Native + Expo for iOS & Android from one codebase.

## Key Tech Stack

|----------------|----------------------------------------|
| Framework      | Next.js                                |
| State          | Redux, TanStack Query                  |
| Backend        | Supabase (DB + realtime)               |
| Auth           | NextAuth                               |
| Payments       | Stripe                                 |
| Chat           | Supabase realtime                      |
| Styling        | Tailwind CSS                           |
| AI Features    | DeepSeek API (chat bot)                |

## Main Features

| # | Feature              | Description                                                                 | Web Screenshot                  |
|---|----------------------|-----------------------------------------------------------------------------|---------------------------------|
| 1 | Stripe               | Payments    | ![Stripe](image-2.png)                                                      |
| 2 | User Profile         | Update info with TanStack Query mutations & loading states                  | ![Profile](image-4.png)        |
| 3 | Infinite Scrolling   | Lazy-load products like YouTube using TanStack Query                        | ![Shop](image-3.png)            |
| 4 | Stripe Payments      | Real online checkout – learned from docs + YouTube                          | ![Payment](image-2.png)         |
| 5 | Live Chat (Socket.io)| Anonymous realtime chat, saved to Supabase if logged in                    | ![Chat](image-8.png)            |
| 6 | Live User Tracking   | Shows online users in realtime via Supabase                                 | ![Tracking](image-11.png)       |
| 7 | AI Chat Bot          | 24/7 sales assistant – suggests Pokémon in JSON, remembers preferences     |

## Screenshots Overview

<table>
  <tr>
    <td><img src="image-5.png" alt="Home Page" width="220"/></td>
    <td><img src="image-6.png" alt="About Page" width="220"/></td>
    <td><img src="image-7.png" alt="Product Grid" width="220"/></td>
    <td><img src="image.png" alt="Tailwind UI Example" width="220"/></td>
  </tr>
</table>





