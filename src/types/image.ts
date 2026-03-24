/** Mirrors ProductImageResponseDto */
export interface ProductImageResponse {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
  altText: string | null;
  imageType: string | null;
  dimensions: string | null;
  fileSize: number | null;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  aspectRatio: number | null;
  createdAt: string;
  updatedAt: string;
}

/** Mirrors ProductImageRequestDto */
export interface ProductImageRequest {
  productId: string;
  imageUrl: string;
  isPrimary?: boolean;
  displayOrder?: number;
  altText?: string;
  imageType?: string;
  fileSize: number;
  mimeType?: string;
  width: number;
  height: number;
}

/** Mirrors ImageOrderRequestDto */
export interface ImageOrderRequest {
  imageOrders: { imageId: string; displayOrder: number }[];
}
