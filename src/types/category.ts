/** Mirrors CategoryResponseDto */
export interface CategoryResponse {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  createdAt: string;
  updatedAt: string;
  rootCategory: boolean;
}

/** Mirrors CategoryTreeDto (recursive) */
export interface CategoryTree {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  subCategories: CategoryTree[];
}

/** Mirrors CreateCategoryRequest */
export interface CreateCategoryRequest {
  categoryName: string;
  description?: string;
  parentCategoryId?: string | null;
}
