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
      <main className="flex min-h-screen items-center justify-center bg-[#0b0b0a] text-stone-100">
        <p className="text-sm text-stone-500">
          Loading your wishlist...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0b0b0a] text-stone-100">

      {/* =========================================================
          PREMIUM TEXT-ONLY HEADER — NO LOGO
      ========================================================= */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0b0a]/95 text-white backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 sm:px-7 lg:px-10">

          <Link
            href="/"
            className="group flex shrink-0 items-center"
            aria-label="Maruti Tiles Home"
          >
            <div className="leading-none">
              <p className="font-serif text-[27px] font-medium uppercase tracking-[0.16em] text-stone-100 transition group-hover:text-[#d8ba79] sm:text-[32px]">
                Maruti
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="h-px w-6 bg-[#c7a665]" />
                <p className="text-[8px] font-semibold uppercase tracking-[0.52em] text-[#c7a665] sm:text-[9px]">
                  Tiles
                </p>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">

            <Link
              href="/cart"
              className="rounded-full border border-stone-700 px-4 py-2.5 text-xs font-semibold text-stone-200 transition hover:border-[#d2b06c] hover:text-[#d2b06c]"
            >
              🛒 Cart
            </Link>

            <Link
              href="/products"
              className="rounded-full border border-[#8f7442] px-5 py-2.5 text-xs font-semibold text-stone-200 transition hover:bg-[#d2b06c] hover:text-black"
            >
              Products
            </Link>

          </div>
        </div>
      </header>


      {/* =========================================================
          WISHLIST
      ========================================================= */}
      <section className="relative overflow-hidden px-5 py-14 sm:px-7 md:py-20">

        {/* Architectural ambient background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[5%] top-[5%] h-[420px] w-[420px] rounded-full bg-[#b99558]/10 blur-[140px]" />
          <div className="absolute right-[0%] top-[15%] h-[520px] w-[520px] rounded-full bg-[#d7c29a]/[0.05] blur-[160px]" />
          <div className="absolute bottom-[0%] left-[40%] h-[300px] w-[300px] rounded-full bg-[#d2b06c]/[0.04] blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-[1400px]">

          {/* PAGE INTRO */}
          <div className="max-w-3xl">

            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#c7a665]" />

              <p className="text-[9px] font-bold uppercase tracking-[0.42em] text-[#c7a665]">
                Saved Collection
              </p>
            </div>

            <h1 className="mt-7 font-serif text-5xl font-medium leading-[0.95] tracking-[-0.045em] text-stone-100 sm:text-6xl md:text-7xl">
              Your
              <span className="block text-[#c7a665]">
                wishlist.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-sm leading-7 text-stone-400 sm:text-base">
              Save your favourite Maruti Tiles products and return
              whenever you are ready to shape your next space.
            </p>

          </div>


          {/* EMPTY STATE */}
          {items.length === 0 ? (
            <div className="relative mt-14 overflow-hidden rounded-[2rem] border border-stone-800 bg-[#11110f] px-6 py-24 text-center shadow-[0_25px_90px_rgba(0,0,0,0.35)] sm:px-10 md:py-28">

              {/* Decorative architectural lines */}
              <div className="pointer-events-none absolute left-8 top-8 h-px w-24 bg-[#d2b06c]/70" />
              <div className="pointer-events-none absolute right-8 top-8 h-20 w-px bg-[#d2b06c]/50" />
              <div className="pointer-events-none absolute bottom-8 left-8 h-20 w-px bg-[#d2b06c]/50" />
              <div className="pointer-events-none absolute bottom-8 right-8 h-px w-24 bg-[#d2b06c]/70" />

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#8f7442]/50 bg-[#191712]">
                <span className="text-3xl text-[#d2b06c]">
                  ♡
                </span>
              </div>

              <p className="mt-7 text-[9px] font-bold uppercase tracking-[0.38em] text-[#c7a665]">
                Your Selection
              </p>

              <h2 className="mt-4 font-serif text-3xl text-stone-100 sm:text-4xl">
                Your wishlist is empty
              </h2>

              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-stone-500">
                Tap the heart on any product to save it here
                and keep your favourite surfaces close.
              </p>

              <Link
                href="/products"
                className="mt-9 inline-flex min-h-14 items-center justify-center rounded-full bg-[#d2b06c] px-7 text-sm font-semibold text-black shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:bg-[#e0c489]"
              >
                Explore Collection
                <span className="ml-3 text-lg">
                  ↗
                </span>
              </Link>

            </div>
          ) : (

            /* =====================================================
               SAVED PRODUCTS
            ===================================================== */
            <div className="mt-14">

              <div className="mb-7 flex items-center justify-between border-b border-stone-800 pb-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-stone-500">
                  {items.length} Saved {items.length === 1 ? "Product" : "Products"}
                </p>

                <p className="text-[10px] text-stone-600">
                  Premium surfaces · Priced per sq. ft.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {items.map((item) => (
                  <article
                    key={item.id}
                    className="group overflow-hidden rounded-[1.75rem] border border-stone-800 bg-[#151411] shadow-[0_15px_50px_rgba(0,0,0,0.3)] transition duration-500 hover:-translate-y-1 hover:border-[#8f7442] hover:shadow-[0_25px_70px_rgba(0,0,0,0.45)]"
                  >

                    <Link
                      href={`/products/${item.id}`}
                      className="block"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#11110f]">

                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition duration-700 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                        <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-lg text-white backdrop-blur-sm">
                          ♡
                        </div>

                      </div>
                    </Link>

                    <div className="p-5">

                      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#b9a37c]">
                        {item.category}
                      </p>

                      <h2 className="mt-2 text-xl font-semibold text-stone-100">
                        {item.name}
                      </h2>

                      <p className="mt-1 text-xs text-stone-500">
                        {item.size} · {item.finish}
                      </p>

                      <p className="mt-4 text-base font-semibold text-stone-100">
                        ₹{item.pricePerSqFt.toLocaleString("en-IN")}
                        <span className="ml-1 text-xs font-normal text-stone-500">
                          / sq. ft.
                        </span>
                      </p>

                      <div className="mt-5 grid grid-cols-2 gap-2">

                        <button
                          type="button"
                          onClick={() => moveToCart(item)}
                          className="min-h-11 rounded-full bg-[#d2b06c] px-3 text-xs font-semibold text-black transition hover:bg-[#e0c489]"
                        >
                          🛒 Add to Cart
                        </button>

                        <button
                          type="button"
                          onClick={() => removeFromWishlist(item)}
                          className="min-h-11 rounded-full border border-stone-700 px-3 text-xs font-semibold text-stone-300 transition hover:border-red-400/60 hover:text-red-300"
                        >
                          Remove
                        </button>

                      </div>
                    </div>

                  </article>
                ))}

              </div>

            </div>
          )}

        </div>
      </section>


      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="border-t border-stone-800 bg-[#070706] px-5 py-10 text-center text-xs text-stone-600 sm:px-7">

        <div className="mx-auto max-w-[1400px]">

          <div className="mx-auto mb-5 flex w-fit items-center gap-2">
            <span className="h-px w-5 bg-[#c7a665]" />
            <span className="text-[8px] font-semibold uppercase tracking-[0.5em] text-[#c7a665]">
              Maruti Tiles
            </span>
            <span className="h-px w-5 bg-[#c7a665]" />
          </div>

          <p>
            © 2026 Maruti Tiles. All Rights Reserved.
          </p>

        </div>

      </footer>

    </main>
  );
}