"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getWishlist,
  toggleWishlist,
  addToCart,
  type WishlistItem,
} from "../lib/shop";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(getWishlist());
    setLoaded(true);
  }, []);

  function removeFromWishlist(item: WishlistItem) {
    toggleWishlist(item);
    setItems(getWishlist());
  }

  function moveToCart(item: WishlistItem) {
    addToCart({
      ...item,
      quantity: 1,
    });
  }

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0]">
        <p className="text-sm text-stone-500">
          Loading your wishlist...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-stone-900">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-stone-200 bg-[#f7f5f0]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">

          <Link href="/" className="flex items-center">
            <Image
              src="/images/brand/logo.png"
              alt="Maruti Tiles"
              width={50}
              height={50}
              className="h-11 w-11 object-contain"
            />

            <div className="ml-3">
              <p className="font-serif text-lg font-semibold tracking-[0.08em] sm:text-xl">
                MARUTI TILES
              </p>

              <p className="text-[7px] font-semibold uppercase tracking-[0.35em] text-[#b08c4c]">
                Premium Surfaces
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
  href="/cart"
  className="rounded-full border border-stone-300 bg-white px-4 py-2.5 text-xs font-semibold transition hover:bg-stone-950 hover:text-white"
>
  🛒 Cart
</Link>

            <Link
              href="/products"
              className="hidden rounded-full border border-stone-300 bg-white px-5 py-2.5 text-xs font-semibold transition hover:bg-stone-950 hover:text-white sm:inline-flex"
            >
              Products
            </Link>
          </div>

        </div>
      </header>

      {/* CONTENT */}
      <section className="px-5 py-12 sm:px-6 sm:py-16 md:py-24">
        <div className="mx-auto max-w-7xl">

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-stone-500">
              Saved Collection
            </p>

            <h1 className="mt-4 font-serif text-5xl tracking-tight sm:text-6xl">
              Your wishlist.
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-stone-600 sm:text-base">
              Save your favourite Maruti Tiles products and come
              back when you're ready to add them to your requirement.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="mt-12 rounded-[2rem] border border-stone-200 bg-white px-6 py-20 text-center shadow-sm sm:px-10">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f3f0e9]">
                <span className="text-3xl text-stone-700">
                  ♡
                </span>
              </div>

              <h2 className="mt-6 text-2xl font-semibold">
                Your wishlist is empty
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-stone-500">
                Tap the heart on any product to save it here.
              </p>

              <Link
                href="/products"
                className="mt-8 inline-flex min-h-14 items-center justify-center rounded-full bg-stone-950 px-7 text-sm font-semibold text-white transition hover:bg-stone-800"
              >
                Explore Collection
                <span className="ml-3 text-lg">
                  ↗
                </span>
              </Link>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {items.map((item) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl"
                >

                  <Link
                    href={`/products/${item.id}`}
                    className="block"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">

                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />

                    </div>
                  </Link>

                  <div className="p-5">

                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-stone-400">
                      {item.category}
                    </p>

                    <h2 className="mt-2 text-xl font-semibold">
                      {item.name}
                    </h2>

                    <p className="mt-1 text-xs text-stone-500">
                      {item.size} · {item.finish}
                    </p>

                    <p className="mt-4 text-base font-semibold">
                      ₹{item.pricePerSqFt.toLocaleString("en-IN")}
                      <span className="ml-1 text-xs font-normal text-stone-500">
                        / sq. ft.
                      </span>
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-2">

                      <button
                        type="button"
                        onClick={() => moveToCart(item)}
                        className="min-h-11 rounded-full bg-stone-950 px-3 text-xs font-semibold text-white transition hover:bg-stone-700"
                      >
                        🛒 Add to Cart
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFromWishlist(item)}
                        className="min-h-11 rounded-full border border-stone-300 px-3 text-xs font-semibold text-stone-700 transition hover:border-red-300 hover:text-red-600"
                      >
                        Remove
                      </button>

                    </div>
                  </div>

                </article>
              ))}

            </div>
          )}

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#090908] px-5 py-10 text-center text-xs text-stone-500 sm:px-6">
        <p>
          © 2026 Maruti Tiles. All Rights Reserved.
        </p>
      </footer>

    </main>
  );
}