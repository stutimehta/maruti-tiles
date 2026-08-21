"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { products } from "./data/products";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-stone-900">

      {/* ================= HEADER ================= */}
      <header className="border-b border-stone-200/70 bg-[#f7f5f0]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/brand/logo.png"
              alt="Maruti Tiles"
              width={55}
              height={55}
              className="object-contain"
            />

            <span className="ml-3 text-xl font-bold md:text-2xl">
              MARUTI TILES
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#home" className="hover:text-stone-500">
              Home
            </a>

            <a href="#products" className="hover:text-stone-500">
              Products
            </a>

            <a href="#about" className="hover:text-stone-500">
              About
            </a>

            <a href="#contact" className="hover:text-stone-500">
              Contact
            </a>
          </nav>

          {/* Desktop WhatsApp */}
          <a
            href="https://wa.me/918141352183"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-stone-900 px-6 py-3 font-semibold text-white md:block"
          >
            WhatsApp
          </a>

          {/* Mobile Menu Button */}
<button
  type="button"
  onClick={() => setMenuOpen((open) => !open)}
  className="relative z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-900 shadow-sm transition active:scale-95 md:hidden"
  aria-label={menuOpen ? "Close menu" : "Open menu"}
  aria-expanded={menuOpen}
>
  {menuOpen ? (
    <span className="text-xl leading-none">✕</span>
  ) : (
    <span className="flex flex-col gap-1.5">
      <span className="block h-[2px] w-5 bg-stone-900" />
      <span className="block h-[2px] w-5 bg-stone-900" />
      <span className="block h-[2px] w-5 bg-stone-900" />
    </span>
  )}
</button>
        </div>

        {/* Mobile Navigation */}
       {menuOpen && (
  <div className="relative z-50 border-t border-stone-200 bg-[#f7f5f0] px-6 py-6 shadow-xl md:hidden">
            <nav className="flex flex-col gap-5">

              <a
                href="#home"
                onClick={() => setMenuOpen(false)}
                className="font-medium"
              >
                Home
              </a>

              <a
                href="#products"
                onClick={() => setMenuOpen(false)}
                className="font-medium"
              >
                Products
              </a>

              <a
                href="#about"
                onClick={() => setMenuOpen(false)}
                className="font-medium"
              >
                About
              </a>

              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="font-medium"
              >
                Contact
              </a>

              <a
                href="https://wa.me/918141352183"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="rounded-full bg-stone-900 px-6 py-3 text-center font-semibold text-white"
              >
                WhatsApp Enquiry
              </a>

            </nav>
          </div>
        )}
      </header>
{/* ================= PREMIUM HERO ================= */}
<section
  id="home"
  className="relative overflow-hidden bg-[#eee9df] px-5 py-8 sm:px-6 sm:py-12 md:py-20 lg:py-28"
>
  <div className="mx-auto max-w-7xl">

    {/* Top Label */}
    <div className="mb-8 flex items-center gap-3 md:mb-12">
      <span className="h-px w-10 bg-stone-500" />

      <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-stone-600 sm:text-xs">
        Maruti Tiles · Surat · Gujarat
      </p>
    </div>

    <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">

      {/* ================= HERO CONTENT ================= */}
      <div>

        <p className="text-xs font-medium uppercase tracking-[0.3em] text-stone-500">
          Premium Surfaces
        </p>

        <h1 className="mt-5 max-w-4xl text-[3.5rem] font-semibold leading-[0.9] tracking-[-0.06em] text-stone-950 sm:text-6xl md:text-7xl lg:text-[6.2rem]">
          Surfaces

          <span className="block font-normal text-stone-500">
            that define
          </span>

          <span className="block">
            space.
          </span>
        </h1>

        <p className="mt-7 max-w-lg text-base leading-7 text-stone-600 sm:text-lg">
          Premium tiles created for refined residential, commercial and
          architectural spaces.
        </p>


        {/* ================= BUTTONS ================= */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

          <a
            href="#products"
            className="inline-flex min-h-14 items-center justify-center rounded-full bg-stone-950 px-7 text-sm font-semibold text-white shadow-lg shadow-stone-900/10 transition duration-300 hover:-translate-y-0.5 hover:bg-stone-800"
          >
            Explore Collection
            <span className="ml-3 text-lg">
              ↗
            </span>
          </a>

          <a
            href="#contact"
            className="inline-flex min-h-14 items-center justify-center rounded-full border border-stone-400 bg-[#eee9df] px-7 text-sm font-semibold text-stone-900 transition duration-300 hover:-translate-y-0.5 hover:bg-white"
          >
            Talk to Us
          </a>

        </div>


        {/* ================= TRUST DETAILS ================= */}
        <div className="mt-10 grid max-w-xl grid-cols-3 border-t border-stone-300 pt-6">

          <div>
            <p className="text-lg font-semibold text-stone-900 sm:text-xl">
              Premium
            </p>

            <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-stone-500 sm:text-xs">
              Quality
            </p>
          </div>


          <div className="border-l border-stone-300 pl-4 sm:pl-6">
            <p className="text-lg font-semibold text-stone-900 sm:text-xl">
              Morbi
            </p>

            <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-stone-500 sm:text-xs">
              Manufacturing
            </p>
          </div>


          <div className="border-l border-stone-300 pl-4 sm:pl-6">
            <p className="text-lg font-semibold text-stone-900 sm:text-xl">
              2026
            </p>

            <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-stone-500 sm:text-xs">
              Established
            </p>
          </div>

        </div>

      </div>


      {/* ================= PREMIUM VISUAL ================= */}
      <div className="relative">

        <div className="relative min-h-[430px] overflow-hidden rounded-[2rem] border border-stone-800 bg-[#11100e] shadow-[0_30px_80px_rgba(0,0,0,0.15)] sm:min-h-[520px] lg:min-h-[620px]">

          {/* Soft luxury glow */}
          <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b49a72]/10 blur-3xl" />


          {/* Decorative circles */}
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-[#b49a72]/20" />

          <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full border border-[#b49a72]/15" />


          {/* Architectural lines */}
          <div className="absolute left-8 top-8 h-px w-20 bg-[#b49a72]/60" />

          <div className="absolute bottom-8 right-8 h-px w-20 bg-[#b49a72]/60" />


          {/* Main content */}
          <div className="relative flex min-h-[430px] flex-col items-center justify-center px-6 py-12 text-center sm:min-h-[520px] sm:px-10 lg:min-h-[620px]">


            {/* Premium badge */}
            <div className="mb-8 rounded-full border border-[#b49a72]/40 bg-[#b49a72]/5 px-5 py-2">
              <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#d1bd9c]">
                Premium Surfaces
              </p>
            </div>


            {/* Logo */}
            <div className="rounded-full border border-[#b49a72]/30 bg-black/20 p-4 shadow-[0_0_50px_rgba(180,154,114,0.08)] sm:p-6">

              <div className="rounded-full border border-stone-800 bg-[#090908] p-4 sm:p-5">

                <Image
                  src="/images/brand/logo.png"
                  alt="Maruti Tiles"
                  width={170}
                  height={170}
                  className="h-24 w-24 object-contain sm:h-32 sm:w-32"
                />

              </div>

            </div>


            {/* Export */}
            <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.45em] text-[#d1bd9c] sm:text-xs">
              India · International
            </p>


            {/* Divider */}
            <div className="mt-6 h-px w-16 bg-[#b49a72]/60" />


            {/* Description */}
            <p className="mt-6 max-w-sm text-sm leading-7 text-stone-400 sm:text-base">
              Curated surfaces for residential, commercial and architectural
              spaces.
            </p>


            {/* Brand values */}
            <div className="mt-10 flex items-center gap-4 text-[8px] font-semibold uppercase tracking-[0.3em] text-stone-600 sm:text-[9px]">

              <span>
                Design
              </span>

              <span className="h-1 w-1 rounded-full bg-[#b49a72]/60" />

              <span>
                Quality
              </span>

              <span className="h-1 w-1 rounded-full bg-[#b49a72]/60" />

              <span>
                Reliability
              </span>

            </div>

          </div>

        </div>


        {/* ================= FLOATING BADGE ================= */}
        <div className="absolute -bottom-4 left-4 rounded-2xl border border-stone-200 bg-white px-5 py-4 shadow-xl sm:-bottom-5 sm:left-6 sm:px-6 sm:py-5">

          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-stone-400">
            Established
          </p>

          <p className="mt-1 text-xl font-semibold tracking-tight text-stone-900">
            2026
          </p>

        </div>

      </div>

    </div>
  </div>
</section>
          {/* ================= PREMIUM COLLECTION ================= */}
      <section
        id="products"
        className="bg-[#f2efe9] px-5 py-20 sm:px-6 md:py-28"
      >
        <div className="mx-auto max-w-7xl">

          {/* Collection Header */}
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

            <div className="max-w-2xl">

              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-stone-500" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-stone-500">
                  The Collection
                </p>
              </div>

              <h2 className="mt-5 text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-stone-950 sm:text-5xl md:text-6xl">
                Tiles for every
                <span className="block font-normal text-stone-500">
                  beautiful space.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-stone-600 sm:text-base">
                Explore a curated selection of premium surfaces created for
                refined residential, commercial and architectural spaces.
              </p>

            </div>


            {/* Catalogue Buttons */}
            <div className="flex flex-wrap gap-2">

              <a
                href="/catalogues/cataloge1.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-stone-300 bg-white px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-700 transition hover:border-stone-900 hover:bg-stone-950 hover:text-white"
              >
                Premium Catalogue
              </a>

              <a
                href="/catalogues/cataloge2.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-stone-300 bg-white px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-700 transition hover:border-stone-900 hover:bg-stone-950 hover:text-white"
              >
                Parking
              </a>

              <a
                href="/catalogues/cataloge3.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-stone-300 bg-white px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-700 transition hover:border-stone-900 hover:bg-stone-950 hover:text-white"
              >
                Large Format
              </a>

            </div>

          </div>


          {/* ================= FEATURED PRODUCTS ================= */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">

            {products
              .filter((product) =>
                [1, 2, 3, 4, 10, 11].includes(product.id)
              )
              .map((product) => (

                <article
                  key={product.id}
                  className="group overflow-hidden rounded-[2rem] border border-stone-200/80 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
                >

                  {/* Product Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">

                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />


                    {/* Product Label */}
                    <div className="absolute left-4 top-4">

                      {product.bestSeller ? (
                        <span className="rounded-full bg-stone-950/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white shadow-lg backdrop-blur-md">
                          Best Seller
                        </span>
                      ) : (
                        <span className="rounded-full border border-white/40 bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-stone-900 shadow-lg backdrop-blur-md">
                          New Arrival
                        </span>
                      )}

                    </div>

                  </div>


                  {/* Product Details */}
                  <div className="p-5 sm:p-6">

                    <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-stone-400">
                      {product.category}
                    </p>

                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-stone-950 sm:text-2xl">
                      {product.name}
                    </h3>


                    {/* Specs */}
                    <div className="mt-5 flex flex-wrap gap-2">

                      <span className="rounded-full bg-[#f5f2ec] px-3 py-2 text-[10px] font-semibold text-stone-600">
                        {product.size}
                      </span>

                      <span className="rounded-full bg-[#f5f2ec] px-3 py-2 text-[10px] font-semibold text-stone-600">
                        {product.finish}
                      </span>

                    </div>


                    {/* Bottom */}
                    <div className="mt-5 flex items-center justify-between gap-4 border-t border-stone-200 pt-5">

                      <div>

                        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-stone-400">
                          Pricing
                        </p>

                        <p className="mt-1 text-sm font-semibold text-stone-900">
                          {product.price}
                        </p>

                      </div>


                      <a
                        href={`/products/${product.id}`}
                        className="inline-flex min-h-11 items-center justify-center rounded-full bg-stone-950 px-5 text-xs font-semibold text-white transition-all duration-300 hover:bg-stone-700 active:scale-95"
                      >
                        View Product
                        <span className="ml-2">
                          →
                        </span>
                      </a>

                    </div>

                  </div>

                </article>

              ))}

          </div>


          {/* ================= FULL COLLECTION CTA ================= */}
          <div className="mt-12 flex justify-center">

            <a
              href="/products"
              className="group inline-flex min-h-14 items-center justify-center rounded-full border border-stone-400 bg-white px-7 text-sm font-semibold text-stone-900 shadow-sm transition-all duration-300 hover:bg-stone-950 hover:text-white"
            >
              View Full Collection

              <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">
                ↗
              </span>
            </a>

          </div>

        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section
        id="about"
        className="bg-white px-6 py-20 md:py-24"
      >
        <div className="mx-auto max-w-4xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
            About Maruti Tiles
          </p>

          <h2 className="mt-4 text-4xl font-semibold md:text-5xl">
            A new business with a clear vision.
          </h2>

          <p className="mt-7 text-lg leading-8 text-stone-600">
            Established in 2026, Maruti Tiles is focused on building a
            dependable tile business from Surat, Gujarat. With manufacturing
            support in Morbi and import and export capabilities, we serve
            residential, commercial and project requirements.
          </p>

        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section
        id="contact"
        className="bg-[#f4f1eb] px-6 py-20 md:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2">

          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
              Contact
            </p>

            <h2 className="mt-4 text-4xl font-semibold md:text-5xl">
              Let's discuss your requirement.
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">
              Contact us for tile availability, current pricing, bulk
              requirements and project enquiries.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <a
                href="https://wa.me/918141352183"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-stone-900 px-7 py-4 font-semibold text-white"
              >
                WhatsApp Enquiry
              </a>

              <a
                href="tel:+918141352183"
                className="rounded-full border border-stone-400 px-7 py-4 font-semibold"
              >
                Call Now
              </a>

            </div>

          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm md:p-10">

            <p className="text-xs font-bold uppercase tracking-widest text-stone-400">
              Owner
            </p>

            <h3 className="mt-2 text-2xl font-semibold">
              Amit Gohil
            </h3>

            <div className="mt-7 space-y-5 text-sm">

              <div>
                <p className="font-semibold text-stone-900">
                  Phone
                </p>

                <a
                  href="tel:+918141352183"
                  className="text-stone-600 underline"
                >
                  +91 81413 52183
                </a>
              </div>

              <div>
                <p className="font-semibold text-stone-900">
                  Email
                </p>

                <a
                  href="mailto:amitgohil006@gmail.com"
                  className="break-all text-stone-600 underline"
                >
                  amitgohil006@gmail.com
                </a>
              </div>

              <div>
                <p className="font-semibold text-stone-900">
                  Address
                </p>

                <p className="leading-7 text-stone-600">
                  Godawon-19, Maruti Tiles,
                  <br />
                  Near Saroli Bridge, Saroli,
                  <br />
                  Surat, Gujarat 394520
                </p>
              </div>

              <div>
                <p className="font-semibold text-stone-900">
                  Office Hours
                </p>

                <p className="leading-7 text-stone-600">
                  Monday – Saturday: 9:00 AM – 7:00 PM
                  <br />
                  Sunday: 9:30 AM – 8:00 PM
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t bg-black px-6 py-10 text-white">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div>
              <p className="text-xl font-bold">
                MARUTI TILES
              </p>

              <p className="mt-2 text-sm text-stone-400">
                Surat, Gujarat • India & International
              </p>
            </div>

            <p className="text-sm text-stone-500">
              © 2026 Maruti Tiles. All rights reserved.
            </p>

          </div>

        </div>

      </footer>

    </main>
  );
}