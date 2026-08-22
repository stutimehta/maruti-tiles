
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { products } from "./data/products";

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

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5f1e9] text-stone-950">

      {/* =========================================================
          HEADER
      ========================================================= */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0b0a]/95 text-white backdrop-blur-xl">

        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 sm:px-7 lg:px-10">

          {/* LOGO — SAME EXISTING LOGO */}
          <Link
            href="/"
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
              href="/enquiry"
              className="rounded-full px-4 py-2 text-sm text-stone-300 transition hover:text-white"
            >
              ♡ Enquiry
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
              href="/enquiry"
              aria-label="Enquiry"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-700 text-lg"
            >
              ♡
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
                href="/enquiry"
                onClick={() => setMenuOpen(false)}
                className="rounded-full border border-stone-700 px-6 py-3 text-center font-semibold"
              >
                View Enquiry
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
          HERO
      ========================================================= */}
      <section
        id="home"
        className="relative overflow-hidden bg-[#eee8dc]"
      >

        <div className="mx-auto max-w-[1400px]">

          <div className="grid min-h-[680px] items-stretch lg:grid-cols-[0.9fr_1.1fr]">

            {/* HERO TEXT */}
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


              {/* BUTTONS */}
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                <a
                  href="#products"
                  className="inline-flex min-h-14 items-center justify-center rounded-lg bg-stone-950 px-7 text-sm font-semibold text-white shadow-xl transition hover:-translate-y-1 hover:bg-stone-800"
                >
                  Explore Collection
                  <span className="ml-4 text-lg">
                    ↗
                  </span>
                </a>

                <a
                  href="#catalogues"
                  className="inline-flex min-h-14 items-center justify-center rounded-lg border border-stone-400 px-7 text-sm font-semibold text-stone-900 transition hover:-translate-y-1 hover:bg-white"
                >
                  View Catalogues
                </a>

              </div>


              {/* TRUST */}
              <div className="mt-12 grid max-w-lg grid-cols-3 border-t border-stone-300 pt-6">

                <div>
                  <p className="text-lg font-semibold">
                    ◆
                  </p>

                  <p className="mt-3 text-[12px] font-semibold tracking-wide">
                    Premium
                  </p>

                  <p className="mt-1 text-[10px] text-stone-500">
                    Quality
                  </p>
                </div>


                <div className="border-l border-stone-300 pl-4 sm:pl-7">

                  <p className="text-lg font-semibold">
                    ▥
                  </p>

                  <p className="mt-3 text-[12px] font-semibold tracking-wide">
                    Morbi
                  </p>

                  <p className="mt-1 text-[10px] text-stone-500">
                    Manufacturing
                  </p>

                </div>


                <div className="border-l border-stone-300 pl-4 sm:pl-7">

                  <p className="text-lg font-semibold">
                    ◎
                  </p>

                  <p className="mt-3 text-[12px] font-semibold tracking-wide">
                    India & International 
                  </p>

                  <p className="mt-1 text-[10px] text-stone-500">
                    Export
                  </p>

                </div>

              </div>

            </div>


            {/* HERO VISUAL */}

            <div className="relative min-h-[540px] overflow-hidden bg-[#15130f] lg:min-h-full">

              {/* Premium background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(190,153,82,0.18),transparent_42%),linear-gradient(135deg,#0d0c0a_0%,#211b12_50%,#0d0c0a_100%)]" />

              <div className="absolute inset-0 opacity-30">
                <div className="absolute left-[15%] top-[-10%] h-[130%] w-px rotate-[18deg] bg-[#d3b474]" />
                <div className="absolute left-[45%] top-[-10%] h-[130%] w-px rotate-[18deg] bg-[#8d774e]" />
                <div className="absolute right-[18%] top-[-10%] h-[130%] w-px rotate-[18deg] bg-[#d3b474]" />
              </div>

              {/* Premium glow */}
              <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b08c4c]/15 blur-[110px]" />

              {/* Logo */}
              <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                <div className="rounded-[2rem] border border-[#d2b06c]/30 bg-black/20 p-8 shadow-[0_35px_90px_rgba(0,0,0,0.7)] backdrop-blur-sm sm:p-10">
                  <Image
                    src="/images/brand/logo.png"
                    alt="Maruti Tiles"
                    width={300}
                    height={300}
                    priority
                    className="h-[190px] w-[190px] object-contain sm:h-[250px] sm:w-[250px]"
                  />
                </div>
              </div>

              {/* Premium frame */}
              <div className="absolute left-8 top-8 h-px w-24 bg-[#d2b06c]" />
              <div className="absolute right-8 top-8 h-20 w-px bg-[#d2b06c]" />
              <div className="absolute bottom-8 left-8 h-20 w-px bg-[#d2b06c]" />
              <div className="absolute bottom-8 right-8 h-px w-24 bg-[#d2b06c]" />

              <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-center">
                <p className="whitespace-nowrap text-[8px] font-semibold uppercase tracking-[0.4em] text-[#d2b06c]">
                  Premium Surfaces · Maruti Tiles
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          CATEGORY STRIP
      ========================================================= */}
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
          COLLECTION — DARK
      ========================================================= */}
      <section
        id="products"
        className="bg-[#0d0d0c] px-5 py-20 text-white sm:px-7 md:py-24"
      >

        <div className="mx-auto max-w-[1400px]">

          <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:items-end">

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
                <span className="ml-3 text-lg">
                  →
                </span>
              </Link>

            </div>


            {/* PRODUCT CARDS */}
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


                    <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-sm">
                      ♡
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


      {/* =========================================================
          ABOUT
      ========================================================= */}
      <section
        id="about"
        className="bg-[#12110f] px-5 py-20 text-white sm:px-7 md:py-24"
      >

        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-2 lg:items-center">

          {/* IMAGE */}
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


          {/* TEXT */}
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


      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="bg-[#090908] px-5 py-12 text-white sm:px-7">

        <div className="mx-auto max-w-[1400px]">

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

            {/* BRAND */}
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


            {/* QUICK LINKS */}
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


            {/* CATEGORIES */}
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


            {/* CONTACT */}
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


          {/* COPYRIGHT */}
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


/* ===============================================================
   CATEGORY CARD
   =============================================================== */

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


/* ===============================================================
   CATALOGUE CARD
   =============================================================== */

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
