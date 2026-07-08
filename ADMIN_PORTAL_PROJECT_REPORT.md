# Poke芒 — Project Architecture Report for Admin Portal Development

**Prepared for:** Senior Principal Architect  
**Date:** 2026-07-08  
**Branch:** `feature/admin-portal`  
**Repository:** `d:\Workstation\supabaseecom-dev`

---

## 1. Executive Summary

Poke芒 is a Pokémon-themed e-commerce store built on **Next.js 16 (App Router)** with **Supabase** as its backend-as-a-service. The application is currently **customer-facing only** — there is no admin dashboard, no role-based access control, and no administrative APIs. The `feature/admin-portal` branch has been created but contains zero admin-specific code. This report documents the full current state of the application so that the architect can design the admin portal with complete context.

---

## 2. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.1.0 |
| **UI Library** | React | 19.2.3 |
| **Language** | JavaScript (JSX) — TS config exists but `strict: false`, all source files are `.js`/`.jsx` | — |
| **Styling** | Tailwind CSS | v4 (PostCSS plugin) |
| **Component Libraries** | shadcn/ui (53+ Radix-based components), Mantine v8, MUI v7, PrimeReact v10 | Multiple |
| **State (Client)** | Redux Toolkit | 2.11.2 |
| **State (Server)** | TanStack React Query | 5.90.12 |
| **Auth** | NextAuth.js v5 (beta) — Google OAuth only | 5.0.0-beta.30 |
| **Database** | Supabase (PostgreSQL) | SDK 2.87.1 |
| **Storage** | Supabase Storage (avatars, product images) | — |
| **Payments** | Stripe (Payment Intents + Webhooks) | SDK 20.1.2 |
| **AI Chat** | DeepSeek API (via OpenAI SDK) | SDK 6.18.0 |
| **Real-time** | Socket.IO | 4.8.3 |
| **Forms** | React Hook Form + Zod | 7.69.0 / 4.2.1 |
| **Animation** | Framer Motion | 12.23.26 |
| **Icons** | Lucide React, React Icons (VSC), MUI Icons, PrimeIcons | Multiple |
| **Charts** | Recharts | 2.15.4 |
| **Email** | Resend | 6.6.0 |
| **Linting** | ESLint 10 + Prettier | — |
| **Package Manager** | npm (yarn also installed) | — |

---

## 3. Database Schema (Supabase — Inferred from Code)

The following tables are accessed by the application. **No admin-specific tables or columns exist yet.**

### 3.1 `pokemons`
| Column | Type | Notes |
|--------|------|-------|
| `id` | int/bigint | Primary key |
| `name` | text | Pokémon name |
| `species` | text[] | Array of species tags (e.g., `['Fire', 'Flying']`) |
| `descriptions` | text | Product description |
| `hp`, `attack`, `defense`, `special_attack`, `special_defense`, `speed` | int | Pokémon stats |
| `image` | text | Image URL (Supabase Storage) |

### 3.2 `pokemons_selling`
| Column | Type | Notes |
|--------|------|-------|
| `*` | — | Joined to `pokemons` via foreign key; contains pricing/availability data |

### 3.3 `members`
| Column | Type | Notes |
|--------|------|-------|
| `id` | bigint | Primary key (used as `user_id` everywhere) |
| `first_name` | text | |
| `last_name` | text | |
| `email` | text | Unique, from Google OAuth |
| `image` | text | Avatar URL |
| `gender` | text | Optional |
| `address` | text | Optional |
| `created_at` | timestamptz | |

### 3.4 `cart_items`
| Column | Type | Notes |
|--------|------|-------|
| `member_id` | bigint | FK → members.id |
| `pokemon_id` | bigint | FK → pokemons.id |
| `quantity` | int | |
| Unique constraint on `(member_id, pokemon_id)` | | |

### 3.5 `orders`
| Column | Type | Notes |
|--------|------|-------|
| `order_id` | uuid/bigint | Primary key |
| `user_id` | bigint | FK → members.id |
| `total_amount` | numeric | |
| `shipping_address` | jsonb/text | Populated after Stripe payment |
| `payment_status` | text | `'paid'` after webhook, otherwise pending |
| `created_at` | timestamptz | |

### 3.6 `order_items`
| Column | Type | Notes |
|--------|------|-------|
| `order_id` | FK | → orders.order_id |
| `product_id` | FK | → pokemons.id |
| `quantity` | int | |
| `price_at_purchase` | numeric | Snapshot price at order time |

### 3.7 `messages`
| Column | Type | Notes |
|--------|------|-------|
| `room_id` | | Chat room identifier |
| `user_id` | bigint | FK → members.id |
| `content` | text | |
| `created_at` | timestamptz | |

### 3.8 `ai_chat_records`
| Column | Type | Notes |
|--------|------|-------|
| `userId` | bigint | FK → members.id |
| `message` | jsonb | Contains `answer` and other AI response data |
| `created_at` | timestamptz | |

### Admin Portal Implications
- **No `roles` or `is_admin` column exists** on `members`. Must be added.
- **No admin audit table** exists.
- **No product inventory management tables** — products are likely managed directly in Supabase dashboard.
- **No analytics/metrics tables** exist.

---

## 4. Project Structure

```
supabaseecom-dev/
├── app/                              # Next.js App Router root
│   ├── layout.js                     # Root layout: Nav, Footer, Providers, ChatBox
│   ├── page.js                       # Homepage (hero + carousel)
│   ├── globals.css                   # Tailwind v4 + PrimeReact + custom theme
│   ├── error.js                      # Error boundary
│   ├── loading.js                    # Loading state
│   ├── not-found.js                  # 404 page
│   │
│   ├── _component/                   # Application components (~50 files)
│   │   ├── Nav.jsx                   # Top navigation bar
│   │   ├── Footer.jsx                # Site footer
│   │   ├── SideBar.jsx               # Account sidebar (uses MUI)
│   │   ├── NavigationLink.jsx        # Desktop + mobile nav links
│   │   ├── NavOption.jsx             # Individual nav option component
│   │   ├── Providers.jsx             # Redux + React Query providers
│   │   ├── ChatBox.jsx               # Floating AI chat (draggable)
│   │   ├── ChatWindow.jsx            # Chat message window
│   │   ├── InfinitePokemonList.jsx    # Infinite-scroll product list
│   │   ├── PokemonCard.jsx           # Product card
│   │   ├── PokemonDetails.jsx        # Product detail page
│   │   ├── CartView.jsx              # Cart page container
│   │   ├── CartList.jsx              # Cart item list
│   │   ├── CartItem.jsx              # Individual cart item row
│   │   ├── CartSummary.jsx           # Cart totals + checkout CTA
│   │   ├── StripePayment.jsx         # Payment intent initiator
│   │   ├── StripeProvider.jsx        # Stripe Elements provider
│   │   ├── CheckoutForm.jsx          # Stripe payment form
│   │   ├── SignInView.jsx            # Login page UI
│   │   ├── AuthButton.jsx            # Sign in/out toggle
│   │   ├── UserProfile.jsx           # Profile edit form
│   │   ├── UserChatRoom.jsx          # User-to-user chat page
│   │   ├── AiChatRoom.jsx            # AI assistant chat
│   │   ├── VisitorMonitor.jsx        # Real-time visitor counter
│   │   ├── TagFilter.jsx             # Species filter tags
│   │   ├── MobileFilter.jsx          # Mobile filter drawer
│   │   ├── Modal.jsx                 # Compound modal component
│   │   ├── Overlay.jsx               # Overlay component
│   │   ├── Logo.jsx                  # Site logo
│   │   ├── home/                     # Homepage-specific components
│   │   │   └── Caurosel.jsx          # Hero carousel
│   │   └── ...                       # 15+ more components
│   │
│   ├── _componentAPI/                # shadcn/ui wrapped components (53 files)
│   │   ├── button.jsx, card.jsx, dialog.jsx, table.jsx, form.jsx
│   │   ├── sidebar.jsx, dropdown-menu.jsx, sheet.jsx, tabs.jsx
│   │   ├── chart.jsx (Recharts wrapper), carousel.jsx (Embla wrapper)
│   │   └── ...                       # Full shadcn/ui kit
│   │
│   ├── _lib/                         # Server-side utilities
│   │   ├── auth.js                   # NextAuth v5 configuration (Google provider)
│   │   ├── supabase.js               # Supabase admin client (SECRET_KEY)
│   │   ├── data-service.js           # Server data access layer (ALL DB queries)
│   │   ├── data-client-service.js    # Client-side Supabase client (ANON_KEY)
│   │   ├── actions.js                # Server Actions (CRUD wrappers)
│   │   ├── helper.js                 # Utility (currency conversion)
│   │   ├── deepseek-service.js       # DeepSeek AI integration
│   │   ├── socket-service.js         # Socket.IO server-side message handling
│   │   └── backend-services-options/ # Alternative backend configs (Express, Supabase)
│   │
│   ├── _state/                       # State management
│   │   ├── _global/                  # Redux slices
│   │   │   ├── Store.js              # Redux store config
│   │   │   ├── cart/CartSlice.jsx     # Cart reducer (add, remove, sync)
│   │   │   ├── user/userSlice.jsx     # User + chatRoom state
│   │   │   ├── chatRoom/chatRoomSlice.jsx  # Chat room state
│   │   │   ├── scrollingDirection/   # Scroll direction tracking
│   │   │   └── invoice/              # Invoice state
│   │   └── _remote/                  # React Query hooks
│   │       ├── QueryClient.js        # QueryClient config
│   │       ├── pokemon/useGetPokemon.js  # Pokemon data fetching
│   │       └── user/useUser.js       # User data fetching
│   │
│   ├── api/                          # API Routes
│   │   ├── auth/[...nextauth]/route.js   # NextAuth handler
│   │   ├── auth/jwt/                     # JWT utilities
│   │   ├── create-payment-intent/route.js # Stripe PaymentIntent creation
│   │   ├── webhook/route.js              # Stripe webhook receiver
│   │   ├── socket/route.js               # Socket.IO server endpoint
│   │   └── send/route.js                 # Email sending (Resend)
│   │
│   ├── shop/                         # Shop route
│   │   ├── page.js                   # Product listing (SSR)
│   │   └── [itemId]/page.js          # Product detail (SSR)
│   ├── cart/page.js                  # Cart page (SSR)
│   ├── checkout/page.js              # Checkout page (SSR)
│   ├── login/page.js                 # Login page
│   ├── about/page.js                 # About page
│   ├── contact/page.js               # Contact page
│   ├── payment-success/page.js       # Post-payment confirmation
│   │
│   ├── account/                      # Account area (protected via middleware)
│   │   ├── layout.js                 # Sidebar + content layout
│   │   ├── page.js                   # Account overview (MUI cards)
│   │   ├── profile/page.js           # Profile edit
│   │   ├── invoice/page.js           # Order history (MUI table)
│   │   ├── delivery/page.js          # Delivery tracking
│   │   ├── watch/page.js             # Watch list
│   │   └── settings/page.js          # Account settings
│   │
│   └── hook/                         # Custom hooks
│       ├── useUpdateUserProfile.jsx
│       └── useUser.jsx
│
├── components/                       # shadcn/ui aliased components
│   └── ui/                           # (mirrors _componentAPI)
├── lib/utils.js                      # cn() utility (clsx + tailwind-merge)
├── hooks/use-mobile.js               # Mobile detection hook
├── proxy.js                          # Auth middleware proxy for /account/*
├── public/                           # Static assets (images, fonts)
├── package.json
├── next.config.js                    # Image remote patterns, strict mode
├── tsconfig.json                     # TS config (strict: false, allowJs: true)
├── jsconfig.json                     # Path aliases (@/ → ./app/)
├── components.json                   # shadcn/ui config (new-york style, CSS variables)
├── postcss.config.mjs                # Tailwind v4 PostCSS plugin
└── eslint.config.mjs                 # ESLint flat config (JS + React plugins)
```

---

## 5. Authentication & Authorization

### Current State
- **NextAuth v5** with **Google OAuth only** — no credentials/password auth.
- On first sign-in, `signIn` callback auto-creates a `members` record.
- JWT callback stores `user.id` in token; session callback enriches session with `id`.
- Middleware (`proxy.js`) protects all `/account/:path*` routes.
- **No role-based access control (RBAC)** — every authenticated user is equal.
- **No admin concept exists** — no `role` field, no admin guards, no admin routes.

### What's Needed for Admin Portal
1. Add `role` column to `members` table (e.g., `'customer' | 'admin' | 'superadmin'`).
2. Extend NextAuth callbacks to include `role` in JWT/session.
3. Create admin middleware/guard that checks `session.user.role`.
4. Protect all `/admin/*` routes behind role check.
5. Potentially add an invitation-only admin registration flow.

---

## 6. Data Access Layer (Critical for Admin Portal)

### 6.1 Server-Side (`_lib/data-service.js`)
All server-side database operations go through this single file (~300 lines). Functions:

| Function | Purpose | Admin Relevance |
|----------|---------|-----------------|
| `getPokemons()` | Fetch all pokemons with selling data | Needs admin variant with filtering |
| `getPokemonById(id)` | Single pokemon detail | Useful |
| `getUser(email)` | Lookup member by email | Admin needs `getAllUsers()` |
| `createMember(data)` | Insert new member | — |
| `updateMember({member, memberId})` | Update member profile | Admin needs ability to edit any user |
| `uploadImage({filePath, image})` | Upload to Supabase Storage | Admin will need for product images |
| `getCartItems()` | Current user's cart | Admin: view any user's cart |
| `addCartItems(item)` | Upsert cart item | — |
| `updateCartItems(item)` | Update cart quantity | — |
| `deleteCartItems(item)` | Remove cart item | — |
| `createOrder({orderedItems})` | Create order from cart | — |
| `getInvoices()` | Current user's orders | Admin needs `getAllOrders()` |
| `updatePaymentStatus(...)` | Mark order paid | Admin may need manual override |
| `getOrderItemsByOrderId(orderId)` | Order line items | — |
| `calculateBillingAmount(items)` | Price calculator | — |
| `clearAllCartItems(userId)` | Empty cart after purchase | — |

### 6.2 Client-Side (`_lib/data-client-service.js`)
- Separate Supabase client using `NEXT_PUBLIC_SUPABASE_KEY` (anon key).
- Used for infinite scroll pagination, species filtering, and count queries.
- Admin client will need the service_role key for privileged operations.

### 6.3 Server Actions (`_lib/actions.js`)
- `handleSignOut()`, `handleSignIn()` — auth actions
- `getUserAction(email)`, `updateMemberAction(formData)` — user CRUD
- `getPokemonAction()` — product fetch
- `updateCartItemsAction(items)` — cart sync between client↔server

---

## 7. API Routes (Current)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/[...nextauth]` | ALL | NextAuth handler (Google OAuth) |
| `/api/create-payment-intent` | POST | Creates Stripe PaymentIntent |
| `/api/webhook` | POST | Receives Stripe events, updates order status |
| `/api/socket` | GET | Socket.IO server endpoint |
| `/api/send` | POST | Email sending via Resend |

**No admin API routes exist.** The admin portal will need:
- `/api/admin/products` — CRUD for pokemons
- `/api/admin/users` — User management
- `/api/admin/orders` — Order management
- `/api/admin/analytics` — Dashboard metrics
- `/api/admin/chat` — Chat moderation
- `/api/admin/upload` — Image upload endpoint

---

## 8. State Management Architecture

```
┌─────────────────────────────────────────────┐
│                  App Layout                  │
│  ┌───────────────────────────────────────┐  │
│  │         <Providers>                   │  │
│  │  ┌──────────────┐ ┌────────────────┐  │  │
│  │  │ QueryClient  │ │  Redux Store   │  │  │
│  │  │ Provider     │ │  Provider      │  │  │
│  │  │              │ │                │  │  │
│  │  │ React Query  │ │ cart           │  │  │
│  │  │ - pokemon    │ │ user           │  │  │
│  │  │ - user       │ │ chatRoom       │  │  │
│  │  │ - roomRecord │ │ scrollingDir   │  │  │
│  │  └──────────────┘ └────────────────┘  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

- **Redux Toolkit**: Client-only transient state (cart items, UI state).
- **TanStack React Query**: Server state with caching (staleTime: 60s, retry: 1).
- Cart synchronization: Redux cart ↔ Supabase `cart_items` via `updateCartItemsAction()`.
- User state: Duplicated in Redux (`userSlice`) and React Query (`useUser`).

### Admin Portal State Needs
- Admin-specific Redux slice or React Query for: products list, users list, orders, analytics.
- Consider whether to introduce Zustand or keep Redux for admin state.

---

## 9. UI Component Inventory & Inconsistencies

### 9.1 Multiple UI Libraries (Technical Debt)
The project mixes **FOUR** UI libraries, creating inconsistency:

| Library | Where Used | Assessment |
|---------|-----------|------------|
| **shadcn/ui** (Radix) | 53 wrapped components in `_componentAPI/` + `components/ui/` | Primary kit, well-organized |
| **Mantine v8** | Listed but minimal usage visible in code | Mostly unused |
| **MUI v7** | Account sidebar, invoice table, account overview cards | Heavyweight, inconsistent with Tailwind |
| **PrimeReact v10** | Toast notifications, imported CSS in globals | Adds ~200KB of CSS, only Toast used |

### 9.2 Recommendation for Admin Portal
- **Standardize on shadcn/ui + Tailwind** for the admin portal.
- Do NOT introduce MUI or PrimeReact into admin pages.
- Consider refactoring MUI components in `/account/*` to shadcn/ui to reduce bundle size.
- The `_componentAPI/` directory already contains: Table, Form, Dialog, Card, Chart, Tabs, Sheet, DropdownMenu — all you need for an admin dashboard.

---

## 10. Payment Flow (Stripe)

```
User clicks "Checkout"
    ↓
CartSummary → createOrder() → INSERT into orders + order_items
    ↓
Redirect to /checkout?orderId=XXX
    ↓
StripePayment component → POST /api/create-payment-intent
    ↓
Stripe returns clientSecret → CheckoutForm renders Stripe Elements
    ↓
User submits payment → Stripe processes
    ↓
Stripe webhook → /api/webhook → updatePaymentStatus('paid')
    ↓                                  → clearAllCartItems()
Redirect to /payment-success
```

**Admin Implications:**
- Admin needs to view all orders, filter by status, manually mark orders.
- Admin needs refund capability (requires Stripe integration extension).
- Admin needs order detail view with line items.

---

## 11. AI Chat System

- **DeepSeek** API via OpenAI SDK (`deepseek-chat` model).
- Context: Last 5 chat records + first 20 products + user's name.
- Response format: JSON with `text` (message) and `suggestion` (product recommendations).
- Chat records stored in `ai_chat_records` table.
- Floating draggable chat widget via Framer Motion (`ChatBox.jsx`).
- Admin may want: chat log viewer, response quality monitoring, prompt template management.

---

## 12. Real-Time Features (Socket.IO)

- Server endpoint: `/api/socket`
- Token-based auth using NextAuth JWT.
- Used for real-time visitor count and user-to-user chat.
- `ChatWindow.jsx` handles message display and sending.
- Admin may want: real-time dashboard updates, visitor analytics.

---

## 13. What the Admin Portal Needs — Feature Inventory

### 13.1 Must-Have (MVP)
| Feature | Description | Effort |
|---------|-------------|--------|
| **RBAC** | Add `role` to `members`, extend auth, create admin guard | Medium |
| **Admin Layout** | Sidebar navigation, header, content area (reuse shadcn/ui sidebar) | Low |
| **Dashboard** | Key metrics: total orders, revenue, users, products | Medium |
| **Product Management** | CRUD table for `pokemons` + `pokemons_selling` | High |
| **Order Management** | List all orders, filter by status, view details | High |
| **User Management** | List users, view profiles, suspend accounts | Medium |
| **Image Upload** | Product image upload to Supabase Storage | Low |

### 13.2 Should-Have
| Feature | Description | Effort |
|---------|-------------|--------|
| **Analytics** | Charts: revenue over time, top products, user signups | Medium |
| **Order Status Workflow** | Pending → Confirmed → Shipped → Delivered | Medium |
| **Inventory Tracking** | Stock levels, low-stock alerts | Medium |
| **Chat Moderation** | View AI chat logs, monitor conversations | Low |
| **Email Notifications** | Order confirmations, shipping updates via Resend | Low |

### 13.3 Nice-to-Have
| Feature | Description | Effort |
|---------|-------------|--------|
| **Role Management** | Create/edit admin roles, permission granularity | High |
| **Audit Log** | Track all admin actions | Medium |
| **Bulk Operations** | Bulk product import/export, bulk order processing | Medium |
| **Discount/Coupon System** | Create and manage promo codes | High |
| **Refund Processing** | Stripe refund integration | Medium |

---

## 14. Recommended Admin Portal Architecture

### 14.1 Route Structure (Proposed)
```
app/
├── (admin)/                          # Route group (no URL prefix change needed)
│   ├── layout.js                     # Admin layout (sidebar + header)
│   ├── page.js                       # Dashboard
│   ├── products/
│   │   ├── page.js                   # Product list
│   │   ├── new/page.js               # Add product
│   │   └── [id]/page.js              # Edit product
│   ├── orders/
│   │   ├── page.js                   # Order list
│   │   └── [orderId]/page.js         # Order detail
│   ├── users/
│   │   ├── page.js                   # User list
│   │   └── [userId]/page.js          # User detail
│   ├── analytics/
│   │   └── page.js                   # Charts and reports
│   └── settings/
│       └── page.js                   # Admin settings
│
├── api/admin/
│   ├── products/route.js             # Product CRUD API
│   ├── orders/route.js               # Order management API
│   ├── users/route.js                # User management API
│   └── analytics/route.js            # Analytics data API
```

### 14.2 Component Architecture
```
app/_component/
├── admin/                            # All admin components
│   ├── AdminLayout.jsx               # Sidebar + topbar + content
│   ├── AdminSidebar.jsx              # Navigation (reuse shadcn sidebar)
│   ├── AdminHeader.jsx               # User menu, notifications
│   ├── AdminGuard.jsx                # Role-based access wrapper
│   ├── Dashboard/
│   │   ├── StatCards.jsx             # KPI cards
│   │   ├── RevenueChart.jsx          # Recharts line/bar chart
│   │   └── RecentOrders.jsx          # Latest orders table
│   ├── Products/
│   │   ├── ProductTable.jsx          # shadcn DataTable
│   │   ├── ProductForm.jsx           # Create/edit form
│   │   └── ProductImageUpload.jsx    # Image upload with preview
│   ├── Orders/
│   │   ├── OrderTable.jsx            # Filterable orders table
│   │   ├── OrderDetail.jsx           # Full order view
│   │   └── OrderStatusBadge.jsx      # Status chip
│   └── Users/
│       ├── UserTable.jsx             # User list
│       └── UserDetail.jsx            # User profile view
```

### 14.3 Data Flow
```
Admin UI → React Query (useQuery/useMutation)
    → API Route (/api/admin/*)
        → data-service.js (server-only, SECRET_KEY)
            → Supabase (PostgreSQL)
```

- Use `SUPABASE_SECRET_KEY` for all admin operations (bypasses RLS).
- Keep `data-service.js` as the single source of truth for DB operations.
- Add admin-specific functions to `data-service.js` (or create `_lib/admin-data-service.js`).

---

## 15. Key Technical Decisions to Make

1. **Admin URL structure**: `/admin/*` (separate route group) vs. subdomain (`admin.pokemango.com`)?
2. **UI Library**: Standardize on shadcn/ui + Tailwind, or continue mixing libraries?
3. **Data Table**: Use shadcn's table, TanStack Table, or a paid library like AG Grid?
4. **Form handling**: Continue React Hook Form + Zod, or switch to a different approach?
5. **File upload**: Direct to Supabase Storage or via API route?
6. **Real-time updates**: Use Supabase Realtime subscriptions for live dashboard, or keep Socket.IO?
7. **Testing strategy**: Vitest + React Testing Library, or Playwright E2E?
8. **Deployment**: Vercel (current likely target) — admin portal on same deployment or separate?

---

## 16. Known Technical Debt & Risks

| Issue | Severity | Impact on Admin Portal |
|-------|----------|----------------------|
| 4 UI libraries (MUI, Mantine, PrimeReact, shadcn) | High | Bundle bloat, inconsistent DX, harder to maintain |
| No TypeScript (strict: false, no .tsx files) | Medium | Admin portal is a good opportunity to go TS-first |
| Mixed client/server Supabase clients | Medium | Risk of exposing secret key to client |
| No database migrations/tracking | High | Schema changes for admin need careful planning |
| No test suite | High | Admin features will need regression protection |
| `_state` directory has broken reference to `chatRoomSlice.jsx` | Low | Fix before adding admin state |
| ESLint minimal config (only JS + React plugins) | Low | Consider adding import sorting, unused vars |

---

## 17. Environment Variables (for Reference)

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_KEY
SUPABASE_SECRET_KEY

# NextAuth
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
NEXTAUTH_SECRET
NEXTAUTH_URL

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET

# DeepSeek AI
DEEPSEEK_API_KEY

# Email (Resend)
RESEND_API_KEY
```

---

## 18. Immediate Next Steps

1. **Database Migration**: Add `role` column to `members` table (`'customer' | 'admin'`).
2. **Auth Extension**: Update NextAuth callbacks to include `role` in JWT and session.
3. **Admin Guard**: Create `AdminGuard` component and middleware for `/admin/*`.
4. **Bootstrap Admin Layout**: Use shadcn/ui sidebar + create route group.
5. **Admin API Foundation**: Create `/api/admin/` route handlers with service_role auth.
6. **Dashboard MVP**: StatCards + basic charts + recent orders.

---

*End of report. This document should give the architect a complete picture of the codebase, its current state, and what's needed to design and build the admin portal.*
