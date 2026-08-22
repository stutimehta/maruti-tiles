"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { products } from "../data/products";
import ProductActions from "../components/ProductActions";
import {
  getCartCount,
  saveCart,
  getCart,
  type CartItem,
} from "../lib/shop";

export default function ProductsPage() {
  const [cartCount, setCartCount] = useState(0);
  const [category, setCategory] = useState("all");

  // Quantity selected for each product
  const [quantities, setQuantities] = useState<
    Record<number, number>
  >({});

  const [packSizes, setPackSizes] = useState<
    Record<number, number>
  >({});

  const [repeatCounts, setRepeatCounts] = useState<
    Record<number, number>
  >({});

  const quantityOptions = [20, 50, 100, 500];

  function refreshCartCount() {
    setCartCount(getCartCount());
  }

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    setCategory(
      params.get("category") || "all"
    );

    refreshCartCount();

    function handleCartUpdate() {
      refreshCartCount();
    }

    window.addEventListener(
      "maruti-cart-updated",
      handleCartUpdate
    );

    return () => {
      window.removeEventListener(
        "maruti-cart-updated",
        handleCartUpdate
      );
    };
  }, []);

  /* =========================================================
     QUANTITY
  ========================================================= */

  function getPackSize(id: number) {
    return packSizes[id] || 20;
  }

  function getRepeatCount(id: number) {
    return repeatCounts[id] || 1;
  }

  function getQuantity(id: number) {
    return getPackSize(id) * getRepeatCount(id);
  }

  function selectPackSize(id: number, size: number) {
    setPackSizes((current) => ({
      ...current,
      [id]: size,
    }));

    setRepeatCounts((current) => ({
      ...current,
      [id]: 1,
    }));
  }

  function decreaseQuantity(id: number) {
    setRepeatCounts((current) => ({
      ...current,
      [id]: Math.max(1, (current[id] || 1) - 1),
    }));
  }

  function increaseQuantity(id: number) {
    setRepeatCounts((current) => ({
      ...current,
      [id]: (current[id] || 1) + 1,
    }));
  }

  /* =========================================================
     ADD TO CART
  ========================================================= */

  function handleQuickAdd(
    product: (typeof products)[number]
  ) {
    const quantity = getQuantity(product.id);

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
              quantity:
                item.quantity + quantity,
            }
          : item
      );
    } else {
      updated = [
        ...existing,
        {
          id: product.id,
          name: product.name,
          category: product.category,
          size: product.size,
          finish: product.finish,
          image: product.image,
          pricePerSqFt:
            product.pricePerSqFt,
          quantity,
        },
      ];
    }

    saveCart(updated);

    refreshCartCount();

    // Reset selector after adding.
    setPackSizes((current) => ({
      ...current,
      [product.id]: 20,
    }));

    setRepeatCounts((current) => ({
      ...current,
      [product.id]: 1,
    }));
  }

  /* =========================================================
     FILTER PRODUCTS
  ========================================================= */

  const filteredProducts = useMemo(() => {
    if (category === "all") {
      return products;
    }

    return products.filter((product) => {
      const productCategory =
        product.category.toLowerCase();

      if (category === "parking") {
        return productCategory.includes(
          "parking"
        );
      }

      if (category === "large-format") {
        return (
          productCategory.includes("large") ||
          productCategory.includes("format")
        );
      }

      if (category === "carving") {
        return productCategory.includes(
          "carving"
        );
      }

      if (category === "glossy") {
        return product.finish
          .toLowerCase()
          .includes("glossy");
      }

      if (category === "projects") {
        return productCategory.includes(
          "project"
        );
      }

      return true;
    });
  }, [category]);

  /* =========================================================
     CATEGORY TITLE
  ========================================================= */

  const categoryTitle =
    category === "parking"
      ? "Parking Tiles"
      : category === "large-format"
      ? "Large Format Tiles"
      : category === "carving"
      ? "Carving Tiles"
      : category === "glossy"
      ? "Glossy Tiles"
      : category === "projects"
      ? "Premium Projects"
      : "Complete Collection";

  return (
    <main className="min-h-screen bg-[#f2efe9] text-stone-900">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-[#f7f5f0]/95 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">

          {/* LOGO */}

          <Link
            href="/"
            className="flex items-center"
          >
            <Image
              src="/images/brand/logo.png"
              alt="Maruti Tiles"
              width={48}
              height={48}
              className="h-10 w-10 object-contain sm:h-11 sm:w-11"
            />

            <span className="ml-3 text-lg font-bold tracking-tight sm:text-xl">
              MARUTI TILES
            </span>
          </Link>


          {/* HEADER ACTIONS */}

          <div className="flex items-center gap-2">

            {/* WISHLIST */}

            <Link
              href="/wishlist"
              className="hidden rounded-full border border-stone-300 bg-white px-4 py-2.5 text-xs font-semibold transition hover:bg-stone-950 hover:text-white sm:inline-flex"
            >
              ♡ Wishlist
            </Link>


            {/* CART */}

            <Link
              href="/cart"
              className="relative rounded-full border border-stone-300 bg-white px-4 py-2.5 text-xs font-semibold transition hover:bg-stone-950 hover:text-white"
            >
              🛒 Cart

              {cartCount > 0 && (
                <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-stone-950 px-1.5 text-[10px] text-white">
                  {cartCount}
                </span>
              )}
            </Link>


            {/* BACK HOME */}

            <Link
              href="/"
              className="hidden rounded-full border border-stone-300 px-5 py-2.5 text-xs font-semibold transition hover:bg-stone-950 hover:text-white md:inline-flex"
            >
              Back Home
            </Link>

          </div>

        </div>

      </header>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="px-5 pb-10 pt-14 sm:px-6 sm:pt-18">

        <div className="mx-auto max-w-7xl">

          <div className="flex items-center gap-3">

            <span className="h-px w-10 bg-stone-500" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-stone-500">
              Maruti Tiles · Collection
            </p>

          </div>


          <h1 className="mt-6 max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-6xl md:text-7xl">

            {categoryTitle}

            <span className="block font-normal text-stone-500">
              premium surfaces.
            </span>

          </h1>


          <p className="mt-6 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
            Discover premium surfaces selected
            for residential, commercial and
            architectural projects.
          </p>

        </div>

      </section>


      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section className="px-5 pb-24 sm:px-6">

        <div className="mx-auto max-w-7xl">

          {/* COUNT */}

          <div className="mb-8 flex items-center justify-between">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
              {filteredProducts.length} Products
            </p>

            <p className="hidden text-xs text-stone-400 sm:block">
              Premium surfaces · Priced per sq. ft.
            </p>

          </div>


          {/* NO PRODUCTS */}

          {filteredProducts.length === 0 ? (

            <div className="rounded-[2rem] bg-white p-16 text-center">

              <h2 className="text-2xl font-semibold">
                No products found
              </h2>

              <p className="mt-3 text-sm text-stone-500">
                This category does not have
                products yet.
              </p>

              <Link
                href="/products"
                className="mt-7 inline-flex rounded-full bg-stone-950 px-7 py-3 text-sm font-semibold text-white"
              >
                View All Products
              </Link>

            </div>

          ) : (

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">

              {filteredProducts.map((product) => {

                const quantity =
                  getQuantity(product.id);

                const subtotal =
                  product.pricePerSqFt *
                  quantity;

                return (

                  <article
                    key={product.id}
                    className="group relative overflow-hidden rounded-[2rem] border border-stone-200/80 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.11)]"
                  >

                    {/* ================= IMAGE ================= */}

                    <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">

                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-700 group-hover:scale-[1.03]"
                      />


                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />


                      {/* BADGE */}

                      <div className="absolute left-4 top-4 z-10">

                        {product.bestSeller ? (

                          <span className="rounded-full bg-stone-950/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white shadow-lg">
                            Best Seller
                          </span>

                        ) : product.newArrival ? (

                          <span className="rounded-full bg-white/95 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-stone-900 shadow-lg">
                            New Arrival
                          </span>

                        ) : null}

                      </div>


                      {/* WISHLIST + CART */}

                      <div
                        className="absolute right-4 top-4 z-20"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                      >

                        <ProductActions
                          id={product.id}
                          name={product.name}
                          category={product.category}
                          size={product.size}
                          finish={product.finish}
                          image={product.image}
                          pricePerSqFt={
                            product.pricePerSqFt
                          }
                        />

                      </div>

                    </div>


                    {/* ================= DETAILS ================= */}

                    <div className="p-5 sm:p-6">

                      {/* CATEGORY */}

                      <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-stone-400">
                        {product.category}
                      </p>


                      {/* PRODUCT NAME */}

                      <Link
                        href={`/products/${product.id}`}
                        className="block"
                      >
                        <h2 className="mt-2 text-xl font-semibold tracking-tight transition hover:text-stone-500 sm:text-2xl">
                          {product.name}
                        </h2>
                      </Link>


                      {/* SPECS */}

                      <div className="mt-5 grid grid-cols-2 gap-2">

                        <div className="rounded-2xl bg-[#f6f3ed] px-3 py-3">

                          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-stone-400">
                            Size
                          </p>

                          <p className="mt-1 text-xs font-semibold">
                            {product.size}
                          </p>

                        </div>


                        <div className="rounded-2xl bg-[#f6f3ed] px-3 py-3">

                          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-stone-400">
                            Finish
                          </p>

                          <p className="mt-1 text-xs font-semibold">
                            {product.finish}
                          </p>

                        </div>

                      </div>


                      {/* DESCRIPTION */}

                      <p className="mt-5 line-clamp-2 text-sm leading-6 text-stone-500">
                        {product.description}
                      </p>


                      {/* PRICE */}

                      <div className="mt-5 border-t border-stone-200 pt-5">

                        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-stone-400">
                          Price
                        </p>

                        <p className="mt-1 text-lg font-semibold">

                          ₹
                          {product.pricePerSqFt.toLocaleString(
                            "en-IN"
                          )}

                          <span className="ml-1 text-xs font-normal text-stone-500">
                            / sq. ft.
                          </span>

                        </p>

                      </div>


                      {/* =================================================
                          QUANTITY
                      ================================================= */}

                      <div className="mt-5 rounded-2xl border border-stone-200 bg-[#faf8f3] p-3">

                        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-stone-400">
                          Quantity
                        </p>

                        <p className="mt-1 text-[10px] text-stone-500">
                          Select square feet
                        </p>

                        <div className="mt-3 grid grid-cols-2 gap-2">

                          {quantityOptions.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() =>
                                selectPackSize(product.id, option)
                              }
                              className={`min-h-10 rounded-full border px-2 text-[10px] font-semibold transition active:scale-95 ${
                                getPackSize(product.id) === option
                                  ? "border-stone-950 bg-stone-950 text-white"
                                  : "border-stone-200 bg-white text-stone-900 hover:border-stone-950"
                              }`}
                            >
                              {option} sq.ft.
                            </button>
                          ))}

                        </div>

                        <div className="mt-3 flex items-center justify-between rounded-full border border-stone-200 bg-white p-1">

                          <button
                            type="button"
                            onClick={() => decreaseQuantity(product.id)}
                            disabled={getRepeatCount(product.id) <= 1}
                            aria-label={`Decrease ${product.name} quantity`}
                            className="touch-manipulation flex h-9 w-9 items-center justify-center rounded-full text-xl font-medium transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            −
                          </button>

                          <span className="text-[10px] font-semibold">
                            {getRepeatCount(product.id)} ×{" "}
                            {getPackSize(product.id)} ={" "}
                            {quantity} sq.ft.
                          </span>

                          <button
                            type="button"
                            onClick={() => increaseQuantity(product.id)}
                            aria-label={`Increase ${product.name} quantity`}
                            className="touch-manipulation flex h-9 w-9 items-center justify-center rounded-full text-xl font-medium transition hover:bg-stone-100"
                          >
                            +
                          </button>

                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-stone-200 pt-3">

                          <p className="text-[10px] text-stone-500">
                            Subtotal
                          </p>

                          <p className="text-sm font-semibold">
                            ₹
                            {subtotal.toLocaleString("en-IN")}
                          </p>

                        </div>

                      </div>


                      {/* =================================================
                          ACTIONS
                      ================================================= */}

                      <div className="mt-4 grid grid-cols-2 gap-2">

                        {/* ADD TO CART */}

                        <button
                          type="button"
                          onClick={() =>
                            handleQuickAdd(product)
                          }
                          className="min-h-12 rounded-full bg-stone-950 px-3 text-xs font-semibold text-white transition hover:bg-stone-700 active:scale-95"
                        >
                          🛒 Add to Cart
                        </button>


                        {/* VIEW PRODUCT */}

                        <Link
                          href={`/products/${product.id}`}
                          className="inline-flex min-h-12 items-center justify-center rounded-full border border-stone-300 text-xs font-semibold transition hover:border-stone-950"
                        >
                          View Product →
                        </Link>

                      </div>

                    </div>

                  </article>

                );
              })}

            </div>

          )}

        </div>

      </section>

    </main>
  );
}