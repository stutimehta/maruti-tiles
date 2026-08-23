"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { products } from "./data/products";
import ProductActions from "./components/ProductActions";
import { getCartCount } from "./lib/shop";

const whatsappNumber = "918141352183";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const refreshCartCount = () => {
      setCartCount(getCartCount());
    };

    refreshCartCount();

    window.addEventListener("maruti-cart-updated", refreshCartCount);

    return () => {
      window.removeEventListener("maruti-cart-updated", refreshCartCount);
    };
  }, []);

  const featuredProducts = products.filter((product) =>
    [1, 10, 19, 17, 3].includes(product.id)
  );

  const heroProducts = [
    products.find((product) => product.id === 1),
    products.find((product) => product.id === 10),
    products.find((product) => product.id === 19),
  ].filter(Boolean);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5f1e9] text-stone-950">

      {/* =========================================================
          HEADER
      ========================================================= */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0b0a]/95 text-white backdrop-blur-xl">

        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 sm:px-7 lg:px-10">

          {/* BRAND — TEXT ONLY, NO LOGO */}
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

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-8 lg:flex">

            <a
              href="#home"
              className="border-b border-[#c7a665] pb-1 text-sm font-medium text-white"
            >
              Home
            </a>

            <a
              href="#products"
              className="text-sm font-medium text-stone-300 transition hover:text-[#d7bb83]"
            >
              Collection
            </a>

            <a
              href="#catalogues"
              className="text-sm font-medium text-stone-300 transition hover:text-[#d7bb83]"
            >
              Catalogues
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-stone-300 transition hover:text-[#d7bb83]"
            >
              About
            </a>

            <a
              href="#contact"
              className="text-sm font-medium text-stone-300 transition hover:text-[#d7bb83]"
            >
              Contact
            </a>

          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden items-center gap-3 lg:flex">

            <Link
              href="/wishlist"
              className="rounded-full px-4 py-2 text-sm text-stone-300 transition hover:text-white"
            >
              ♡ Wishlist
            </Link>

            <Link
              href="/cart"
              aria-label="Cart"
              className="relative flex h-10 items-center justify-center rounded-full border border-stone-700 px-4 text-sm text-stone-200 transition hover:border-[#d2b06c] hover:text-[#d2b06c]"
            >
              🛒 Cart

              {cartCount > 0 && (
                <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d2b06c] px-1 text-[10px] font-bold text-black">
                  {cartCount}
                </span>
              )}
            </Link>

            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#d2b06c] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#e0c489]"
            >
              WhatsApp
            </a>

          </div>

          {/* MOBILE */}
          <div className="flex items-center gap-2 lg:hidden">

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-700 text-lg"
            >
              ♡
            </Link>

            <Link
              href="/cart"
              aria-label="Cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-stone-700 text-lg"
            >
              🛒

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d2b06c] px-1 text-[8px] font-bold text-black">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-700"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? (
                <span className="text-xl">×</span>
              ) : (
                <span className="flex flex-col gap-1.5">
                  <span className="h-[2px] w-5 bg-white" />
                  <span className="h-[2px] w-5 bg-white" />
                  <span className="h-[2px] w-5 bg-white" />
                </span>
              )}
            </button>

          </div>

        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="border-t border-stone-800 bg-[#0b0b0a] px-5 py-6 lg:hidden">

            <nav className="flex flex-col gap-5">

              <a
                href="#home"
                onClick={() => setMenuOpen(false)}
                className="text-base"
              >
                Home
              </a>

              <a
                href="#products"
                onClick={() => setMenuOpen(false)}
                className="text-base"
              >
                Collection
              </a>

              <a
                href="#catalogues"
                onClick={() => setMenuOpen(false)}
                className="text-base"
              >
                Catalogues
              </a>

              <a
                href="#about"
                onClick={() => setMenuOpen(false)}
                className="text-base"
              >
                About
              </a>

              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="text-base"
              >
                Contact
              </a>

              <Link
                href="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="rounded-full border border-stone-700 px-6 py-3 text-center font-semibold"
              >
                ♡ View Wishlist
              </Link>

              <Link
                href="/cart"
                onClick={() => setMenuOpen(false)}
                className="rounded-full border border-stone-700 px-6 py-3 text-center font-semibold"
              >
                🛒 View Cart
              </Link>

              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="rounded-full bg-[#d2b06c] px-6 py-3 text-center font-semibold text-black"
              >
                WhatsApp Enquiry
              </a>

            </nav>

          </div>
        )}

      </header>


      {/* =========================================================
          PREMIUM HERO
      ========================================================= */}
      <section
        id="home"
        className="relative min-h-[760px] overflow-hidden bg-[#090908] text-white lg:min-h-[780px]"
      >

        {/* PREMIUM HERO IMAGE */}
        <div className="absolute inset-0">

          <Image
            src="/images/hero-premium.png"
            alt="Premium architectural tile surfaces"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[68%_center]"
          />

          {/* Dark luxury overlay */}
          <div className="absolute inset-0 bg-black/35" />

          {/* Stronger left-side readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#080807] via-[#080807]/95 via-[42%] to-[#080807]/20" />

          {/* Bottom shadow */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#080807] to-transparent" />

        </div>


        {/* Decorative frame */}
        <div className="pointer-events-none absolute inset-0">

          <div className="absolute left-6 top-6 h-px w-24 bg-[#c9a867] sm:left-10 sm:top-10" />

          <div className="absolute right-6 top-6 h-20 w-px bg-[#c9a867] sm:right-10 sm:top-10" />

          <div className="absolute bottom-8 left-6 h-20 w-px bg-[#c9a867]/70 sm:left-10" />

          <div className="absolute bottom-8 right-6 h-px w-24 bg-[#c9a867]/70 sm:right-10" />

        </div>


        <div className="relative mx-auto flex min-h-[760px] max-w-[1400px] items-center px-6 py-20 sm:px-10 lg:min-h-[780px] lg:px-14 xl:px-20">

          <div className="max-w-[720px]">

            {/* LOCATION */}
            <div className="flex items-center gap-3">

              <span className="h-px w-10 bg-[#c7a665]" />

              <p className="text-[9px] font-bold uppercase tracking-[0.45em] text-[#d0ad69]">
                Surat · Gujarat · India
              </p>

            </div>


            {/* SMALL LABEL */}
            <p className="mt-12 text-[10px] font-semibold uppercase tracking-[0.48em] text-stone-400">
              Architectural Collections
            </p>


            {/* MAIN CREATIVE CAPTION */}
            <h1 className="mt-6 max-w-[680px] font-serif text-[4rem] font-medium leading-[0.88] tracking-[-0.055em] text-stone-100 sm:text-6xl md:text-7xl xl:text-[6.2rem]">

              <span className="block">
                Spaces
                <span className="ml-3 font-serif italic font-normal text-[#c9a867]">
                  with
                </span>
              </span>

              <span className="block font-serif italic font-normal text-[#c9a867]">
                presence.
              </span>

              <span className="mt-2 block">
                Surfaces
                <span className="ml-3 font-serif italic font-normal text-[#c9a867]">
                  with
                </span>
              </span>

              <span className="block">
                purpose.
              </span>

            </h1>


            {/* DESCRIPTION */}
            <p className="mt-9 max-w-xl text-base leading-7 text-stone-300 sm:text-lg">
              Premium tiles curated for architecture,
              interiors and modern living.
            </p>


            {/* BUTTONS */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">

              <a
                href="#products"
                className="inline-flex min-h-14 items-center justify-center rounded-lg bg-[#d2b06c] px-7 text-sm font-semibold text-[#11100e] shadow-[0_18px_50px_rgba(0,0,0,0.45)] transition hover:-translate-y-1 hover:bg-[#e0c489]"
              >
                Explore Collection

                <span className="ml-4 text-lg">
                  ↗
                </span>
              </a>


              <a
                href="#catalogues"
                className="inline-flex min-h-14 items-center justify-center rounded-lg border border-white/25 bg-black/20 px-7 text-sm font-semibold text-stone-100 backdrop-blur-sm transition hover:-translate-y-1 hover:border-[#c7a665] hover:text-[#d7bb83]"
              >
                View Catalogues

                <span className="ml-4 text-lg">
                  →
                </span>
              </a>

            </div>


            {/* PREMIUM PILLARS */}
            <div className="mt-14 grid max-w-xl grid-cols-3 border-t border-white/15 pt-7">

              <div>
                <p className="font-serif text-xl text-stone-100">
                  01
                </p>

                <p className="mt-2 text-[9px] uppercase tracking-[0.25em] text-stone-400">
                  Premium
                </p>
              </div>


              <div className="border-l border-white/15 pl-5 sm:pl-8">

                <p className="font-serif text-xl text-stone-100">
                  02
                </p>

                <p className="mt-2 text-[9px] uppercase tracking-[0.25em] text-stone-400">
                  Timeless
                </p>

              </div>


              <div className="border-l border-white/15 pl-5 sm:pl-8">

                <p className="font-serif text-xl text-stone-100">
                  03
                </p>

                <p className="mt-2 text-[9px] uppercase tracking-[0.25em] text-stone-400">
                  Crafted
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          CATEGORY STRIP
      ========================================================= */}
      <section className="bg-[#11110f] px-5 py-14 text-white sm:px-7">

        <div className="mx-auto max-w-[1400px]">

          <div className="mb-8 flex items-center justify-center gap-4">

            <span className="h-px w-10 bg-[#c5a265]" />

            <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-stone-300 sm:text-[11px]">
              Explore Our Surfaces
            </p>

            <span className="h-px w-10 bg-[#c5a265]" />

          </div>


          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">

            <CategoryCard
              title="Large Format"
              subtitle="600×1200 mm"
              image="/images/products/omega-white-1005.jpg"
              href="#products"
            />

            <CategoryCard
              title="Parking Tiles"
              subtitle="500×500 mm"
              image="/images/products/crystal-7003.jpg"
              href="/products"
            />

            <CategoryCard
              title="Carving"
              subtitle="Premium Finish"
              image="/images/products/metrogrey.jpg"
              href="/products"
            />

            <CategoryCard
              title="Glossy"
              subtitle="Luxury Surfaces"
              image="/images/products/goldeninfinity.jpg"
              href="/products"
            />

            <CategoryCard
              title="Premium Projects"
              subtitle="Residential & Commercial"
              image="/images/products/frenzy.jpg"
              href="/products"
            />

          </div>

        </div>

      </section>


      {/* =========================================================
          COLLECTION
      ========================================================= */}
      <section
        id="products"
        className="bg-[#090909] px-5 py-20 text-white sm:px-7 md:py-24"
      >

        <div className="mx-auto max-w-[1400px]">

          <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:items-end">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#c8a867]">
                The Collection
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-[0.95] sm:text-5xl">
                Material for

                <span className="block text-stone-500">
                  modern spaces.
                </span>
              </h2>

              <p className="mt-6 text-sm leading-6 text-stone-400">
                A considered selection of premium surfaces
                for residential, commercial and architectural projects.
              </p>

              <Link
                href="/products"
                className="mt-7 inline-flex items-center text-xs font-semibold text-[#d4b574]"
              >
                View All Products

                <span className="ml-3 text-lg">
                  →
                </span>
              </Link>

            </div>


            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

              {featuredProducts.map((product) => (

                <Link
                  href={`/products/${product.id}`}
                  key={product.id}
                  className="group overflow-hidden rounded-xl bg-white text-stone-950 transition duration-500 hover:-translate-y-2"
                >

                  <div className="relative aspect-[0.82] overflow-hidden">

                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="300px"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute left-3 top-3">

                      <span className="rounded-sm bg-[#c6a563] px-2 py-1 text-[7px] font-bold uppercase tracking-[0.12em] text-black">
                        {product.bestSeller ? "Best Seller" : "New"}
                      </span>

                    </div>


                    <div
                      className="absolute right-3 top-3 z-20"
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
                        pricePerSqFt={product.pricePerSqFt}
                      />

                    </div>

                  </div>


                  <div className="p-4">

                    <h3 className="text-sm font-semibold">
                      {product.name}
                    </h3>

                    <p className="mt-1 text-[9px] text-stone-500">
                      {product.size} | {product.finish}
                    </p>

                    <p className="mt-4 text-[10px] font-semibold text-stone-800">
                      Price on Request
                    </p>

                  </div>

                </Link>

              ))}

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          CATALOGUES
      ========================================================= */}
      <section
        id="catalogues"
        className="bg-[#151411] px-5 py-20 text-white sm:px-7 md:py-24"
      >

        <div className="mx-auto max-w-[1400px]">

          <div className="grid gap-8 lg:grid-cols-[300px_1fr] lg:items-center">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#b18e50]">
                Our Catalogues
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-[0.95] sm:text-5xl">
                Discover

                <span className="block text-stone-500">
                  the collection.
                </span>
              </h2>

              <p className="mt-6 text-sm leading-6 text-stone-400">
                Explore detailed collections, finishes and formats
                for your next project.
              </p>

            </div>


            <div className="grid gap-4 md:grid-cols-3">

              <CatalogueCard
                title="Premium Tiles"
                file="/catalogues/cataloge1.pdf"
              />

              <CatalogueCard
                title="Parking Tiles"
                file="/catalogues/cataloge2.pdf"
              />

              <CatalogueCard
                title="Large Format Tiles"
                file="/catalogues/cataloge3.pdf"
              />

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          ABOUT
      ========================================================= */}
      <section
        id="about"
        className="bg-[#0b0b0a] px-5 py-20 text-white sm:px-7 md:py-24"
      >

        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-2 lg:items-center">

          <div className="relative overflow-hidden rounded-2xl border border-stone-800 bg-[#151411]">

            <div className="aspect-[4/3]">

              <Image
                src="/images/products/omega-white-1005.jpg"
                alt="Maruti Tiles premium surface"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />

            </div>


            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />


            <div className="absolute bottom-6 left-6">

              <p className="font-serif text-3xl tracking-[0.04em] text-white">
                Maruti Tiles
              </p>

              <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.35em] text-[#d0af6d]">
                Material · Texture · Space
              </p>

            </div>

          </div>


          <div>

            <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#c8a867]">
              About Maruti Tiles
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-[0.95] sm:text-5xl">
              Material with character.

              <span className="block text-stone-500">
                Spaces with identity.
              </span>
            </h2>

            <p className="mt-7 text-sm leading-7 text-stone-400 sm:text-base">
              Established in 2026, Maruti Tiles is focused on building
              a dependable tile business from Surat, Gujarat.
            </p>

            <p className="mt-5 text-sm leading-7 text-stone-500">
              With manufacturing support in Morbi and import and export
              capabilities, we serve residential, commercial and project
              requirements with a focus on quality, design and reliability.
            </p>


            <div className="mt-9 grid grid-cols-3 border-t border-stone-800 pt-6">

              <div>

                <p className="text-lg font-semibold">
                  2026
                </p>

                <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-stone-500">
                  Established
                </p>

              </div>


              <div className="border-l border-stone-800 pl-5">

                <p className="text-lg font-semibold">
                  Morbi
                </p>

                <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-stone-500">
                  Manufacturing
                </p>

              </div>


              <div className="border-l border-stone-800 pl-5">

                <p className="text-lg font-semibold">
                  Global
                </p>

                <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-stone-500">
                  Reach
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          CONTACT CTA
      ========================================================= */}
      <section
        id="contact"
        className="bg-[#151411] px-5 py-12 text-white sm:px-7 md:py-16"
      >

        <div className="mx-auto max-w-[1200px] rounded-2xl border border-stone-800 bg-[#0d0d0c] p-7 shadow-[0_20px_80px_rgba(0,0,0,0.3)] sm:p-10">

          <div className="grid gap-7 lg:grid-cols-[1fr_1fr_1fr] lg:items-center">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#c8a867]">
                Start a conversation
              </p>

              <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                Have a project in mind?
              </h2>

              <p className="mt-2 text-sm text-stone-500">
                We're here to help you.
              </p>

            </div>


            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-16 items-center justify-center rounded-xl border border-stone-800 px-5 transition hover:border-[#c8a867] hover:bg-[#171612]"
            >

              <span className="mr-4 text-2xl text-green-500">
                ◉
              </span>

              <div>

                <p className="text-sm font-semibold">
                  WhatsApp Enquiry
                </p>

                <p className="mt-1 text-xs text-stone-500">
                  Get pricing & availability
                </p>

              </div>

            </a>


            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">

              <a
                href="tel:+918141352183"
                className="flex min-h-14 items-center rounded-xl border border-stone-800 px-5 transition hover:border-[#c8a867]"
              >

                <span className="mr-4 text-xl text-[#ad8a4d]">
                  ☎
                </span>

                <div>

                  <p className="text-xs font-semibold">
                    Call Now
                  </p>

                  <p className="text-xs text-stone-500">
                    +91 81413 52183
                  </p>

                </div>

              </a>


              <a
                href="mailto:amitgohil006@gmail.com"
                className="flex min-h-14 items-center rounded-xl border border-stone-800 px-5 transition hover:border-[#c8a867]"
              >

                <span className="mr-4 text-xl text-[#ad8a4d]">
                  ✉
                </span>

                <div>

                  <p className="text-xs font-semibold">
                    Email Us
                  </p>

                  <p className="break-all text-xs text-stone-500">
                    amitgohil006@gmail.com
                  </p>

                </div>

              </a>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="bg-[#070706] px-5 py-12 text-white sm:px-7">

        <div className="mx-auto max-w-[1400px]">

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

            <div>

              <Link href="/" className="group inline-block">

                <p className="font-serif text-2xl tracking-[0.1em] text-stone-100">
                  Maruti
                </p>

                <div className="mt-1 flex items-center gap-2">

                  <span className="h-px w-5 bg-[#c7a665]" />

                  <p className="text-[8px] font-semibold uppercase tracking-[0.5em] text-[#c7a665]">
                    Tiles
                  </p>

                </div>

              </Link>


              <p className="mt-5 max-w-xs text-sm leading-6 text-stone-500">
                Surat, Gujarat, India & International.
                Premium surfaces for residential,
                commercial and architectural spaces.
              </p>

            </div>


            <div>

              <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-stone-500">
                Quick Links
              </p>

              <div className="mt-5 flex flex-col gap-3 text-sm text-stone-400">

                <a href="#home" className="hover:text-white">
                  Home
                </a>

                <a href="#products" className="hover:text-white">
                  Collection
                </a>

                <a href="#catalogues" className="hover:text-white">
                  Catalogues
                </a>

                <a href="#about" className="hover:text-white">
                  About
                </a>

                <a href="#contact" className="hover:text-white">
                  Contact
                </a>

              </div>

            </div>


            <div>

              <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-stone-500">
                Categories
              </p>

              <div className="mt-5 flex flex-col gap-3 text-sm text-stone-400">

                <Link href="/products">
                  Large Format Tiles
                </Link>

                <Link href="/products">
                  Parking Tiles
                </Link>

                <Link href="/products">
                  Carving Tiles
                </Link>

                <Link href="/products">
                  Glossy Tiles
                </Link>

                <Link href="/products">
                  Premium Projects
                </Link>

              </div>

            </div>


            <div>

              <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-stone-500">
                Get In Touch
              </p>

              <div className="mt-5 flex flex-col gap-4 text-sm text-stone-400">

                <a
                  href="tel:+918141352183"
                  className="hover:text-white"
                >
                  +91 81413 52183
                </a>

                <a
                  href="mailto:amitgohil006@gmail.com"
                  className="break-all hover:text-white"
                >
                  amitgohil006@gmail.com
                </a>

                <p className="leading-6">
                  Godawon-19, Maruti Tiles,
                  <br />
                  Near Saroli Bridge,
                  <br />
                  Saroli, Surat,
                  <br />
                  Gujarat 394520
                </p>

              </div>

            </div>

          </div>


          <div className="mt-10 flex flex-col justify-between gap-4 border-t border-stone-800 pt-6 text-[11px] text-stone-600 sm:flex-row">

            <p>
              © 2026 Maruti Tiles. All Rights Reserved.
            </p>

            <div className="flex gap-5">
              <span>
                Privacy Policy
              </span>

              <span>
                Terms & Conditions
              </span>
            </div>

          </div>

        </div>

      </footer>

    </main>
  );
}


function CategoryCard({
  title,
  subtitle,
  image,
  href,
}: {
  title: string;
  subtitle: string;
  image: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative min-h-[145px] overflow-hidden rounded-xl bg-stone-900 sm:min-h-[165px]"
    >

      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 50vw, 20vw"
        className="object-cover transition duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/5" />

      <div className="absolute bottom-4 left-4 text-white">

        <h3 className="text-sm font-semibold sm:text-base">
          {title}
        </h3>

        <p className="mt-1 text-[9px] text-stone-300">
          {subtitle}
        </p>

      </div>

      <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-sm">
        ↗
      </div>

    </Link>
  );
}


function CatalogueCard({
  title,
  file,
}: {
  title: string;
  file: string;
}) {
  return (
    <a
      href={file}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex min-h-[100px] items-center justify-between rounded-xl border border-stone-800 bg-[#0d0d0c] px-5 transition duration-300 hover:-translate-y-1 hover:border-[#c8a867] hover:shadow-lg"
    >

      <div className="flex items-center gap-4">

        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-stone-700 text-xs font-bold text-[#c8a867]">
          PDF
        </div>

        <div>

          <h3 className="text-sm font-semibold">
            {title}
          </h3>

          <p className="mt-1 text-[10px] text-stone-500">
            View Catalogue
          </p>

        </div>

      </div>


      <span className="text-xl text-[#b08c4c] transition group-hover:translate-y-1">
        ↓
      </span>

    </a>
  );
}