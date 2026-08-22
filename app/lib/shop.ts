export type CartItem = {
  id: number;
  name: string;
  category: string;
  size: string;
  finish: string;
  image: string;
  pricePerSqFt: number;
  quantity: number;
};

export type WishlistItem = {
  id: number;
  name: string;
  category: string;
  size: string;
  finish: string;
  image: string;
  pricePerSqFt: number;
};


/* =========================================================
   CART
========================================================= */

export function getCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const saved = localStorage.getItem("maruti-cart");

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}


export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    "maruti-cart",
    JSON.stringify(items)
  );

  window.dispatchEvent(new Event("maruti-cart-updated"));
}


/* =========================================================
   ADD TO CART
========================================================= */

export function addToCart(
  product: CartItem,
  quantity = 1
) {
  const existing = getCart();

  const found = existing.find(
    (item) => item.id === product.id
  );

  let updated: CartItem[];

  if (found) {
    updated = existing.map((item) =>
      item.id === product.id
        ? {
            ...item,
            quantity: item.quantity + quantity,
          }
        : item
    );
  } else {
    updated = [
      ...existing,
      {
        ...product,
        quantity,
      },
    ];
  }

  saveCart(updated);
}


/* =========================================================
   REMOVE FROM CART
========================================================= */

export function removeFromCart(id: number) {
  const existing = getCart();

  saveCart(
    existing.filter(
      (item) => item.id !== id
    )
  );
}


/* =========================================================
   UPDATE CART QUANTITY
========================================================= */

export function updateCartQuantity(
  id: number,
  quantity: number
) {
  const existing = getCart();

  const updated = existing.map((item) =>
    item.id === id
      ? {
          ...item,
          quantity: Math.max(1, quantity),
        }
      : item
  );

  saveCart(updated);
}


/* =========================================================
   WISHLIST
========================================================= */

export function getWishlist(): WishlistItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const saved = localStorage.getItem(
      "maruti-wishlist"
    );

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}


export function saveWishlist(
  items: WishlistItem[]
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    "maruti-wishlist",
    JSON.stringify(items)
  );

  window.dispatchEvent(
    new Event("maruti-wishlist-updated")
  );
}


/* =========================================================
   TOGGLE WISHLIST
========================================================= */

export function toggleWishlist(
  product: WishlistItem
) {
  const existing = getWishlist();

  const alreadyExists = existing.some(
    (item) => item.id === product.id
  );

  if (alreadyExists) {
    saveWishlist(
      existing.filter(
        (item) => item.id !== product.id
      )
    );

    return false;
  }

  saveWishlist([
    ...existing,
    product,
  ]);

  return true;
}


/* =========================================================
   CHECK WISHLIST
========================================================= */

export function isInWishlist(id: number) {
  return getWishlist().some(
    (item) => item.id === id
  );
}


/* =========================================================
   COUNTS
========================================================= */

export function getCartCount() {
  return getCart().reduce(
    (total, item) =>
      total + item.quantity,
    0
  );
}


export function getWishlistCount() {
  return getWishlist().length;
}