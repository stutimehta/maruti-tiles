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
    <main className="min-h-screen bg-[#090909] text-stone-100">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0b0a]/95 text-white backdrop-blur-xl">

        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-6">

          {/* BRAND — SAME AS MAIN PAGE, NO LOGO */}

          <Link
            href="/"
            className="group flex shrink-0 items-center"
            aria-label="Maruti Tiles Home"
          >
            <div className="leading-none">

              <p className="font-serif text-[25px] font-medium uppercase tracking-[0.12em] text-stone-100 transition group-hover:text-[#d8ba79] sm:text-[29px]">
                Maruti
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="h-px w-5 bg-[#c7a665]" />

                <p className="text-[8px] font-semibold uppercase tracking-[0.52em] text-[#c7a665] sm:text-[9px]">
                  Tiles
                </p>
              </div>

            </div>
          </Link>


          {/* HEADER ACTIONS */}

          <div className="flex items-center gap-2">

            <Link
              href="/wishlist"
              className="hidden rounded-full border border-stone-700 bg-transparent px-4 py-2.5 text-xs font-semibold text-stone-200 transition hover:border-[#d2b06c] hover:text-[#d2b06c] sm:inline-flex"
            >
              ♡ Wishlist
            </Link>

            <Link
              href="/cart"
              className="relative rounded-full border border-stone-700 bg-transparent px-4 py-2.5 text-xs font-semibold text-stone-200 transition hover:border-[#d2b06c] hover:text-[#d2b06c]"
            >
              🛒 Cart

              {cartCount > 0 && (
                <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d2b06c] px-1.5 text-[10px] font-bold text-black">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/"
              className="hidden rounded-full border border-[#d2b06c] px-5 py-2.5 text-xs font-semibold text-[#d2b06c] transition hover:bg-[#d2b06c] hover:text-black md:inline-flex"
            >
              Back Home
            </Link>

          </div>

        </div>

      </header>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-white/10 bg-[#0b0b0a] px-5 pb-14 pt-14 text-white sm:px-6 sm:pt-18">

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[8%] top-[8%] h-[300px] w-[300px] rounded-full bg-[#b99558]/10 blur-[110px]" />
          <div className="absolute right-[5%] top-[10%] h-[360px] w-[360px] rounded-full bg-[#d7c29a]/[0.05] blur-[130px]" />
        </div>

        <div className="relative mx-auto max-w-7xl">

          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[#c7a665]" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#c7a665]">
              Maruti Tiles · Collection
            </p>
          </div>

          <h1 className="mt-7 max-w-5xl font-serif text-5xl font-medium leading-[0.92] tracking-[-0.05em] text-stone-100 sm:text-6xl md:text-7xl">

            {categoryTitle}

            <span className="block font-serif italic font-normal text-[#c6a56b]">
              premium surfaces.
            </span>

          </h1>

          <p className="mt-7 max-w-2xl text-sm leading-7 text-stone-400 sm:text-base">
            Discover premium surfaces selected
            for residential, commercial and
            architectural projects.
          </p>

          <div className="mt-9 flex items-center gap-3">
            <span className="h-px w-16 bg-stone-800" />

            <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-stone-500">
              Material · Texture · Form
            </p>
          </div>

        </div>

      </section>


      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section className="bg-[#090909] px-5 pb-24 pt-10 text-white sm:px-6">

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

            <div className="rounded-[2rem] border border-stone-800 bg-[#11110f] p-16 text-center">

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
                    className="group relative overflow-hidden rounded-[2rem] border border-stone-800 bg-[#11110f] text-white shadow-[0_12px_45px_rgba(0,0,0,0.28)] transition-all duration-500 hover:-translate-y-1 hover:border-[#8f774d] hover:shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
                  >

                    {/* ================= IMAGE ================= */}

                    <div className="relative aspect-[4/3] overflow-hidden bg-[#171612]">

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

                        <div className="rounded-2xl border border-stone-800 bg-[#171612] px-3 py-3">

                          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-stone-400">
                            Size
                          </p>

                          <p className="mt-1 text-xs font-semibold">
                            {product.size}
                          </p>

                        </div>


                        <div className="rounded-2xl border border-stone-800 bg-[#171612] px-3 py-3">

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

                      <div className="mt-5 rounded-2xl border border-stone-800 bg-[#151411] p-3">

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
                                  ? "border-[#c7a665] bg-[#c7a665] text-black"
                                  : "border-stone-200 bg-white text-stone-900 hover:border-stone-950"
                              }`}
                            >
                              {option} sq.ft.
                            </button>
                          ))}

                        </div>

                        <div className="mt-3 flex items-center justify-between rounded-full border border-stone-700 bg-[#0d0d0c] p-1">

                          <button
                            type="button"
                            onClick={() => decreaseQuantity(product.id)}
                            disabled={getRepeatCount(product.id) <= 1}
                            aria-label={`Decrease ${product.name} quantity`}
                            className="touch-manipulation flex h-9 w-9 items-center justify-center rounded-full text-xl font-medium text-stone-200 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-30"
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
                            className="touch-manipulation flex h-9 w-9 items-center justify-center rounded-full text-xl font-medium text-stone-200 transition hover:bg-stone-800"
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
                          className="min-h-12 rounded-full bg-[#d2b06c] px-3 text-xs font-semibold text-black transition hover:bg-[#e0c489] active:scale-95"
                        >
                          🛒 Add to Cart
                        </button>


                        {/* VIEW PRODUCT */}

                        <Link
                          href={`/products/${product.id}`}
                          className="inline-flex min-h-12 items-center justify-center rounded-full border border-stone-700 text-xs font-semibold text-stone-200 transition hover:border-[#c7a665] hover:text-[#d7bb83]"
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