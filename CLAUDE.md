# CLAUDE.md — ecom-ui

This file provides guidance to Claude Code when working in the `ecom-ui/` React frontend for the PixelCart video game e-commerce platform.

## Build & Run

```bash
# Install dependencies
pnpm install

# Start dev server (http://localhost:3000)
pnpm dev

# Type-check
pnpm tsc --noEmit

# Production build
pnpm build

# Preview production build
pnpm preview
```

## Environment

Copy `.env.example` to `.env` (or set variables directly):

```env
VITE_API_BASE_URL=http://localhost:8080/api   # Spring Boot API Gateway
VITE_USE_MOCK=true                            # Toggle mock vs real API
```

**Mock mode** (`VITE_USE_MOCK=true`): Serves static data from `src/api/mocks/`. No backend required.  
**Real mode** (`VITE_USE_MOCK=false`): All calls hit `VITE_API_BASE_URL`. Backend must be running.

## Backend Context

The backend is a **Spring Boot modular monolith** at `../ecom/`. All services route through an API Gateway on port `8080` at context path `/api`. See `../ecom/CLAUDE.md` for full backend details.

**Base URL**: `http://localhost:8080/api`  
**Swagger UI**: `http://localhost:8080/api/swagger-ui.html`

### Backend Infrastructure (required for real API mode)

```bash
# Start Kafka (KRaft mode)
docker compose -f ../ecom/docker/docker-compose-kafka.yaml up -d

# PostgreSQL and Redis must be running externally (see ../ecom/.env)
```

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| Framework | React | 18.3.1 |
| Language | TypeScript | 5.6.3 |
| UI | Material-UI (MUI) | 6.1.6 |
| HTTP | Axios | 1.7.7 |
| Server state | TanStack Query | 5.59.20 |
| Client state | React Context API | — |
| Routing | React Router DOM | 6.27.0 |
| Build | Vite | 5.4.10 |
| Package manager | pnpm | — |

## Project Structure

```
src/
├── api/                # Axios service layer (1 file per domain)
│   ├── axiosInstance.ts        # Base instance, auth header injection
│   ├── productService.ts
│   ├── brandService.ts
│   ├── categoryService.ts
│   ├── orderService.ts
│   ├── userService.ts
│   ├── productImageService.ts
│   └── mocks/                  # Static mock data
│       └── productMocks.ts
├── types/              # TypeScript interfaces mirroring backend DTOs
│   ├── common.ts       # ApiResponse<T>, PageResponse<T>
│   ├── product.ts      # Product, PaginatedProduct, SearchProduct, enums
│   ├── order.ts        # OrderResponse, OrderItemResponse, CreateOrderRequest
│   ├── user.ts         # User, AddressResponse, CreateUserRequest
│   ├── category.ts
│   ├── brand.ts
│   └── image.ts
├── components/         # Reusable MUI components
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   ├── Footer.tsx
│   ├── PixelCartLogo.tsx
│   └── LoadingSkeleton.tsx
├── pages/              # Route-level page components
│   ├── Home.tsx        # Product grid, search, pagination
│   ├── ProductDetails.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   ├── Register.tsx
│   ├── Orders.tsx
│   ├── OrderDetail.tsx
│   ├── Profile.tsx
│   ├── Brands.tsx
│   ├── BrandDetail.tsx
│   ├── Categories.tsx
│   └── SearchResults.tsx
├── hooks/              # TanStack Query wrappers (1 file per domain)
│   ├── useProducts.ts
│   ├── useProduct.ts
│   ├── useCategories.ts
│   ├── useOrders.ts
│   ├── useUsers.ts
│   └── useBrands.ts
├── context/            # Client-side global state
│   ├── AuthContext.tsx # JWT token, login/logout
│   └── CartContext.tsx # Client-side cart (pre-checkout)
├── config/
│   └── queryClient.ts  # TanStack Query: staleTime 5min, retry 1
├── routes/
│   └── AppRoutes.tsx
├── utils/
│   └── formatPrice.ts  # INR via Intl.NumberFormat
├── theme.ts            # MUI dark theme
├── App.tsx
└── main.tsx
```

## API Contract

### Response Envelope

All backend responses are wrapped:

```typescript
// types/common.ts
interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  metadata: unknown;
}

interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
```

Always unwrap `.data` from `ApiResponse` before passing to components.

### Key Endpoints

| Method | Path | Service |
|---|---|---|
| POST | `/auth/register` | Auth |
| POST | `/auth/login` | Auth |
| POST | `/auth/refresh` | Auth |
| POST | `/auth/logout` | Auth |
| GET | `/products?page=0&size=5` | Catalog |
| GET | `/products/{id}` | Catalog |
| GET | `/products/search?searchQuery=&inStock=&page=&limit=&sort=` | Catalog |
| GET | `/products/suggest?q=` | Catalog (Trie autocomplete) |
| GET | `/brand?page=0&size=10` | Catalog |
| GET | `/brand/{id}/product` | Catalog |
| GET | `/category/tree` | Catalog |
| GET | `/cart` | Cart (JWT required) |
| POST | `/cart/items` | Cart (JWT required) |
| PUT | `/cart/items/{productId}` | Cart (JWT required) |
| DELETE | `/cart/items/{productId}` | Cart (JWT required) |
| POST | `/orders` | Order |
| GET | `/orders/user/{userId}?page=0&size=5` | Order |
| GET | `/orders/{id}` | Order |
| POST | `/users` | User (register) |
| GET | `/users/{id}` | User |
| PATCH | `/users/profile` | User |
| GET | `/users/{userId}/addresses` | User |
| POST | `/users/{userId}/addresses` | User |
| POST | `/product-images/upload/{productId}` | Catalog (S3 presigned URL) |

### Authentication

- JWT Bearer token in `Authorization` header (injected automatically by `axiosInstance.ts`)
- Access token: 15-minute expiry; refresh token: 7 days (stored in Redis on backend)
- `AuthContext` holds the token in client state; `axiosInstance` reads from it on each request
- Backend public endpoints: `/auth/**`, `/health`, `/swagger-ui/**`, `/v3/api-docs/**`

## Type Conventions

Types in `src/types/` are the **single source of truth** for the frontend — keep them in sync with backend DTOs.

```typescript
// Key enums matching Java enums exactly:
type ProductStatus = 'ACTIVE' | 'IN_ACTIVE' | 'OUT_OF_STOCK';
type ProductType = 'PHYSICAL' | 'DIGITAL';
type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
type Gender = 'MALE' | 'FEMALE' | 'OTHER';
```

**`PaginatedProduct`** (list view, from `GET /products`): uses `product` field for game name (not `productName`).  
**`Product`** (detail view, from `GET /products/{id}`): uses `productName` field.

## State Management Rules

**Server state → TanStack Query** (hooks in `src/hooks/`):
- Always use `useQuery` for reads, `useMutation` for writes
- Invalidate relevant query keys after mutations
- Config: `staleTime: 5min`, `retry: 1`

**Client state → Context API**:
- `AuthContext`: JWT token only; no user data caching here
- `CartContext`: Client-side cart items before the user hits `/checkout`. The backend cart (`/cart`) is the source of truth after login — sync on mount.

## Domain: Video Game E-Commerce

Products have gaming-specific fields. When adding product forms or displaying product details, account for:

- `platform`: `GamePlatform` enum (PC, PS5, Xbox, Switch, etc.)
- `genre`: `GameGenre` enum
- `esrbRating`: string (E, T, M, AO, RP)
- `productType`: `'PHYSICAL' | 'DIGITAL'`
- `isPreOrder`, `isEarlyAccess`, `isDlc`: boolean flags
- `baseGameId`: UUID reference (for DLC)
- `digitalDownloadSize`, `digitalDeliveryMethod`: digital-only fields
- `systemRequirements`: text field (PC games)
- `languageSupport`: array/text
- `publisher`, `developer`, `releaseDate`, `region`

Product images are served via **S3 presigned URLs** (1-hour expiry). Do not store or cache image URLs beyond their TTL. Use `productImageService.ts` for all image operations.

## Key Architectural Notes

**Cart is backend-owned after login**: The `CartContext` is client-side only for pre-login browsing. Once authenticated, the cart is persisted in the backend (PostgreSQL + Redis cache). Always call `GET /cart` on auth to sync.

**Pagination**: Always pass `page` (0-indexed) and `size` to list endpoints. Do not load all records — the backend enforces server-side pagination.

**Autocomplete**: `GET /products/suggest?q=` is backed by a Trie on the backend. Debounce input before calling this endpoint.

**Category tree**: `GET /category/tree` returns a hierarchical structure (parent → children). Use recursive rendering for nested categories.

**Image upload flow**: `POST /product-images/upload/{productId}` returns an S3 presigned URL. Upload the file directly to S3 using that URL, then register the metadata via `POST /product-images`.

## MUI Theme

The app uses an MUI v6 **dark theme** defined in `src/theme.ts`. Always use MUI components and theme tokens (colors, spacing, typography) — avoid raw CSS or inline style overrides. Use `sx` prop or `styled()` for component-level overrides.

## Formatting

Prices are displayed in **INR** using `formatPrice.ts` (`Intl.NumberFormat` with `en-IN` locale). Always use this utility — never format prices inline.
