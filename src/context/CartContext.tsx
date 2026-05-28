/**
 * CartContext — hybrid cart.
 *
 * Guest (not logged in): items live in memory + localStorage.
 * Authenticated: the backend cart (/api/cart) is the source of truth, accessed
 *   via TanStack Query. On login any guest items are merged into the backend
 *   cart, then the local cart is cleared.
 *
 * The consumer interface (items/addItem/removeItem/updateQuantity/clearCart/
 * totalAmount/itemCount) is identical in both modes.
 */
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as cartApi from '../api/cartService';
import { useAuth } from './AuthContext';

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  itemCount: number;
  isSyncing: boolean;
}

const CartContext = createContext<CartState | null>(null);

const GUEST_KEY = 'pixelcart-guest-cart';

function loadGuestCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [localItems, setLocalItems] = useState<CartItem[]>(loadGuestCart);

  // Persist guest cart.
  useEffect(() => {
    localStorage.setItem(GUEST_KEY, JSON.stringify(localItems));
  }, [localItems]);

  // Backend cart (only when authenticated).
  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
    enabled: isAuthenticated,
  });

  const backendItems: CartItem[] = (cartQuery.data?.data?.items ?? []).map((i) => ({
    productId: i.productId,
    productName: i.productName,
    price: i.unitPrice,
    quantity: i.quantity,
  }));

  function refreshCart() {
    queryClient.invalidateQueries({ queryKey: ['cart'] });
  }

  // ── Guest helpers ──────────────────────────────────────────────────────────
  function localAdd(item: Omit<CartItem, 'quantity'>) {
    setLocalItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }

  // ── Merge guest cart into backend on login ──────────────────────────────────
  const mergedRef = useRef(false);
  useEffect(() => {
    if (!isAuthenticated) {
      mergedRef.current = false;
      return;
    }
    if (mergedRef.current) return;
    mergedRef.current = true;

    const guestItems = loadGuestCart();
    if (guestItems.length === 0) return;

    (async () => {
      try {
        for (const item of guestItems) {
          await cartApi.addCartItem({ productId: item.productId, quantity: item.quantity });
        }
      } finally {
        setLocalItems([]);
        localStorage.removeItem(GUEST_KEY);
        refreshCart();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // ── Public API ──────────────────────────────────────────────────────────────
  function addItem(item: Omit<CartItem, 'quantity'>) {
    if (isAuthenticated) {
      cartApi.addCartItem({ productId: item.productId, quantity: 1 }).then(refreshCart);
    } else {
      localAdd(item);
    }
  }

  function removeItem(productId: string) {
    if (isAuthenticated) {
      cartApi.removeCartItem(productId).then(refreshCart);
    } else {
      setLocalItems((prev) => prev.filter((i) => i.productId !== productId));
    }
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    if (isAuthenticated) {
      cartApi.updateCartItem(productId, { quantity }).then(refreshCart);
    } else {
      setLocalItems((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
      );
    }
  }

  function clearCart() {
    if (isAuthenticated) {
      cartApi.clearCart().then(refreshCart);
    } else {
      setLocalItems([]);
    }
  }

  const items = isAuthenticated ? backendItems : localItems;
  const totalAmount =
    isAuthenticated && cartQuery.data?.data
      ? cartQuery.data.data.totalAmount
      : items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalAmount,
        itemCount,
        isSyncing: isAuthenticated && cartQuery.isFetching,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
