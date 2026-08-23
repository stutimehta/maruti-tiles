"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "../lib/supabase";

type CartItem = {
  id: number;
  name: string;
  category: string;
  size: string;
  finish: string;
  image: string;
  pricePerSqFt: number;
  quantity: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("maruti-cart") || "[]"
      ) as CartItem[];

      setCart(saved);
    } catch {
      setCart([]);
    }

    setLoaded(true);
  }, []);

  function saveCart(updatedCart: CartItem[]) {
    setCart(updatedCart);
    localStorage.setItem("maruti-cart", JSON.stringify(updatedCart));
  }

  const quantityOptions = [20, 50, 100, 500];

  function getPackSize(quantity: number) {
    if (quantity >= 500 && quantity % 500 === 0) {
      return 500;
    }

    if (quantity >= 100 && quantity % 100 === 0) {
      return 100;
    }

    if (quantity >= 50 && quantity % 50 === 0) {
      return 50;
    }

    return 20;
  }

  function getRepeatCount(quantity: number) {
    const packSize = getPackSize(quantity);
    return Math.max(1, Math.round(quantity / packSize));
  }

  function increase(id: number) {
    const updated = cart.map((item) => {
      if (item.id !== id) {
        return item;
      }

      const packSize = getPackSize(item.quantity);
      const repeatCount = getRepeatCount(item.quantity);

      return {
        ...item,
        quantity: packSize * (repeatCount + 1),
      };
    });

    saveCart(updated);
  }

  function decrease(id: number) {
    const updated = cart.map((item) => {
      if (item.id !== id) {
        return item;
      }

      const packSize = getPackSize(item.quantity);
      const repeatCount = getRepeatCount(item.quantity);

      return {
        ...item,
        quantity: Math.max(
          packSize,
          packSize * (repeatCount - 1)
        ),
      };
    });

    saveCart(updated);
  }

  function removeItem(id: number) {
    const updated = cart.filter((item) => item.id !== id);
    saveCart(updated);
  }

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + item.pricePerSqFt * item.quantity,
      0
    );
  }, [cart]);

  const totalQuantity = useMemo(() => {
    return cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [cart]);

  async function proceedToCheckout() {
    setCheckingAuth(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        window.location.href = "/checkout";
      } else {
        window.location.href = "/auth";
      }
    } catch {
      window.location.href = "/auth";
    } finally {
      setCheckingAuth(false);
    }
  }

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#0b0b0a]" />
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0b0b0a] text-stone-100">

      {/* =========================================================
          PREMIUM HEADER
      ========================================================= */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0b0a]/95 text-white backdrop-blur-xl">

        <div className="mx-auto flex h-[78px] max-w-[1400px] items-center justify-between px-5 sm:px-7 lg:px-10">

          {/* TEXT ONLY BRAND — NO LOGO */}
          <Link
            href="/"
            className="group flex shrink-0 items-center"
            aria-label="Maruti Tiles Home"
          >
            <div className="leading-none">

              <p className="font-serif text-[29px] font-medium uppercase tracking-[0.12em] text-stone-100 transition group-hover:text-[#d8ba79] sm:text-[33px]">
                MARUTI
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="h-px w-7 bg-[#c7a665]" />

                <p className="text-[8px] font-semibold uppercase tracking-[0.52em] text-[#c7a665] sm:text-[9px]">
                  TILES
                </p>
              </div>

            </div>
          </Link>

          {/* HEADER ACTION */}
          <Link
            href="/products"
            className="rounded-full border border-stone-700 px-5 py-2.5 text-xs font-semibold text-stone-200 transition hover:border-[#c8a867] hover:text-[#d8ba79] sm:px-6"
          >
            Continue Shopping
          </Link>

        </div>
      </header>


      {/* =========================================================
          CART PAGE
      ========================================================= */}

      <section className="relative overflow-hidden px-5 py-14 sm:px-7 md:py-20">

        {/* PREMIUM BACKGROUND */}
        <div className="pointer-events-none absolute inset-0">

          <div className="absolute left-[-10%] top-[8%] h-[500px] w-[500px] rounded-full bg-[#b99558]/10 blur-[150px]" />

          <div className="absolute right-[-8%] top-[20%] h-[600px] w-[600px] rounded-full bg-[#d2b06c]/[0.06] blur-[160px]" />

          <div className="absolute bottom-[-20%] left-[35%] h-[500px] w-[500px] rounded-full bg-[#8f6d37]/[0.05] blur-[150px]" />

        </div>


        <div className="relative mx-auto max-w-[1400px]">

          {/* =====================================================
              PAGE INTRO
          ===================================================== */}

          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">

            <div>

              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#c7a665]" />

                <p className="text-[9px] font-bold uppercase tracking-[0.42em] text-[#c7a665]">
                  Your Selection
                </p>
              </div>


              <h1 className="mt-7 max-w-3xl font-serif text-[4rem] font-medium leading-[0.9] tracking-[-0.055em] text-stone-100 sm:text-6xl md:text-7xl">

                Your
                <span className="block text-[#c7a665]">
                  collection.
                </span>

              </h1>


              <p className="mt-6 text-sm leading-7 text-stone-500 sm:text-base">
                Review your selected surfaces and prepare your
                requirements for the next step.
              </p>

            </div>


            {/* TOTAL AREA */}
            <div className="border-l border-stone-800 pl-5 sm:min-w-[170px] sm:pb-1">

              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-600">
                Selected Area
              </p>

              <p className="mt-2 text-2xl font-semibold text-stone-100">
                {totalQuantity}
                <span className="ml-1 text-sm font-normal text-stone-500">
                  sq. ft.
                </span>
              </p>

            </div>

          </div>


          {/* =====================================================
              EMPTY CART
          ===================================================== */}

          {cart.length === 0 ? (

            <div className="relative mt-14 overflow-hidden rounded-[2rem] border border-stone-800 bg-[#11110f] px-6 py-24 text-center shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:px-10">

              {/* Decorative frame */}
              <div className="absolute left-6 top-6 h-px w-20 bg-[#c7a665]/70" />
              <div className="absolute right-6 top-6 h-16 w-px bg-[#c7a665]/50" />
              <div className="absolute bottom-6 left-6 h-16 w-px bg-[#c7a665]/50" />
              <div className="absolute bottom-6 right-6 h-px w-20 bg-[#c7a665]/70" />


              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#c7a665]/30 bg-[#181611]">

                <span className="text-2xl text-[#c7a665]">
                  🛒
                </span>

              </div>


              <p className="mt-7 text-[9px] font-bold uppercase tracking-[0.4em] text-[#c7a665]">
                Your Selection
              </p>


              <h2 className="mt-4 font-serif text-3xl text-stone-100 sm:text-4xl">
                Your cart is empty
              </h2>


              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-stone-500">
                Explore our collection and discover premium
                surfaces for your next project.
              </p>


              <Link
                href="/products"
                className="mt-9 inline-flex min-h-14 items-center justify-center rounded-lg bg-[#d0ae6c] px-7 text-sm font-semibold text-[#11100e] shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:bg-[#e0c489]"
              >
                Explore Collection

                <span className="ml-4 text-lg">
                  ↗
                </span>
              </Link>

            </div>

          ) : (

            /* =====================================================
               CART WITH ITEMS
            ===================================================== */

            <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_380px]">


              {/* =================================================
                  ITEMS
              ================================================= */}

              <div className="space-y-4">

                {cart.map((item) => (

                  <article
                    key={item.id}
                    className="overflow-hidden rounded-[1.75rem] border border-stone-800 bg-[#11110f] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.25)] transition duration-500 hover:border-stone-700 sm:p-5"
                  >

                    <div className="flex gap-4 sm:gap-6">


                      {/* PRODUCT IMAGE */}

                      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-stone-800 bg-[#181714] sm:h-36 sm:w-36">

                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="144px"
                          className="object-cover transition duration-700 hover:scale-105"
                        />

                      </div>


                      {/* PRODUCT INFO */}

                      <div className="min-w-0 flex-1">

                        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#c7a665]">
                          {item.category}
                        </p>


                        <h2 className="mt-1 text-lg font-semibold text-stone-100 sm:text-xl">
                          {item.name}
                        </h2>


                        <p className="mt-1 text-xs text-stone-500">
                          {item.size} · {item.finish}
                        </p>


                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">


                          {/* QUANTITY */}

                          <div className="flex items-center rounded-full border border-stone-700 bg-[#0d0d0c]">

                            <button
                              type="button"
                              onClick={() => decrease(item.id)}
                              disabled={item.quantity <= 20}
                              aria-label={`Decrease ${item.name} quantity`}
                              className="touch-manipulation flex h-10 w-10 items-center justify-center rounded-full text-lg font-medium text-stone-300 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              −
                            </button>


                            <span className="min-w-[100px] text-center text-sm font-semibold text-stone-200">
                              {item.quantity} sq.ft.
                            </span>


                            <button
                              type="button"
                              onClick={() => increase(item.id)}
                              aria-label={`Increase ${item.name} quantity`}
                              className="touch-manipulation flex h-10 w-10 items-center justify-center rounded-full text-lg font-medium text-stone-300 transition hover:bg-stone-800"
                            >
                              +
                            </button>

                          </div>


                          {/* SUBTOTAL */}

                          <div className="text-right">

                            <p className="text-[9px] uppercase tracking-[0.2em] text-stone-600">
                              Subtotal
                            </p>

                            <p className="mt-1 font-semibold text-stone-100">
                              ₹
                              {(
                                item.pricePerSqFt *
                                item.quantity
                              ).toLocaleString("en-IN")}
                            </p>

                          </div>

                        </div>


                        {/* REMOVE */}

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="mt-4 text-xs font-medium text-stone-600 underline underline-offset-4 transition hover:text-red-400"
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  </article>

                ))}

              </div>


              {/* =================================================
                  ORDER SUMMARY
              ================================================= */}

              <aside className="h-fit rounded-[1.75rem] border border-stone-800 bg-[#11110f] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.3)] sm:p-7">

                <div className="flex items-center gap-3">

                  <span className="h-px w-7 bg-[#c7a665]" />

                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#c7a665]">
                    Order Summary
                  </p>

                </div>


                <div className="mt-7 space-y-5">


                  <div className="flex justify-between text-sm">

                    <span className="text-stone-500">
                      Products
                    </span>

                    <span className="font-semibold text-stone-200">
                      {totalQuantity} sq.ft.
                    </span>

                  </div>


                  <div className="flex justify-between text-sm">

                    <span className="text-stone-500">
                      Product subtotal
                    </span>

                    <span className="font-semibold text-stone-200">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>

                  </div>


                  <div className="border-t border-stone-800 pt-5">

                    <div className="flex items-end justify-between">

                      <div>

                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-600">
                          Total
                        </p>

                        <p className="mt-1 text-2xl font-semibold text-stone-100">
                          ₹{subtotal.toLocaleString("en-IN")}
                        </p>

                      </div>


                      <span className="text-xs text-stone-600">
                        + delivery
                      </span>

                    </div>

                  </div>

                </div>


                {/* DELIVERY */}

                <div className="mt-6 rounded-2xl border border-stone-800 bg-[#0d0d0c] p-4">

                  <p className="text-xs font-semibold text-stone-200">
                    Delivery charges
                  </p>

                  <p className="mt-1 text-xs leading-5 text-stone-600">
                    Delivery will be calculated separately based
                    on location, quantity and transport requirements.
                  </p>

                </div>


                {/* CHECKOUT */}

                <button
                  type="button"
                  onClick={proceedToCheckout}
                  disabled={checkingAuth}
                  className="mt-5 flex min-h-14 w-full items-center justify-center rounded-lg bg-[#d0ae6c] px-6 text-sm font-semibold text-[#11100e] shadow-[0_15px_40px_rgba(0,0,0,0.3)] transition hover:-translate-y-1 hover:bg-[#e0c489] disabled:cursor-not-allowed disabled:opacity-70"
                >

                  {checkingAuth
                    ? "Checking account..."
                    : "Proceed to Checkout"}

                  {!checkingAuth && (
                    <span className="ml-2 text-lg">
                      →
                    </span>
                  )}

                </button>


                {/* WHATSAPP */}

                <a
                  href="https://wa.me/918141352183"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex min-h-14 items-center justify-center rounded-lg border border-stone-700 px-6 text-sm font-semibold text-stone-200 transition hover:border-[#c8a867] hover:text-[#d8ba79]"
                >
                  Need Help? WhatsApp
                </a>

              </aside>

            </div>

          )}

        </div>

      </section>


      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="border-t border-stone-900 bg-[#070706] px-5 py-10 text-center sm:px-7">

        <div className="mx-auto max-w-[1400px]">

          <div className="mx-auto flex w-fit items-center gap-3">

            <span className="h-px w-6 bg-[#c7a665]" />

            <p className="font-serif text-lg tracking-[0.16em] text-stone-300">
              MARUTI TILES
            </p>

            <span className="h-px w-6 bg-[#c7a665]" />

          </div>


          <p className="mt-4 text-[9px] uppercase tracking-[0.35em] text-stone-700">
            Premium Surfaces · Surat · Gujarat · India
          </p>


          <p className="mt-6 text-[10px] text-stone-700">
            © 2026 Maruti Tiles. All Rights Reserved.
          </p>

        </div>

      </footer>

    </main>
  );
}