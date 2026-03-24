/** Mirrors Order.OrderStatus enum */
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

/** Mirrors OrderItemResponseDto */
export interface OrderItemResponse {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
  subtotal: number;
}

/** Mirrors OrderResponseDto */
export interface OrderResponse {
  id: string;
  userId: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  totalAmount: number;
  shippingAddressId: string;
  billingAddressId: string;
  paymentMethod: string;
  items: OrderItemResponse[];
  createdAt: string;
  updatedAt: string;
}

/** Mirrors OrderItemRequestDto */
export interface OrderItemRequest {
  productId: string;
  quantity: number;
}

/** Mirrors CreateOrderRequestDto */
export interface CreateOrderRequest {
  userId: string;
  shippingAddressId: string;
  billingAddressId: string;
  paymentMethod: string;
  items: OrderItemRequest[];
}

/** Mirrors UpdateOrderStatusDto */
export interface UpdateOrderStatusRequest {
  orderStatus: OrderStatus;
}
