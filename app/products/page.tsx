import Image from "next/image";
import Link from "next/link";
import { products } from "../data/products";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#f2efe9] text-stone-900">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-[#f7f5f0]/95 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">

          <Link href="/" className="flex items-center">

            <Image
              src="/images/brand/logo.png"
              alt="Maruti Tiles"
              width={48}
              height={48}
              className="h-11 w-11 object-contain"
            />

            <span className="ml-3 text-lg font-bold tracking-tight sm:text-xl">
              MARUTI TILES
            </span>

          </Link>


          <Link
            href="/"
            className="rounded-full border border-stone-300 px-5 py-2.5 text-xs font-semibold transition hover:bg-stone-950 hover:text-white"
          >
            Back Home
          </Link>

        </div>

      </header>


      {/* ================= HERO ================= */}
      <section className="px-5 pb-10 pt-16 sm:px-6 sm:pt-20 md:pb-14">

        <div className="mx-auto max-w-7xl">

          <div className="flex items-center gap-3">

            <span className="h-px w-10 bg-stone-500" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-stone-500">
              Maruti Tiles · Collection
            </p>

          </div>


          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-stone-950 sm:text-6xl md:text-7xl">

            Explore our

            <span className="block font-normal text-stone-500">
              complete collection.
            </span>

          </h1>


          <p className="mt-6 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
            Discover premium surfaces across large-format and parking tile
            collections, selected for residential, commercial and
            architectural projects.
          </p>

        </div>

      </section>


      {/* ================= PRODUCTS ================= */}
      <section className="px-5 pb-24 sm:px-6">

        <div className="mx-auto max-w-7xl">

          <div className="mb-8 flex items-center justify-between">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
              {products.length} Products
            </p>

            <p className="hidden text-xs text-stone-400 sm:block">
              Premium surfaces · Price on request
            </p>

          </div>


          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">

            {products.map((product) => (

              <article
                key={product.id}
                className="group overflow-hidden rounded-[2rem] border border-stone-200/80 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.11)]"
              >

                {/* ================= IMAGE ================= */}
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">

                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-700 ease-out group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />


                  {/* Badge */}
                  <div className="absolute left-4 top-4">

                    {product.bestSeller ? (

                      <span className="rounded-full bg-stone-950/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white shadow-lg backdrop-blur-md">
                        Best Seller
                      </span>

                    ) : product.newArrival ? (

                      <span className="rounded-full border border-white/40 bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-stone-900 shadow-lg backdrop-blur-md">
                        New Arrival
                      </span>

                    ) : null}

                  </div>

                </div>


                {/* ================= DETAILS ================= */}
                <div className="p-5 sm:p-6">

                  <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-stone-400">
                    {product.category}
                  </p>


                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-950 sm:text-2xl">
                    {product.name}
                  </h2>


                  {/* Specifications */}
                  <div className="mt-5 grid grid-cols-2 gap-2">

                    <div className="rounded-2xl bg-[#f6f3ed] px-3 py-3">

                      <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-stone-400">
                        Size
                      </p>

                      <p className="mt-1 text-xs font-semibold text-stone-800">
                        {product.size}
                      </p>

                    </div>


                    <div className="rounded-2xl bg-[#f6f3ed] px-3 py-3">

                      <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-stone-400">
                        Finish
                      </p>

                      <p className="mt-1 text-xs font-semibold text-stone-800">
                        {product.finish}
                      </p>

                    </div>

                  </div>


                  {/* Description */}
                  <p className="mt-5 line-clamp-2 text-sm leading-6 text-stone-500">
                    {product.description}
                  </p>


                  {/* CTA */}
                  <div className="mt-5 border-t border-stone-200 pt-5">

                    <div className="flex items-center justify-between gap-4">

                      <div>

                        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-stone-400">
                          Pricing
                        </p>

                        <p className="mt-1 text-sm font-semibold text-stone-900">
                          {product.price}
                        </p>

                      </div>


                      <Link
                        href={`/products/${product.id}`}
                        className="inline-flex min-h-11 items-center justify-center rounded-full bg-stone-950 px-5 text-xs font-semibold text-white transition-all duration-300 hover:bg-stone-700 active:scale-95"
                      >
                        View Product
                        <span className="ml-2">
                          →
                        </span>
                      </Link>

                    </div>

                  </div>

                </div>

              </article>

            ))}

          </div>

        </div>

      </section>


      {/* ================= FOOTER CTA ================= */}
      <section className="border-t border-stone-200 bg-[#11100e] px-5 py-16 text-white sm:px-6 md:py-20">

        <div className="mx-auto max-w-4xl text-center">

          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#cbb58f]">
            Need assistance?
          </p>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            Looking for the right surface?
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-stone-400">
            Contact Maruti Tiles for availability, pricing, samples and
            project requirements.
          </p>


          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <a
              href="https://wa.me/918141352183"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-stone-950 transition hover:bg-stone-200"
            >
              WhatsApp Enquiry
            </a>


            <Link
              href="/"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-stone-700 px-7 text-sm font-semibold text-white transition hover:bg-white hover:text-stone-950"
            >
              Back to Home
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}