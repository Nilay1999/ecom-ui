import type { ProductImageResponse } from './image';

/** Mirrors Product.Status enum */
export type ProductStatus = 'ACTIVE' | 'IN_ACTIVE' | 'OUT_OF_STOCK';

/** Mirrors Product.ProductType enum */
export type ProductType = 'PHYSICAL' | 'DIGITAL';

/**
 * Mirrors the full Product entity returned by GET /api/products/{id}
 * Field names match JSON serialization (camelCase, Lombok @Getter).
 */
export interface Product {
  id: string;
  productName: string;
  description: string | null;
  rating: number;
  stockQuantity: number;
  price: number;
  productType: ProductType;
  platform: string | null;
  genre: string | null;
  esrbRating: string | null;
  publisher: string | null;
  developer: string | null;
  releaseDate: string | null;
  region: string;
  systemRequirements: string | null;
  isPreOrder: boolean;
  isEarlyAccess: boolean;
  isDlc: boolean;
  baseGameId: string | null;
  languageSupport: string | null;
  digitalDownloadSize: number | null;
  digitalDeliveryMethod: string | null;
  sku: string | null;
  status: ProductStatus;
  productImages: ProductImageResponse[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Mirrors PaginatedProductListResponseDto
 * Note: backend uses field name "product" (not "productName") for the name.
 */
export interface PaginatedProduct {
  id: string;
  product: string;
  description: string | null;
  rating: number;
  price: number;
  sku: string | null;
  brandname: string | null;
  createdAt: string;
  updatedAt: string;
  /** Not in backend DTO — populated by mock or future API enrichment */
  imageUrl?: string;
}

/** Mirrors SearchProductResponseDto */
export interface SearchProduct {
  id: string;
  productName: string;
  description: string | null;
  price: number;
  stockQuantity: number;
  status: ProductStatus;
  primaryImage: ProductImageResponse | null;
}

/** Mirrors CreateProductRequestDto */
export interface CreateProductRequest {
  productName: string;
  description?: string;
  brandId: string;
  categoryId: string;
  rating?: number;
  stockQuantity: number;
  price: number;
  sku?: string;
  status: ProductStatus;
}

/** Mirrors CreateProductResponseDto */
export interface CreateProductResponse {
  id: string;
  productName: string;
  price: number;
  stockQuantity: number;
  status: ProductStatus;
}

/** Mirrors PartialProductUpdateRequestDto */
export interface PartialProductUpdateRequest {
  productName?: string;
  description?: string;
  price?: number;
  stockQuantity?: number;
  brandId?: string;
  categoryId?: string;
  sku?: string;
}

/** Mirrors PriceUpdateRequestDto */
export interface PriceUpdateRequest {
  price: number;
}

/** Mirrors UpdateProductCategoryDto */
export interface UpdateProductCategoryRequest {
  categoryId: string;
}
