/** Mirrors CartItemResponseDto (cart-service) */
export interface CartItemResponse {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

/** Mirrors CartResponseDto */
export interface CartResponse {
  cartId: string;
  userId: string;
  items: CartItemResponse[];
  totalItems: number;
  totalAmount: number;
  updatedAt: string;
}

/** Mirrors AddCartItemRequestDto */
export interface AddCartItemRequest {
  productId: string;
  quantity: number;
}

/** Mirrors UpdateCartItemRequestDto */
export interface UpdateCartItemRequest {
  quantity: number;
}
