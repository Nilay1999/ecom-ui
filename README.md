# ecom-ui — PixelCart Frontend

React 18 + TypeScript + MUI + TanStack Query frontend for the `ecom/` Spring Boot backend.

---

## Setup

```bash
cd ecom-ui
pnpm install
pnpm dev          # starts on http://localhost:3000
```

> **Prerequisites:** Node 18+, pnpm 8+

---

## Mock vs Real API

The app ships with mock data so you can browse the UI without a running backend.

| Mode | `.env` setting | Result |
|------|---------------|--------|
| **Mock** (default) | `VITE_USE_MOCK=true` | Static mock products, no network calls |
| **Real API** | `VITE_USE_MOCK=false` | All API calls hit `VITE_API_BASE_URL` |

```dotenv
# .env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_USE_MOCK=false   # ← flip this to connect to the backend
```

The backend runs on `http://localhost:8080` with context path `/api` (configured in `application.properties`).

---

## REST API Map

Base URL: `http://localhost:8080/api`

All endpoints return `ApiResponse<T>` with shape:
```json
{ "status": 200, "message": "...", "data": <T>, "metadata": null }
```

Paginated endpoints return `ApiResponse<PageResponse<T>>` where `PageResponse` has:
`content`, `page`, `size`, `totalElements`, `totalPages`, `last`.

### Products `/api/products`

| Method | Path | Request | Response | Description |
|--------|------|---------|----------|-------------|
| GET | `/products?page=0&size=5` | — | `PageResponse<PaginatedProduct>` | Paginated product list |
| GET | `/products/{id}` | — | `Product` | Full product by ID |
| GET | `/products/search?searchQuery=&inStock=&page=&limit=&sort=` | — | `PageResponse<SearchProduct>` | Search with filters |
| GET | `/products/suggest?q=` | — | `string[]` | Autocomplete suggestions |
| POST | `/products` | `CreateProductRequest` | `CreateProductResponse` | Create product |
| PUT | `/products/{id}` | `CreateProductRequest` | `Product` | Upsert product |
| PATCH | `/products/{id}` | `PartialProductUpdateRequest` | `Product` | Partial update |
| PATCH | `/products/{id}/stock` | `{ price: number }` | `Product` | Update price |
| PATCH | `/products/{id}/category` | `{ categoryId: string }` | `Product` | Change category |

### Brands `/api/brand`

| Method | Path | Request | Response | Description |
|--------|------|---------|----------|-------------|
| GET | `/brand?page=0&size=10` | — | `PageResponse<PaginatedBrand>` | Paginated brands |
| GET | `/brand/{id}` | — | `BrandResponse` | Brand by ID |
| GET | `/brand/{id}/product` | — | `Product[]` | Products by brand |
| POST | `/brand` | `CreateBrandRequest` | `BrandResponse` | Create brand |
| PATCH | `/brand/{id}` | `UpdateBrandRequest` | `BrandResponse` | Update brand |
| PATCH | `/brand/{id}/status` | `{ active: boolean }` | `BrandResponse` | Toggle status |
| DELETE | `/brand/{id}` | — | `boolean` | Delete brand |

### Categories `/api/category`

| Method | Path | Request | Response | Description |
|--------|------|---------|----------|-------------|
| POST | `/category` | `CreateCategoryRequest` | `Category` | Create category |
| GET | `/category?page=0&size=20` | — | `PageResponse<CategoryResponse>` | Paginated categories |
| GET | `/category/tree?page=0&size=20` | — | `PageResponse<CategoryTree>` | Category tree |
| GET | `/category/{id}` | — | `Category` | Category by ID |
| GET | `/category/parent/{parentId}/tree` | — | `CategoryTree[]` | Subtree by parent |
| GET | `/category/slug/{slug}` | — | `Category` | Category by slug |
| PUT | `/category/{id}` | `CreateCategoryRequest` | `Category` | Upsert category |

### Product Images `/api/product-images`

| Method | Path | Request | Response | Description |
|--------|------|---------|----------|-------------|
| POST | `/product-images/upload/{productId}` | `multipart/form-data` (file) | `Map<String,String>` | Upload image to S3 |
| POST | `/product-images` | `ProductImageRequest` | `ProductImageResponse` | Register image |
| GET | `/product-images/{id}` | — | `ProductImageResponse[]` | Images for product |
| PATCH | `/product-images/{imageId}/primary` | — | `ProductImageResponse[]` | Set primary image |
| PUT | `/product-images/order` | `ImageOrderRequest` | `ProductImageResponse[]` | Reorder images |
| DELETE | `/product-images/{imageId}` | — | `void` | Delete image |

### Orders `/api/orders`

| Method | Path | Request | Response | Description |
|--------|------|---------|----------|-------------|
| POST | `/orders` | `CreateOrderRequest` | `OrderResponse` | Place order |
| GET | `/orders/{id}` | — | `OrderResponse` | Order by ID |
| GET | `/orders/by-order-number/{orderNumber}` | — | `OrderResponse` | Order by number |
| GET | `/orders/user/{userId}?page=0&size=5` | — | `PageResponse<OrderResponse>` | User's orders |
| PATCH | `/orders/{id}/status` | `{ orderStatus: OrderStatus }` | `OrderResponse` | Update status |
| DELETE | `/orders/{id}` | — | `void` | Cancel order |

### Users `/api/users`

| Method | Path | Request | Response | Description |
|--------|------|---------|----------|-------------|
| GET | `/users?page=0&size=10` | — | `PageResponse<User>` | Paginated users |
| GET | `/users/{id}` | — | `User` | User by ID |
| POST | `/users` | `CreateUserRequest` | `User` | Register user |
| DELETE | `/users/{id}` | — | `boolean` | Delete user |
| PATCH | `/users/profile` | `UpdateUserProfileRequest` | `User` | Edit profile |
| POST | `/users/{userId}/addresses` | `AddressRequest` | `AddressResponse` | Add address |
| GET | `/users/{userId}/addresses` | — | `AddressResponse[]` | User addresses |
| GET | `/users/{userId}/addresses/{addressId}` | — | `AddressResponse` | Address by ID |
| PATCH | `/users/{userId}/addresses/{addressId}` | `AddressRequest` | `AddressResponse` | Update address |
| DELETE | `/users/{userId}/addresses/{addressId}` | — | `void` | Delete address |
| PATCH | `/users/{userId}/addresses/{addressId}/set-default` | — | `AddressResponse` | Set default |

---

## Key Enums

```typescript
type ProductStatus = 'ACTIVE' | 'IN_ACTIVE' | 'OUT_OF_STOCK';
type ProductType   = 'PHYSICAL' | 'DIGITAL';
type OrderStatus   = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
type Gender        = 'MALE' | 'FEMALE' | 'OTHER';
```

---

## Architecture

```
src/
├── api/           Axios services (1 file per controller) + mock data
├── components/    Reusable MUI components
├── config/        QueryClient (staleTime 5min, retry 1)
├── context/       AuthContext (auth token stub) + CartContext (client state)
├── hooks/         TanStack Query wrappers per domain
├── pages/         Route-level pages
├── routes/        React Router v6 config
├── types/         TS interfaces mirroring backend DTOs exactly
└── utils/         formatPrice (INR via Intl.NumberFormat)
```

**State rules:**
- Server state → TanStack Query (`useQuery` / `useMutation`)
- Client state → Context API (`CartContext`, `AuthContext`)
- No Redux

---

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Product grid, search, pagination |
| `/products/:id` | ProductDetails | Full product info, Add to Cart |
| `/cart` | Cart | Cart items with quantity controls |
| `/checkout` | Checkout | Order form → `POST /api/orders` |
| `/register` | Register | User creation → `POST /api/users` |
| `/orders` | Orders | Order history → `GET /api/orders/user/:id` |
