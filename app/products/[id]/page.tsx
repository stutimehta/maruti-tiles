import Image from "next/image";
import Link from "next/link";
import { products } from "../../data/products";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  const product = products.find(
    (item) => String(item.id) === id
  );

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
            href="/#products"
            className="mt-8 inline-block rounded-full bg-stone-900 px-7 py-4 font-semibold text-white"
          >
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const relatedProducts = products
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

  const whatsappMessage = `Hello Maruti Tiles,

I am interested in:
${product.name}

Category: ${product.category}
Size: ${product.size}
Finish: ${product.finish}

Please share the price and availability.`;

  const whatsappUrl = `https://wa.me/918141352183?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

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

          <Link
            href="/#products"
            className="text-sm font-semibold transition hover:text-stone-500"
          >
            ← Back to Products
          </Link>

        </div>
      </header>


      {/* Product Details */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2">

          {/* Product Image */}
          <div className="relative overflow-hidden rounded-3xl bg-white shadow-sm">

            {/* Badge */}
            <div className="absolute left-5 top-5 z-10 flex gap-2">

              {product.newArrival && (
                <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-stone-900 shadow-md">
                  New Arrival
                </span>
              )}

              {product.bestSeller && (
                <span className="rounded-full bg-stone-900 px-4 py-2 text-xs font-bold text-white shadow-md">
                  Best Seller
                </span>
              )}

            </div>

            <div className="relative aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
            </div>

          </div>


          {/* Product Information */}
          <div className="flex flex-col justify-center">

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">
              {product.category}
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
              {product.name}
            </h1>

            <p className="mt-6 text-lg leading-8 text-stone-600">
              {product.description}
            </p>


            {/* Specifications */}
            <div className="mt-8 grid grid-cols-2 gap-4">

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-widest text-stone-400">
                  Size
                </p>

                <p className="mt-2 font-semibold">
                  {product.size}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-widest text-stone-400">
                  Finish
                </p>

                <p className="mt-2 font-semibold">
                  {product.finish}
                </p>
              </div>

            </div>


            {/* Application */}
            <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">

              <p className="text-xs uppercase tracking-widest text-stone-400">
                Application
              </p>

              <p className="mt-2 leading-7 text-stone-700">
                {product.application}
              </p>

            </div>


            {/* Price */}
            <div className="mt-8 border-t border-stone-200 pt-6">

              <p className="text-xs uppercase tracking-widest text-stone-400">
                Pricing
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {product.price}
              </p>

            </div>


            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 rounded-full bg-stone-900 px-7 py-4 text-center font-semibold text-white transition hover:bg-stone-700"
            >
              Get Price on WhatsApp
            </a>

            <p className="mt-4 text-center text-sm text-stone-500">
              Ask us about availability, pricing and bulk orders.
            </p>

          </div>

        </div>
      </section>


      {/* Related Products */}
      <section className="border-t border-stone-200 bg-white px-6 py-20">

        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
              You May Also Like
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Explore more tiles.
            </h2>

          </div>


          <div className="mt-10 grid gap-8 md:grid-cols-3">

            {relatedProducts.map((related) => (

              <article
                key={related.id}
                className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >

                {/* Image */}
                <div className="relative h-64 overflow-hidden bg-stone-100">

                  <Image
                    src={related.image}
                    alt={related.name}
                    fill
                    className="object-cover transition duration-500 hover:scale-105"
                  />

                  {/* Badge */}
                  <div className="absolute left-4 top-4 flex gap-2">

                    {related.newArrival && (
                      <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold shadow-sm">
                        New Arrival
                      </span>
                    )}

                    {related.bestSeller && (
                      <span className="rounded-full bg-stone-900 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                        Best Seller
                      </span>
                    )}

                  </div>

                </div>


                {/* Details */}
                <div className="p-6">

                  <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
                    {related.category}
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold">
                    {related.name}
                  </h3>

                  <div className="mt-5 grid grid-cols-2 gap-3">

                    <div className="rounded-xl bg-stone-50 p-3">
                      <p className="text-[10px] uppercase tracking-widest text-stone-400">
                        Size
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {related.size}
                      </p>
                    </div>

                    <div className="rounded-xl bg-stone-50 p-3">
                      <p className="text-[10px] uppercase tracking-widest text-stone-400">
                        Finish
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {related.finish}
                      </p>
                    </div>

                  </div>


                  <Link
                    href={`/products/${related.id}`}
                    className="mt-6 block rounded-full bg-stone-900 px-5 py-3 text-center font-semibold text-white transition hover:bg-stone-700"
                  >
                    View Product
                  </Link>

                </div>

              </article>

            ))}

          </div>

        </div>

      </section>


      {/* Footer */}
      <footer className="border-t bg-stone-900 px-6 py-8 text-center text-white">

        <p>
          © 2026 Maruti Tiles. All rights reserved.
        </p>

      </footer>

    </main>
  );
}