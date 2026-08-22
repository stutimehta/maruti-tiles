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
      <main className="min-h-screen bg-stone-50 px-6 py-24">

        <div className="mx-auto max-w-4xl text-center">

          <h1 className="text-4xl font-semibold text-stone-900">
            Product Not Found
          </h1>

          <p className="mt-4 text-stone-600">
            The product you are looking for does not exist.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-block rounded-full bg-stone-900 px-7 py-4 font-semibold text-white transition hover:bg-stone-700"
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
    <main className="min-h-screen bg-[#f5f1e9] text-stone-900">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">


          {/* LOGO */}

          <Link
            href="/"
            className="flex items-center"
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

              <p className="text-lg font-bold tracking-tight sm:text-xl">
                MARUTI TILES
              </p>

              <p className="text-[7px] font-semibold uppercase tracking-[0.35em] text-[#b08d4e]">
                Premium Surfaces
              </p>

            </div>

          </Link>


          {/* HEADER ACTIONS */}

          <div className="flex items-center gap-2">

            <Link
              href="/wishlist"
              className="hidden rounded-full border border-stone-300 px-4 py-2.5 text-xs font-semibold transition hover:bg-stone-950 hover:text-white sm:inline-flex"
            >
              ♡ Wishlist
            </Link>


            <Link
              href="/cart"
              className="rounded-full border border-stone-300 px-4 py-2.5 text-xs font-semibold transition hover:bg-stone-950 hover:text-white"
            >
              🛒 Cart
            </Link>


            <Link
              href="/products"
              className="hidden rounded-full border border-stone-300 px-5 py-2.5 text-xs font-semibold transition hover:bg-stone-950 hover:text-white md:inline-flex"
            >
              ← Products
            </Link>

          </div>

        </div>

      </header>


      {/* =====================================================
          PRODUCT DETAILS
      ===================================================== */}

      <section className="px-5 py-10 sm:px-6 sm:py-14 md:py-20">

        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">


          {/* =================================================
              PRODUCT IMAGE
          ================================================= */}

          <div className="relative h-fit overflow-hidden rounded-[2rem] bg-white shadow-[0_15px_50px_rgba(0,0,0,0.07)]">


            {/* BADGES */}

            <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2 sm:left-5 sm:top-5">

              {product.newArrival && (
                <span className="rounded-full bg-white px-4 py-2 text-[10px] font-bold text-stone-900 shadow-md sm:text-xs">
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

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-500 sm:text-sm">
              {product.category}
            </p>


            {/* PRODUCT NAME */}

            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              {product.name}
            </h1>


            {/* DESCRIPTION */}

            <p className="mt-5 text-base leading-7 text-stone-600 sm:mt-6 sm:text-lg sm:leading-8">
              {product.description}
            </p>


            {/* =================================================
                SPECIFICATIONS
            ================================================= */}

            <div className="mt-7 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4">


              {/* SIZE */}

              <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">

                <p className="text-[10px] uppercase tracking-widest text-stone-400 sm:text-xs">
                  Size
                </p>

                <p className="mt-2 text-sm font-semibold sm:text-base">
                  {product.size}
                </p>

              </div>


              {/* FINISH */}

              <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">

                <p className="text-[10px] uppercase tracking-widest text-stone-400 sm:text-xs">
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

            <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm sm:mt-6 sm:p-5">

              <p className="text-[10px] uppercase tracking-widest text-stone-400 sm:text-xs">
                Application
              </p>

              <p className="mt-2 text-sm leading-6 text-stone-700 sm:leading-7">
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
              className="mt-5 flex min-h-14 w-full items-center justify-center rounded-full border border-stone-300 bg-white px-7 text-center text-sm font-semibold text-stone-900 transition hover:border-stone-900 hover:bg-stone-100 active:scale-[0.98]"
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

      <section className="border-t border-stone-200 bg-white px-5 py-16 sm:px-6 sm:py-20">

        <div className="mx-auto max-w-7xl">


          {/* TITLE */}

          <div className="max-w-2xl">

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500 sm:text-sm">
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
                className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >


                {/* IMAGE */}

                <Link
                  href={`/products/${related.id}`}
                  className="block"
                >

                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">

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
                        <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold shadow-sm">
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

                  <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-500">
                    {related.category}
                  </p>


                  {/* NAME */}

                  <Link href={`/products/${related.id}`}>

                    <h3 className="mt-2 text-xl font-semibold transition hover:text-stone-500 sm:text-2xl">
                      {related.name}
                    </h3>

                  </Link>


                  {/* SPECS */}

                  <div className="mt-5 grid grid-cols-2 gap-3">


                    <div className="rounded-xl bg-stone-50 p-3">

                      <p className="text-[9px] uppercase tracking-widest text-stone-400">
                        Size
                      </p>

                      <p className="mt-1 text-xs font-semibold sm:text-sm">
                        {related.size}
                      </p>

                    </div>


                    <div className="rounded-xl bg-stone-50 p-3">

                      <p className="text-[9px] uppercase tracking-widest text-stone-400">
                        Finish
                      </p>

                      <p className="mt-1 text-xs font-semibold sm:text-sm">
                        {related.finish}
                      </p>

                    </div>

                  </div>


                  {/* PRICE + VIEW */}

                  <div className="mt-6 flex items-center justify-between gap-3">

                    <p className="text-sm font-semibold">

                      ₹
                      {related.pricePerSqFt.toLocaleString("en-IN")}

                      <span className="ml-1 text-xs font-normal text-stone-500">
                        / sq. ft.
                      </span>

                    </p>


                    <Link
                      href={`/products/${related.id}`}
                      className="min-h-11 rounded-full bg-stone-900 px-4 py-3 text-center text-xs font-semibold text-white transition hover:bg-stone-700"
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

      <footer className="border-t bg-stone-900 px-5 py-8 text-center text-white sm:px-6">

        <p className="text-sm">
          © 2026 Maruti Tiles. All rights reserved.
        </p>

      </footer>

    </main>
  );
}