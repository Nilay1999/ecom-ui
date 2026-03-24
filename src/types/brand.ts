/** Mirrors BrandResponseDto */
export interface BrandResponse {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  slug: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Mirrors PaginatedBrandsResponseDto */
export interface PaginatedBrand {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Mirrors CreateBrandRequestDto */
export interface CreateBrandRequest {
  name: string;
  description: string;
  logoUrl: string;
  active: boolean;
}

/** Mirrors UpdateBrandRequestDto */
export interface UpdateBrandRequest {
  name?: string;
  description?: string;
  logoUrl?: string;
  active?: boolean;
}

/** Mirrors UpdateBrandStatusRequestDto */
export interface UpdateBrandStatusRequest {
  active: boolean;
}
