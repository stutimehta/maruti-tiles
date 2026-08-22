"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

  function increase(id: number) {
    const updated = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );

    saveCart(updated);
  }

  function decrease(id: number) {
    const updated = cart
      .map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
      .filter((item) => item.quantity > 0);

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

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#f2efe9]" />
    );
  }

  return (
    <main className="min-h-screen bg-[#f2efe9] text-stone-900">

      {/* HEADER */}

      <header className="border-b border-stone-200 bg-[#f7f5f0]">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6">

          <Link
            href="/"
            className="flex items-center"
          >
            <Image
              src="/images/brand/logo.png"
              alt="Maruti Tiles"
              width={48}
              height={48}
              className="h-11 w-11 object-contain"
            />

            <span className="ml-3 text-lg font-bold tracking-tight">
              MARUTI TILES
            </span>
          </Link>

          <Link
            href="/products"
            className="rounded-full border border-stone-300 px-5 py-2.5 text-xs font-semibold transition hover:bg-stone-950 hover:text-white"
          >
            Continue Shopping
          </Link>

        </div>

      </header>


      {/* PAGE */}

      <section className="px-5 py-14 sm:px-6 md:py-20">

        <div className="mx-auto max-w-7xl">

          <div className="flex items-end justify-between gap-6">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#b38d48]">
                Your selection
              </p>

              <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-stone-950 sm:text-6xl">
                Your Cart
              </h1>

              <p className="mt-4 text-sm text-stone-500">
                {totalQuantity} sq. ft. selected
              </p>

            </div>

          </div>


          {cart.length === 0 ? (

            <div className="mt-12 rounded-[2rem] border border-stone-200 bg-white px-6 py-20 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f4f0e8] text-2xl">
                🛒
              </div>

              <h2 className="mt-6 text-2xl font-semibold">
                Your cart is empty
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-stone-500">
                Explore our collection and add the surfaces
                you need for your project.
              </p>

              <Link
                href="/products"
                className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-stone-950 px-7 text-sm font-semibold text-white transition hover:bg-stone-700"
              >
                Explore Collection
                <span className="ml-2">→</span>
              </Link>

            </div>

          ) : (

            <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px]">

              {/* ITEMS */}

              <div className="space-y-4">

                {cart.map((item) => (

                  <article
                    key={item.id}
                    className="rounded-[2rem] border border-stone-200 bg-white p-4 shadow-sm sm:p-5"
                  >

                    <div className="flex gap-4 sm:gap-6">

                      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-stone-100 sm:h-36 sm:w-36">

                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="144px"
                          className="object-cover"
                        />

                      </div>


                      <div className="min-w-0 flex-1">

                        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-stone-400">
                          {item.category}
                        </p>

                        <h2 className="mt-1 text-lg font-semibold text-stone-950 sm:text-xl">
                          {item.name}
                        </h2>

                        <p className="mt-1 text-xs text-stone-500">
                          {item.size} · {item.finish}
                        </p>


                        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">

                          {/* QUANTITY */}

                          <div className="flex items-center rounded-full border border-stone-300 bg-[#f7f5f0]">

                            <button
                              type="button"
                              onClick={() => decrease(item.id)}
                              className="flex h-10 w-10 items-center justify-center text-lg font-medium transition hover:bg-white"
                            >
                              −
                            </button>

                            <span className="min-w-12 text-center text-sm font-semibold">
                              {item.quantity} sq.ft.
                            </span>

                            <button
                              type="button"
                              onClick={() => increase(item.id)}
                              className="flex h-10 w-10 items-center justify-center text-lg font-medium transition hover:bg-white"
                            >
                              +
                            </button>

                          </div>


                          <div className="text-right">

                            <p className="text-[9px] uppercase tracking-[0.2em] text-stone-400">
                              Subtotal
                            </p>

                            <p className="mt-1 font-semibold">
                              ₹
                              {(
                                item.pricePerSqFt *
                                item.quantity
                              ).toLocaleString("en-IN")}
                            </p>

                          </div>

                        </div>


                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="mt-3 text-xs font-medium text-stone-400 underline underline-offset-4 transition hover:text-red-600"
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  </article>

                ))}

              </div>


              {/* SUMMARY */}

              <aside className="h-fit rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-7">

                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
                  Order Summary
                </p>

                <div className="mt-6 space-y-4">

                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">
                      Products
                    </span>

                    <span className="font-semibold">
                      {totalQuantity} sq.ft.
                    </span>
                  </div>


                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">
                      Product subtotal
                    </span>

                    <span className="font-semibold">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>


                  <div className="border-t border-stone-200 pt-5">

                    <div className="flex items-end justify-between">

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                          Total
                        </p>

                        <p className="mt-1 text-2xl font-semibold">
                          ₹{subtotal.toLocaleString("en-IN")}
                        </p>
                      </div>

                      <span className="text-xs text-stone-400">
                        + delivery
                      </span>

                    </div>

                  </div>

                </div>


                <div className="mt-6 rounded-2xl bg-[#f6f3ed] p-4">

                  <p className="text-xs font-semibold">
                    Delivery charges
                  </p>

                  <p className="mt-1 text-xs leading-5 text-stone-500">
                    Delivery will be calculated separately based
                    on location, quantity and transport requirements.
                  </p>

                </div>


                <Link
                  href="/checkout"
                  className="mt-5 flex min-h-14 items-center justify-center rounded-full bg-stone-950 px-6 text-sm font-semibold text-white transition hover:bg-stone-700"
                >
                  Proceed to Checkout
                  <span className="ml-2">→</span>
                </Link>


                <a
                  href="https://wa.me/918141352183"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex min-h-14 items-center justify-center rounded-full border border-stone-300 px-6 text-sm font-semibold transition hover:border-stone-950"
                >
                  Need Help? WhatsApp
                </a>

              </aside>

            </div>

          )}

        </div>

      </section>

    </main>
  );
}