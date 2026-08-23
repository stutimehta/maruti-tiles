import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { products } from "../../data/products";
import AddToCartButton from "../../components/AddToCartButton";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};


/* =========================================================
   SEO
========================================================= */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  const product = products.find(
    (item) => String(item.id) === id
  );

  if (!product) {
    return {
      title: "Product Not Found",
      description:
        "The requested Maruti Tiles product could not be found.",
    };
  }

  const title = `${product.name} | ${product.size} ${product.finish} Tiles`;

  const description = `${product.description} Available for ${product.application}. Explore ${product.name} from Maruti Tiles, Surat, Gujarat.`;

  return {
    title,
    description,

    keywords: [
      product.name,
      `${product.name} tiles`,
      `${product.size} tiles`,
      `${product.finish} tiles`,
      product.category,
      "Maruti Tiles",
      "tiles in Surat",
      "premium tiles Gujarat",
    ],

    alternates: {
      canonical: `/products/${product.id}`,
    },

    openGraph: {
      type: "website",
      title,
      description,
      url: `https://marutitiles.com/products/${product.id}`,
      siteName: "Maruti Tiles",
      images: [
        {
          url: product.image,
          width: 1200,
          height: 900,
          alt: product.name,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image],
    },
  };
}


/* =========================================================
   PRODUCT PAGE
========================================================= */

export default async function ProductPage({
  params,
}: PageProps) {
  const { id } = await params;

  const product = products.find(
    (item) => String(item.id) === id
  );


  /* =======================================================
     PRODUCT NOT FOUND
  ======================================================= */

  if (!product) {
    return (
      <main className="min-h-screen bg-[#0b0b0a] px-6 py-24 text-stone-100">

        <div className="mx-auto max-w-4xl text-center">

          <h1 className="text-4xl font-semibold text-stone-100">
            Product Not Found
          </h1>

          <p className="mt-4 text-stone-400">
            The product you are looking for does not exist.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-block rounded-full bg-[#d2b06c] px-7 py-4 font-semibold text-black transition hover:bg-[#e0c489]"
          >
            Back to Products
          </Link>

        </div>

      </main>
    );
  }


  /* =======================================================
     RELATED PRODUCTS
  ======================================================= */

  const relatedProducts = products
    .filter((item) => item.id !== product.id)
    .slice(0, 3);


  /* =======================================================
     WHATSAPP
  ======================================================= */

  const whatsappMessage = `Hello Maruti Tiles,

I have a query about this product:

${product.name}

Category: ${product.category}
Size: ${product.size}
Finish: ${product.finish}
Price: ₹${product.pricePerSqFt}/sq. ft.

Please share availability, delivery details and any other information.

Thank you.`;

  const whatsappUrl =
    `https://wa.me/918141352183?text=` +
    encodeURIComponent(whatsappMessage);


  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0b0b0a] text-stone-100">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0b0a]/95 text-white backdrop-blur-xl">

        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 sm:px-7 lg:px-10">


          {/* TEXT-ONLY PREMIUM BRAND — NO LOGO */}

          <Link
            href="/"
            className="group flex shrink-0 items-center"
            aria-label="Maruti Tiles Home"
          >
            <div className="leading-none">
              <p className="font-serif text-[27px] font-medium uppercase tracking-[0.16em] text-stone-100 transition group-hover:text-[#d8ba79] sm:text-[32px]">
                Maruti
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="h-px w-6 bg-[#c7a665]" />
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
              className="hidden rounded-full border border-stone-700 px-4 py-2.5 text-xs font-semibold text-stone-200 transition hover:border-[#d2b06c] hover:text-[#d2b06c] sm:inline-flex"
            >
              ♡ Wishlist
            </Link>


            <Link
              href="/cart"
              className="rounded-full border border-stone-700 px-4 py-2.5 text-xs font-semibold text-stone-200 transition hover:border-[#d2b06c] hover:text-[#d2b06c]"
            >
              🛒 Cart
            </Link>


            <Link
              href="/products"
              className="hidden rounded-full border border-[#8f7442] px-5 py-2.5 text-xs font-semibold text-stone-200 transition hover:bg-[#d2b06c] hover:text-black md:inline-flex"
            >
              ← Products
            </Link>

          </div>

        </div>

      </header>


      {/* =====================================================
          PRODUCT DETAILS
      ===================================================== */}

      <section className="relative overflow-hidden px-5 py-10 text-stone-100 sm:px-6 sm:py-14 md:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[5%] top-[8%] h-[420px] w-[420px] rounded-full bg-[#b99558]/10 blur-[140px]" />
          <div className="absolute right-[0%] top-[15%] h-[520px] w-[520px] rounded-full bg-[#d7c29a]/[0.05] blur-[160px]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">


          {/* =================================================
              PRODUCT IMAGE
          ================================================= */}

          <div className="relative h-fit overflow-hidden rounded-[2rem] border border-stone-800 bg-[#151411] shadow-[0_25px_80px_rgba(0,0,0,0.5)]">


            {/* BADGES */}

            <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2 sm:left-5 sm:top-5">

              {product.newArrival && (
                <span className="rounded-full bg-[#f5f1e9] px-4 py-2 text-[10px] font-bold text-stone-900 shadow-md sm:text-xs">
                  New Arrival
                </span>
              )}


              {product.bestSeller && (
                <span className="rounded-full bg-stone-900 px-4 py-2 text-[10px] font-bold text-white shadow-md sm:text-xs">
                  Best Seller
                </span>
              )}

            </div>


            {/* IMAGE */}

            <div className="relative aspect-[4/3] w-full sm:aspect-square">

              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />

            </div>

          </div>


          {/* =================================================
              PRODUCT INFORMATION
          ================================================= */}

          <div className="flex flex-col justify-center">


            {/* CATEGORY */}

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c8a867] sm:text-sm">
              {product.category}
            </p>


            {/* PRODUCT NAME */}

            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              {product.name}
            </h1>


            {/* DESCRIPTION */}

            <p className="mt-5 text-base leading-7 text-stone-400 sm:mt-6 sm:text-lg sm:leading-8">
              {product.description}
            </p>


            {/* =================================================
                SPECIFICATIONS
            ================================================= */}

            <div className="mt-7 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4">


              {/* SIZE */}

              <div className="rounded-2xl border border-stone-800 bg-[#151411] p-4 shadow-[0_12px_35px_rgba(0,0,0,0.2)] sm:p-5">

                <p className="text-[10px] uppercase tracking-widest text-stone-500 sm:text-xs">
                  Size
                </p>

                <p className="mt-2 text-sm font-semibold sm:text-base">
                  {product.size}
                </p>

              </div>


              {/* FINISH */}

              <div className="rounded-2xl border border-stone-800 bg-[#151411] p-4 shadow-[0_12px_35px_rgba(0,0,0,0.2)] sm:p-5">

                <p className="text-[10px] uppercase tracking-widest text-stone-500 sm:text-xs">
                  Finish
                </p>

                <p className="mt-2 text-sm font-semibold sm:text-base">
                  {product.finish}
                </p>

              </div>

            </div>


            {/* =================================================
                APPLICATION
            ================================================= */}

            <div className="mt-4 rounded-2xl border border-stone-800 bg-[#151411] p-4 shadow-[0_12px_35px_rgba(0,0,0,0.2)] sm:mt-6 sm:p-5">

              <p className="text-[10px] uppercase tracking-widest text-stone-500 sm:text-xs">
                Application
              </p>

              <p className="mt-2 text-sm leading-6 text-stone-300 sm:leading-7">
                {product.application}
              </p>

            </div>


            {/* =================================================
                PRICE + QUANTITY + ADD TO CART
            ================================================= */}

            <AddToCartButton
              id={product.id}
              name={product.name}
              category={product.category}
              size={product.size}
              finish={product.finish}
              image={product.image}
              pricePerSqFt={product.pricePerSqFt}
            />


            {/* =================================================
                WHATSAPP QUERY
            ================================================= */}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex min-h-14 w-full items-center justify-center rounded-full border border-[#8f7442] bg-[#d2b06c] px-7 text-center text-sm font-semibold text-black transition hover:bg-[#e0c489] active:scale-[0.98]"
            >
              Any Query? Ask on WhatsApp
            </a>


            <p className="mt-3 text-center text-xs leading-6 text-stone-500 sm:text-sm">
              Have a question about this tile, availability or delivery?
              Message us on WhatsApp.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          RELATED PRODUCTS
      ===================================================== */}

      <section className="border-t border-stone-800 bg-[#090909] px-5 py-16 text-white sm:px-6 sm:py-20">

        <div className="mx-auto max-w-7xl">


          {/* TITLE */}

          <div className="max-w-2xl">

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c8a867] sm:text-sm">
              You May Also Like
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Explore more tiles.
            </h2>

          </div>


          {/* RELATED PRODUCTS */}

          <div className="mt-8 grid gap-6 sm:grid-cols-2 md:mt-10 md:grid-cols-3 md:gap-8">

            {relatedProducts.map((related) => (

              <article
                key={related.id}
                className="overflow-hidden rounded-[2rem] border border-stone-800 bg-[#151411] shadow-[0_15px_50px_rgba(0,0,0,0.3)] transition hover:-translate-y-1 hover:border-[#8f7442] hover:shadow-xl"
              >


                {/* IMAGE */}

                <Link
                  href={`/products/${related.id}`}
                  className="block"
                >

                  <div className="relative aspect-[4/3] overflow-hidden bg-[#11110f]">

                    <Image
                      src={related.image}
                      alt={related.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 hover:scale-[1.03]"
                    />


                    {/* BADGES */}

                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">

                      {related.newArrival && (
                        <span className="rounded-full bg-[#f5f1e9] px-3 py-1.5 text-[10px] font-bold text-stone-900 shadow-sm">
                          New Arrival
                        </span>
                      )}

                      {related.bestSeller && (
                        <span className="rounded-full bg-stone-900 px-3 py-1.5 text-[10px] font-bold text-white shadow-sm">
                          Best Seller
                        </span>
                      )}

                    </div>

                  </div>

                </Link>


                {/* DETAILS */}

                <div className="p-5 sm:p-6">


                  {/* CATEGORY */}

                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#b9a37c]">
                    {related.category}
                  </p>


                  {/* NAME */}

                  <Link href={`/products/${related.id}`}>

                    <h3 className="mt-2 text-xl font-semibold text-stone-100 transition hover:text-[#d7bb83] sm:text-2xl">
                      {related.name}
                    </h3>

                  </Link>


                  {/* SPECS */}

                  <div className="mt-5 grid grid-cols-2 gap-3">


                    <div className="rounded-xl border border-stone-800 bg-[#11110f] p-3">

                      <p className="text-[9px] uppercase tracking-widest text-stone-400">
                        Size
                      </p>

                      <p className="mt-1 text-xs font-semibold text-stone-200 sm:text-sm">
                        {related.size}
                      </p>

                    </div>


                    <div className="rounded-xl border border-stone-800 bg-[#11110f] p-3">

                      <p className="text-[9px] uppercase tracking-widest text-stone-400">
                        Finish
                      </p>

                      <p className="mt-1 text-xs font-semibold text-stone-200 sm:text-sm">
                        {related.finish}
                      </p>

                    </div>

                  </div>


                  {/* PRICE + VIEW */}

                  <div className="mt-6 flex items-center justify-between gap-3">

                    <p className="text-sm font-semibold text-stone-100">

                      ₹
                      {related.pricePerSqFt.toLocaleString("en-IN")}

                      <span className="ml-1 text-xs font-normal text-stone-500">
                        / sq. ft.
                      </span>

                    </p>


                    <Link
                      href={`/products/${related.id}`}
                      className="min-h-11 rounded-full bg-[#d2b06c] px-4 py-3 text-center text-xs font-semibold text-black transition hover:bg-[#e0c489]"
                    >
                      View →
                    </Link>

                  </div>

                </div>

              </article>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-stone-800 bg-[#070706] px-5 py-10 text-center text-white sm:px-6">

        <p className="text-sm">
          © 2026 Maruti Tiles. All Rights Reserved.
        </p>

      </footer>

    </main>
  );
}