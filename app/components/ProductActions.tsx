"use client";

import { useEffect, useState } from "react";
import {
  addToCart,
  isInWishlist,
  toggleWishlist,
} from "../lib/shop";

type Props = {
  id: number;
  name: string;
  category: string;
  size: string;
  finish: string;
  image: string;
  pricePerSqFt: number;
};

export default function ProductActions({
  id,
  name,
  category,
  size,
  finish,
  image,
  pricePerSqFt,
}: Props) {
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setWishlisted(isInWishlist(id));
  }, [id]);

  function handleWishlist(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    const result = toggleWishlist({
      id,
      name,
      category,
      size,
      finish,
      image,
      pricePerSqFt,
    });

    setWishlisted(result);
  }

  function handleCart(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    addToCart({
      id,
      name,
      category,
      size,
      finish,
      image,
      pricePerSqFt,
      quantity: 1,
    });

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1200);
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={handleWishlist}
        aria-label={
          wishlisted
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
        className={`flex h-9 w-9 items-center justify-center rounded-full border shadow-md backdrop-blur-md transition active:scale-95 ${
          wishlisted
            ? "border-stone-950 bg-stone-950 text-white"
            : "border-stone-200 bg-white/95 text-stone-900 hover:border-stone-900"
        }`}
      >
        <span className="text-lg leading-none">
          {wishlisted ? "♥" : "♡"}
        </span>
      </button>

      <button
        type="button"
        onClick={handleCart}
        aria-label="Add to cart"
        className={`flex h-9 w-9 items-center justify-center rounded-full shadow-md transition active:scale-95 ${
          added
            ? "bg-[#c5a15a] text-stone-950"
            : "bg-stone-950 text-white hover:bg-stone-700"
        }`}
      >
        <span className="text-sm">
          {added ? "✓" : "🛒"}
        </span>
      </button>
    </div>
  );
}