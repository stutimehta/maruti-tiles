"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { products } from "./data/products";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* ================= HEADER ================= */}
      <header className="border-b bg-white">
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
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-2xl text-stone-900 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="border-t border-stone-200 bg-white px-6 py-5 md:hidden">
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

      {/* ================= HERO ================= */}
      <section
        id="home"
        className="relative overflow-hidden bg-[#f4f1eb] px-6 py-20 md:py-32"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-16">

          {/* Hero Text */}
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-stone-600">
              Premium Surfaces
            </p>

            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-stone-900 md:text-7xl">
              Designed for
              <span className="block text-stone-500">
                beautiful spaces.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-stone-600">
              Discover premium tiles that bring elegance, durability and
              timeless style to residential and commercial spaces.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#products"
                className="rounded-full bg-stone-900 px-7 py-4 font-semibold text-white transition hover:bg-stone-700"
              >
                Explore Collection
              </a>

              <a
                href="#contact"
                className="rounded-full border border-stone-400 px-7 py-4 font-semibold text-stone-800 transition hover:bg-white"
              >
                Talk to Us
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-8 border-t border-stone-300 pt-7 md:gap-10">
              <div>
                <p className="text-2xl font-bold text-stone-900">
                  Premium
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  Quality
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-stone-900">
                  Morbi
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  Manufacturing
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-stone-900">
                  2026
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  Established
                </p>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-stone-900">
              <div className="flex h-full flex-col items-center justify-center p-8 text-center md:p-10">

                <Image
                  src="/images/brand/logo.png"
                  alt="Maruti Tiles"
                  width={220}
                  height={220}
                  className="object-contain"
                />

                <p className="mt-8 text-sm font-semibold uppercase tracking-[0.35em] text-stone-200 md:tracking-[0.5em]">
                  India & International Export
                </p>

                <p className="mt-4 max-w-sm text-sm leading-6 text-stone-400">
                  Premium tiles, modern surfaces and reliable solutions for
                  residential and commercial spaces.
                </p>

              </div>
            </div>

            <div className="absolute -bottom-6 -left-3 rounded-2xl bg-white p-5 shadow-xl md:-left-6 md:p-6">
              <p className="text-xs uppercase tracking-widest text-stone-500">
                Established
              </p>

              <p className="mt-1 text-2xl font-bold text-stone-900">
                2026
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section
        id="products"
        className="bg-stone-50 px-6 py-20 md:py-24"
      >
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
                Our Collection
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900 md:text-5xl">
                Tiles for every space.
              </h2>

              <p className="mt-5 text-lg leading-8 text-stone-600">
                Explore premium surfaces available in different sizes,
                finishes and designs for residential and commercial projects.
              </p>
            </div>

           <div className="flex flex-wrap gap-3">
  <a
    href="/catalogues/cataloge1.pdf"
    target="_blank"
    rel="noopener noreferrer"
    className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold transition hover:bg-white"
  >
    Premium Catalogue
  </a>

  <a
    href="/catalogues/cataloge2.pdf"
    target="_blank"
    rel="noopener noreferrer"
    className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold transition hover:bg-white"
  >
    Parking Catalogue
  </a>

  <a
    href="/catalogues/cataloge3.pdf"
    target="_blank"
    rel="noopener noreferrer"
    className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold transition hover:bg-white"
  >
    Large Format Catalogue
  </a>
</div>
          </div>

          {/* Product Cards */}
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {products.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                {/* Product Image */}
                <div className="relative h-72 overflow-hidden bg-stone-100">

                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  {/* Product Labels */}
                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">

                    {product.newArrival && (
                      <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-stone-900 shadow-sm">
                        New Arrival
                      </span>
                    )}

                    {product.bestSeller && (
                      <span className="rounded-full bg-stone-900 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                        Best Seller
                      </span>
                    )}

                  </div>
                </div>

                {/* Product Details */}
                <div className="p-7">

                  <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
                    {product.category}
                  </p>

                  <h3 className="mt-3 text-2xl font-semibold text-stone-900">
                    {product.name}
                  </h3>

                  <div className="mt-6 grid grid-cols-2 gap-3">

                    <div className="rounded-xl bg-stone-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                        Size
                      </p>

                      <p className="mt-1 text-sm font-semibold text-stone-800">
                        {product.size}
                      </p>
                    </div>

                    <div className="rounded-xl bg-stone-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                        Finish
                      </p>

                      <p className="mt-1 text-sm font-semibold text-stone-800">
                        {product.finish}
                      </p>
                    </div>

                  </div>

                  <p className="mt-5 text-sm leading-6 text-stone-600">
                    {product.description}
                  </p>

                  <div className="mt-6 border-t border-stone-200 pt-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      Pricing
                    </p>

                    <p className="mt-1 text-sm font-semibold text-stone-900">
                      {product.price}
                    </p>
                  </div>

                  <a
                    href={`/products/${product.id}`}
                    className="mt-6 block rounded-full bg-stone-900 px-5 py-3 text-center font-semibold text-white transition hover:bg-stone-700"
                  >
                    View Product
                  </a>

                </div>
              </article>
            ))}

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