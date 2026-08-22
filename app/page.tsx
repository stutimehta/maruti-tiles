"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { products } from "./data/products";
import ProductActions from "./components/ProductActions";

const whatsappNumber = "918141352183";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const featuredProducts = products.filter((product) =>
    [1, 10, 19, 17, 3].includes(product.id)
  );

  const heroProducts = [
    products.find((product) => product.id === 1),
    products.find((product) => product.id === 10),
    products.find((product) => product.id === 19),
  ].filter(Boolean);

  /*
   * MOBILE MENU ONLY
   *
   * This does not change desktop behavior.
   */
  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  function closeMobileMenu() {
    setMenuOpen(false);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5f1e9] text-stone-950">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0b0a]/95 text-white backdrop-blur-xl">

        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 sm:px-7 lg:px-10">

          {/* LOGO */}

          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex shrink-0 items-center"
          >
            <Image
              src="/images/brand/logo.png"
              alt="Maruti Tiles"
              width={55}
              height={55}
              priority
              className="h-11 w-11 object-contain sm:h-12 sm:w-12"
            />

            <div className="ml-3">
              <p className="font-serif text-[19px] font-semibold tracking-[0.08em] sm:text-[22px]">
                MARUTI TILES
              </p>

              <p className="mt-0.5 text-[7px] font-semibold uppercase tracking-[0.42em] text-[#c7a665]">
                Premium Surfaces
              </p>
            </div>
          </Link>


          {/* =================================================
              DESKTOP NAV
              NO CHANGE
          ================================================== */}

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


          {/* =================================================
              DESKTOP ACTIONS
              NO CHANGE
          ================================================== */}

          <div className="hidden items-center gap-3 lg:flex">

            <Link
              href="/wishlist"
              className="rounded-full px-4 py-2 text-sm text-stone-300 transition hover:text-white"
            >
              ♡ Wishlist
            </Link>

            <Link
              href="/enquiry"
              aria-label="Cart"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-700 text-lg text-stone-200 transition hover:border-[#d2b06c] hover:text-[#d2b06c]"
            >
              🛒
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


          {/* =================================================
              MOBILE HEADER
          ================================================== */}

          <div className="flex items-center gap-2 lg:hidden">

            {/* MOBILE WISHLIST */}

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              onClick={closeMobileMenu}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-700 text-lg text-white transition active:scale-95 hover:border-[#d2b06c] hover:text-[#d2b06c]"
            >
              ♡
            </Link>


            {/* MOBILE CART */}

            <Link
              href="/enquiry"
              aria-label="Cart"
              onClick={closeMobileMenu}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-700 text-base text-white transition active:scale-95 hover:border-[#d2b06c] hover:text-[#d2b06c]"
            >
              🛒
            </Link>


            {/* =================================================
                MOBILE 3 DOT / MENU BUTTON

                IMPORTANT:
                - relative
                - z-[100]
                - type button
                - pointer events enabled
            ================================================== */}

            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setMenuOpen((value) => !value);
              }}
              className="relative z-[100] flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-full border border-stone-700 text-white transition active:scale-95 hover:border-[#d2b06c]"
            >
              {menuOpen ? (
                <span className="text-2xl leading-none">
                  ×
                </span>
              ) : (
                <span className="flex flex-col gap-1.5">
                  <span className="h-[2px] w-5 rounded-full bg-white" />
                  <span className="h-[2px] w-5 rounded-full bg-white" />
                  <span className="h-[2px] w-5 rounded-full bg-white" />
                </span>
              )}
            </button>

          </div>

        </div>


        {/* =====================================================
            MOBILE MENU

            FIX:
            - fixed position
            - high z-index
            - proper top position
            - touch friendly
            - full width
            - desktop completely unaffected
        ====================================================== */}

        {menuOpen && (
          <>
            {/* MOBILE BACKDROP */}

            <button
              type="button"
              aria-label="Close menu"
              onClick={closeMobileMenu}
              className="fixed inset-0 top-[72px] z-[70] bg-black/50 lg:hidden"
            />


            {/* MOBILE MENU PANEL */}

            <div
              id="mobile-navigation"
              className="fixed left-0 right-0 top-[72px] z-[90] max-h-[calc(100vh-72px)] overflow-y-auto border-t border-stone-800 bg-[#0b0b0a] px-5 py-6 shadow-2xl lg:hidden"
            >

              <nav className="flex flex-col gap-3">

                <a
                  href="#home"
                  onClick={closeMobileMenu}
                  className="rounded-xl px-4 py-4 text-base font-medium text-white transition active:bg-stone-800"
                >
                  Home
                </a>

                <a
                  href="#products"
                  onClick={closeMobileMenu}
                  className="rounded-xl px-4 py-4 text-base font-medium text-white transition active:bg-stone-800"
                >
                  Collection
                </a>

                <a
                  href="#catalogues"
                  onClick={closeMobileMenu}
                  className="rounded-xl px-4 py-4 text-base font-medium text-white transition active:bg-stone-800"
                >
                  Catalogues
                </a>

                <a
                  href="#about"
                  onClick={closeMobileMenu}
                  className="rounded-xl px-4 py-4 text-base font-medium text-white transition active:bg-stone-800"
                >
                  About
                </a>

                <a
                  href="#contact"
                  onClick={closeMobileMenu}
                  className="rounded-xl px-4 py-4 text-base font-medium text-white transition active:bg-stone-800"
                >
                  Contact
                </a>


                {/* DIVIDER */}

                <div className="my-2 h-px bg-stone-800" />


                {/* WISHLIST */}

                <Link
                  href="/wishlist"
                  onClick={closeMobileMenu}
                  className="flex min-h-14 items-center justify-center rounded-full border border-stone-700 px-6 py-3 text-center font-semibold text-white transition active:scale-[0.98] active:bg-stone-800"
                >
                  ♡
                  <span className="ml-2">
                    View Wishlist
                  </span>
                </Link>


                {/* CART */}

                <Link
                  href="/enquiry"
                  onClick={closeMobileMenu}
                  className="flex min-h-14 items-center justify-center rounded-full border border-stone-700 px-6 py-3 text-center font-semibold text-white transition active:scale-[0.98] active:bg-stone-800"
                >
                  🛒
                  <span className="ml-2">
                    View Cart
                  </span>
                </Link>


                {/* WHATSAPP */}

                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobileMenu}
                  className="flex min-h-14 items-center justify-center rounded-full bg-[#d2b06c] px-6 py-3 text-center font-semibold text-black transition active:scale-[0.98]"
                >
                  WhatsApp Enquiry
                </a>

              </nav>

            </div>
          </>
        )}

      </header>


      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        id="home"
        className="relative overflow-hidden bg-[#eee8dc]"
      >

        <div className="mx-auto max-w-[1400px]">

          <div className="grid min-h-[680px] items-stretch lg:grid-cols-[0.9fr_1.1fr]">

            <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-14 xl:px-20">

              <div className="flex items-center gap-3">

                <span className="h-px w-10 bg-stone-700" />

                <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-stone-600">
                  Maruti Tiles · Surat · Gujarat
                </p>

              </div>

              <p className="mt-10 text-[10px] font-bold uppercase tracking-[0.35em] text-[#ad8b4d]">
                Premium Surfaces
              </p>

              <h1 className="mt-5 max-w-[650px] font-serif text-[4.2rem] font-medium leading-[0.86] tracking-[-0.055em] text-stone-950 sm:text-6xl md:text-7xl xl:text-[6.3rem]">

                Surfaces

                <span className="block text-[#b08d4e]">
                  that define
                </span>

                <span className="block">
                  space.
                </span>

              </h1>

              <p className="mt-8 max-w-lg text-base leading-7 text-stone-600 sm:text-lg">
                Premium tiles curated for refined residential,
                commercial and architectural spaces.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                <a
                  href="#products"
                  className="inline-flex min-h-14 items-center justify-center rounded-lg bg-stone-950 px-7 text-sm font-semibold text-white shadow-xl transition hover:-translate-y-1 hover:bg-stone-800"
                >
                  Explore Collection
                  <span className="ml-4 text-lg">↗</span>
                </a>

                <a
                  href="#catalogues"
                  className="inline-flex min-h-14 items-center justify-center rounded-lg border border-stone-400 px-7 text-sm font-semibold text-stone-900 transition hover:-translate-y-1 hover:bg-white"
                >
                  View Catalogues
                </a>

              </div>

              <div className="mt-12 grid max-w-lg grid-cols-3 border-t border-stone-300 pt-6">

                <div>
                  <p className="text-lg font-semibold">◆</p>
                  <p className="mt-3 text-[12px] font-semibold tracking-wide">
                    Premium
                  </p>
                  <p className="mt-1 text-[10px] text-stone-500">
                    Quality
                  </p>
                </div>

                <div className="border-l border-stone-300 pl-4 sm:pl-7">
                  <p className="text-lg font-semibold">▥</p>
                  <p className="mt-3 text-[12px] font-semibold tracking-wide">
                    Morbi
                  </p>
                  <p className="mt-1 text-[10px] text-stone-500">
                    Manufacturing
                  </p>
                </div>

                <div className="border-l border-stone-300 pl-4 sm:pl-7">
                  <p className="text-lg font-semibold">◎</p>
                  <p className="mt-3 text-[12px] font-semibold tracking-wide">
                    India &
                  </p>
                  <p className="mt-1 text-[10px] text-stone-500">
                    International
                  </p>
                </div>

              </div>

            </div>


            {/* HERO VISUAL */}

            <div className="relative min-h-[540px] overflow-hidden bg-[#171512] lg:min-h-full">

              <div className="absolute inset-0 opacity-20">
                <div className="absolute left-[18%] top-[-10%] h-[130%] w-px rotate-[18deg] bg-[#d3b474]" />
                <div className="absolute left-[45%] top-[-10%] h-[130%] w-px rotate-[18deg] bg-[#8d774e]" />
                <div className="absolute right-[20%] top-[-10%] h-[130%] w-px rotate-[18deg] bg-[#d3b474]" />
              </div>

              <div className="absolute right-[-10%] top-[15%] h-[400px] w-[400px] rounded-full bg-[#a9874d]/15 blur-[100px]" />

              <div className="absolute bottom-[10%] left-[8%] right-[8%] h-16 rounded-[50%] border border-[#b99b63]/50 bg-gradient-to-b from-[#413a2e] to-[#141311] shadow-[0_35px_70px_rgba(0,0,0,0.65)] sm:h-20" />

              {heroProducts[0] && (
                <div className="absolute bottom-[16%] left-[21%] h-[330px] w-[190px] rotate-[-10deg] overflow-hidden rounded-[18px] border border-white/20 shadow-[25px_35px_60px_rgba(0,0,0,0.6)] sm:h-[430px] sm:w-[245px]">
                  <Image
                    src={heroProducts[0].image}
                    alt={heroProducts[0].name}
                    fill
                    priority
                    sizes="300px"
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              )}

              {heroProducts[1] && (
                <div className="absolute bottom-[16%] left-[39%] z-10 h-[350px] w-[205px] rotate-[2deg] overflow-hidden rounded-[18px] border border-[#d2b06c]/40 shadow-[30px_35px_70px_rgba(0,0,0,0.65)] sm:h-[450px] sm:w-[255px]">

                  <Image
                    src={heroProducts[1].image}
                    alt={heroProducts[1].name}
                    fill
                    priority
                    sizes="300px"
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />

                  <div className="absolute bottom-7 left-7">
                    <p className="text-[8px] font-bold uppercase tracking-[0.35em] text-white/70">
                      MARUTI TILES
                    </p>
                  </div>

                </div>
              )}

              {heroProducts[2] && (
                <div className="absolute bottom-[16%] left-[57%] h-[330px] w-[190px] rotate-[12deg] overflow-hidden rounded-[18px] border border-white/20 shadow-[25px_35px_60px_rgba(0,0,0,0.65)] sm:h-[430px] sm:w-[245px]">

                  <Image
                    src={heroProducts[2].image}
                    alt={heroProducts[2].name}
                    fill
                    priority
                    sizes="300px"
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                </div>
              )}

              <div className="absolute left-8 top-8 h-px w-24 bg-[#d2b06c]" />
              <div className="absolute right-8 top-8 h-20 w-px bg-[#d2b06c]" />
              <div className="absolute bottom-8 left-8 h-20 w-px bg-[#d2b06c]" />
              <div className="absolute bottom-8 right-8 h-px w-24 bg-[#d2b06c]" />

              <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-center">
                <p className="whitespace-nowrap text-[8px] font-semibold uppercase tracking-[0.4em] text-[#d2b06c]">
                  Design · Quality · Reliability
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CATEGORY STRIP
      ====================================================== */}

      <section className="bg-[#f8f5ef] px-5 py-12 sm:px-7">

        <div className="mx-auto max-w-[1400px]">

          <div className="mb-8 flex items-center justify-center gap-4">

            <span className="h-px w-10 bg-[#c5a265]" />

            <p className="text-[10px] font-bold uppercase tracking-[0.38em] sm:text-[11px]">
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
              href="/products?category=parking"
            />

            <CategoryCard
              title="Carving"
              subtitle="Premium Finish"
              image="/images/products/metrogrey.jpg"
              href="/products?category=carving"
            />

            <CategoryCard
              title="Glossy"
              subtitle="Luxury Surfaces"
              image="/images/products/goldeninfinity.jpg"
              href="/products?category=glossy"
            />

            <CategoryCard
              title="Premium Projects"
              subtitle="Residential & Commercial"
              image="/images/products/frenzy.jpg"
              href="/products?category=projects"
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          COLLECTION
      ====================================================== */}

      <section
        id="products"
        className="bg-[#0d0d0c] px-5 py-20 text-white sm:px-7 md:py-24"
      >

        <div className="mx-auto max-w-[1400px]">

          <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:items-start">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#c8a867]">
                The Collection
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-[0.95] sm:text-5xl">
                Tiles for every

                <span className="block text-stone-500">
                  beautiful space.
                </span>
              </h2>

              <p className="mt-6 text-sm leading-6 text-stone-400">
                Explore our curated selection of premium surfaces
                for modern living.
              </p>

              <Link
                href="/products"
                className="mt-7 inline-flex items-center text-xs font-semibold text-[#d4b574]"
              >
                View All Products
                <span className="ml-3 text-lg">→</span>
              </Link>

            </div>


            {/* PRODUCT GRID */}

            <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">

              {featuredProducts.map((product) => (

                <article
                  key={product.id}
                  className="group relative overflow-hidden rounded-xl bg-white text-stone-950 transition duration-500 hover:-translate-y-2"
                >

                  {/* IMAGE */}

                  <Link
                    href={`/products/${product.id}`}
                    className="block"
                  >

                    <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">

                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 220px"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

                      <div className="absolute left-3 top-3">
                        <span className="rounded-sm bg-[#c6a563] px-2 py-1 text-[7px] font-bold uppercase tracking-[0.12em] text-black">
                          {product.bestSeller ? "Best Seller" : "New"}
                        </span>
                      </div>

                    </div>

                  </Link>


                  {/* ACTIONS */}

                  <div className="absolute right-3 top-3 z-20">

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


                  {/* DETAILS */}

                  <Link
                    href={`/products/${product.id}`}
                    className="block"
                  >

                    <div className="p-4">

                      <h3 className="text-sm font-semibold leading-5">
                        {product.name}
                      </h3>

                      <p className="mt-1 line-clamp-1 text-[9px] text-stone-500">
                        {product.size} | {product.finish}
                      </p>

                      <p className="mt-2 text-sm font-semibold text-stone-900">

                        ₹{product.pricePerSqFt.toLocaleString("en-IN")}

                        <span className="ml-1 text-[10px] font-normal text-stone-500">
                          / sq. ft.
                        </span>

                      </p>

                    </div>

                  </Link>

                </article>

              ))}

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CATALOGUES
      ====================================================== */}

      <section
        id="catalogues"
        className="bg-[#f5f1e9] px-5 py-20 sm:px-7 md:py-24"
      >

        <div className="mx-auto max-w-[1400px]">

          <div className="grid gap-8 lg:grid-cols-[300px_1fr] lg:items-center">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#b18e50]">
                Our Catalogues
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-[0.95] sm:text-5xl">
                Explore our
                <span className="block">
                  premium collections.
                </span>
              </h2>

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


      {/* =====================================================
          ABOUT
      ====================================================== */}

      <section
        id="about"
        className="bg-[#12110f] px-5 py-20 text-white sm:px-7 md:py-24"
      >

        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-2 lg:items-center">

          <div className="relative overflow-hidden rounded-2xl border border-stone-700">

            <div className="aspect-[4/3]">

              <Image
                src="/images/products/omega-white-1005.jpg"
                alt="Maruti Tiles premium surface"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />

            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            <div className="absolute bottom-6 left-6">

              <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#d0af6d]">
                Maruti Tiles
              </p>

              <p className="mt-2 font-serif text-2xl">
                Premium Surfaces
              </p>

            </div>

          </div>


          <div>

            <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#c8a867]">
              About Maruti Tiles
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-[0.95] sm:text-5xl">
              Built around surfaces.

              <span className="block text-stone-500">
                Designed around spaces.
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
                <p className="text-lg font-semibold">2026</p>
                <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-stone-500">
                  Established
                </p>
              </div>

              <div className="border-l border-stone-800 pl-5">
                <p className="text-lg font-semibold">Morbi</p>
                <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-stone-500">
                  Manufacturing
                </p>
              </div>

              <div className="border-l border-stone-800 pl-5">
                <p className="text-lg font-semibold">Global</p>
                <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-stone-500">
                  Reach
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CONTACT
      ====================================================== */}

      <section
        id="contact"
        className="bg-[#f5f1e9] px-5 py-10 sm:px-7 md:py-14"
      >

        <div className="mx-auto max-w-[1200px] rounded-2xl bg-white p-7 shadow-[0_15px_60px_rgba(0,0,0,0.08)] sm:p-10">

          <div className="grid gap-7 lg:grid-cols-[1fr_1fr_1fr] lg:items-center">

            <div>

              <h2 className="font-serif text-3xl sm:text-4xl">
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
              className="flex min-h-16 items-center justify-center rounded-xl border border-stone-200 px-5 transition hover:border-[#c8a867] hover:bg-[#faf8f3]"
            >

              <span className="mr-4 text-2xl text-green-600">
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
                className="flex min-h-14 items-center rounded-xl border border-stone-200 px-5 transition hover:border-[#c8a867]"
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
                className="flex min-h-14 items-center rounded-xl border border-stone-200 px-5 transition hover:border-[#c8a867]"
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


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="bg-[#090908] px-5 py-12 text-white sm:px-7">

        <div className="mx-auto max-w-[1400px]">

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

            <div>

              <Link
                href="/"
                className="flex items-center"
              >

                <Image
                  src="/images/brand/logo.png"
                  alt="Maruti Tiles"
                  width={55}
                  height={55}
                  className="h-11 w-11 object-contain"
                />

                <div className="ml-3">

                  <p className="font-serif text-xl tracking-[0.08em]">
                    MARUTI TILES
                  </p>

                  <p className="mt-1 text-[6px] font-semibold uppercase tracking-[0.4em] text-[#c7a665]">
                    Premium Surfaces
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

                <Link href="/wishlist" className="hover:text-white">
                  Wishlist
                </Link>

                <Link href="/enquiry" className="hover:text-white">
                  Cart
                </Link>

              </div>

            </div>


            <div>

              <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-stone-500">
                Categories
              </p>

              <div className="mt-5 flex flex-col gap-3 text-sm text-stone-400">

                <Link href="/products?category=large-format">
                  Large Format Tiles
                </Link>

                <Link href="/products?category=parking">
                  Parking Tiles
                </Link>

                <Link href="/products?category=carving">
                  Carving Tiles
                </Link>

                <Link href="/products?category=glossy">
                  Glossy Tiles
                </Link>

                <Link href="/products?category=projects">
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
              <span>Privacy Policy</span>
              <span>Terms & Conditions</span>
            </div>

          </div>

        </div>

      </footer>

    </main>
  );
}


/* ============================================================
   CATEGORY CARD
============================================================ */

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

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />

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


/* ============================================================
   CATALOGUE CARD
============================================================ */

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
      className="group flex min-h-[100px] items-center justify-between rounded-xl border border-stone-200 bg-white px-5 transition duration-300 hover:-translate-y-1 hover:border-[#c8a867] hover:shadow-lg"
    >

      <div className="flex items-center gap-4">

        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-stone-200 text-xs font-bold">
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