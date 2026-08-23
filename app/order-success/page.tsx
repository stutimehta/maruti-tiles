"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabase";

type Order = {
  id: string;
  status: string;
  payment_method: "online" | "cod" | null;
  payment_status:
    | "pending"
    | "paid"
    | "partial"
    | "failed";
  subtotal: number;
  total: number;
  amount_paid: number;
  remaining_amount: number;
  full_name: string;
  city: string;
  state: string;
  created_at: string;
};

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadOrder() {
      const supabase = createClient();

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          window.location.href = "/auth";
          return;
        }

        const params = new URLSearchParams(
          window.location.search
        );

        const orderId =
          params.get("orderId") ||
          localStorage.getItem("maruti-order-id");

        if (!orderId) {
          window.location.href = "/my-order";
          return;
        }

        const { data, error } = await supabase
          .from("orders")
          .select(
            `
            id,
            status,
            payment_method,
            payment_status,
            subtotal,
            total,
            amount_paid,
            remaining_amount,
            full_name,
            city,
            state,
            created_at
            `
          )
          .eq("id", orderId)
          .eq("customer_id", user.id)
          .single();

        if (error || !data) {
          setMessage(
            error?.message ||
              "Order could not be found."
          );
          return;
        }

        setOrder(data as Order);

        localStorage.removeItem("maruti-cart");
        localStorage.removeItem("maruti-checkout");
        localStorage.removeItem("maruti-payment");
        localStorage.removeItem("maruti-order-id");
      } catch (error) {
        console.error(
          "Order success page error:",
          error
        );

        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to load your order."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, []);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090909] text-stone-100">
        <div className="text-center">
          <p className="font-serif text-3xl uppercase tracking-[0.12em]">
            Maruti
          </p>

          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="h-px w-6 bg-[#c7a665]" />

            <p className="text-[8px] font-semibold uppercase tracking-[0.5em] text-[#c7a665]">
              Tiles
            </p>
          </div>

          <p className="mt-7 text-sm text-stone-500">
            Loading your order...
          </p>
        </div>
      </main>
    );
  }

  /* =========================================================
     ORDER NOT AVAILABLE
  ========================================================= */

  if (!order) {
    return (
      <main className="min-h-screen bg-[#090909] px-5 py-16 text-stone-100 sm:px-7">

        <header className="mx-auto max-w-[1400px]">
          <Link
            href="/"
            className="group inline-block"
            aria-label="Maruti Tiles Home"
          >
            <p className="font-serif text-3xl uppercase tracking-[0.12em] text-stone-100 transition group-hover:text-[#d7bb83]">
              Maruti
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span className="h-px w-6 bg-[#c7a665]" />

              <p className="text-[8px] font-semibold uppercase tracking-[0.5em] text-[#c7a665]">
                Tiles
              </p>
            </div>
          </Link>
        </header>

        <div className="mx-auto mt-16 max-w-xl">

          <div className="rounded-[2rem] border border-stone-800 bg-[#11110f] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:p-10">

            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#c7a665]/40 bg-[#c7a665]/10">
              <span className="text-xl text-[#d5b875]">
                !
              </span>
            </div>

            <p className="mt-8 text-[9px] font-bold uppercase tracking-[0.4em] text-[#c7a665]">
              Order Status
            </p>

            <h1 className="mt-4 font-serif text-4xl leading-none text-stone-100 sm:text-5xl">
              Order not available.
            </h1>

            <p className="mt-5 text-sm leading-7 text-stone-500">
              {message ||
                "We could not load this order."}
            </p>

            <Link
              href="/my-order"
              className="mt-8 inline-flex min-h-13 items-center justify-center rounded-full bg-[#d2b06c] px-7 text-sm font-semibold text-[#11100e] transition hover:-translate-y-0.5 hover:bg-[#e0c489]"
            >
              View My Orders

              <span className="ml-3 text-lg">
                →
              </span>
            </Link>

          </div>

        </div>
      </main>
    );
  }

  const isCod =
    order.payment_method === "cod";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#090909] text-stone-100">

      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="sticky top-0 z-50 border-b border-stone-800/80 bg-[#090909]/95 backdrop-blur-xl">

        <div className="mx-auto flex min-h-[76px] max-w-[1400px] items-center justify-between px-5 sm:px-7 lg:px-10">

          {/* TEXT ONLY BRAND */}

          <Link
            href="/"
            className="group inline-block"
            aria-label="Maruti Tiles Home"
          >
            <p className="font-serif text-[28px] uppercase tracking-[0.13em] text-stone-100 transition group-hover:text-[#d7bb83] sm:text-[32px]">
              Maruti
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span className="h-px w-6 bg-[#c7a665]" />

              <p className="text-[8px] font-semibold uppercase tracking-[0.5em] text-[#c7a665]">
                Tiles
              </p>
            </div>
          </Link>

          <Link
            href="/my-order"
            className="inline-flex min-h-10 items-center rounded-full border border-stone-700 px-5 text-xs font-semibold text-stone-300 transition hover:border-[#c7a665] hover:text-[#d7bb83]"
          >
            My Orders

            <span className="ml-2 text-[#c7a665]">
              →
            </span>
          </Link>

        </div>

      </header>


      {/* =========================================================
          MAIN
      ========================================================= */}

      <section className="relative overflow-hidden px-5 py-14 sm:px-7 md:py-20">

        {/* PREMIUM BACKGROUND */}

        <div className="pointer-events-none absolute inset-0">

          <div className="absolute left-[5%] top-[5%] h-[420px] w-[420px] rounded-full bg-[#b99558]/[0.08] blur-[140px]" />

          <div className="absolute right-[5%] top-[20%] h-[520px] w-[520px] rounded-full bg-[#d7c29a]/[0.04] blur-[160px]" />

          <div className="absolute bottom-[5%] left-[45%] h-[300px] w-[300px] rounded-full bg-[#c7a665]/[0.025] blur-[130px]" />

        </div>


        <div className="relative mx-auto max-w-[1200px]">

          {/* TOP LABEL */}

          <div className="mb-8 flex items-center gap-3">

            <span className="h-px w-10 bg-[#c7a665]" />

            <p className="text-[9px] font-bold uppercase tracking-[0.42em] text-[#c7a665]">
              Order Confirmed
            </p>

          </div>


          {/* MAIN CARD */}

          <div className="overflow-hidden rounded-[2rem] border border-stone-800 bg-[#10100e] shadow-[0_40px_120px_rgba(0,0,0,0.5)]">

            <div className="p-7 sm:p-10 md:p-14">

              {/* SUCCESS ICON */}

              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#c7a665]/50 bg-[#c7a665]/10">

                <span className="text-3xl text-[#d5b875]">
                  ✓
                </span>

              </div>


              {/* TITLE */}

              <p className="mt-8 text-[9px] font-bold uppercase tracking-[0.4em] text-[#c7a665]">
                Your order is confirmed
              </p>

              <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-[0.95] tracking-[-0.035em] text-stone-100 sm:text-5xl md:text-6xl">
                Thank you,{" "}

                <span className="text-[#d0ad69]">
                  {order.full_name}.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-stone-500 sm:text-base">
                Your payment has been verified and
                your Maruti Tiles order has been
                confirmed.
              </p>


              {/* GOLD LINE */}

              <div className="mt-10 h-px bg-gradient-to-r from-[#c7a665]/60 via-stone-800 to-transparent" />


              {/* ORDER ID + STATUS */}

              <div className="mt-8 grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl border border-stone-800 bg-[#151512] p-5">

                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-stone-500">
                    Order ID
                  </p>

                  <p className="mt-3 break-all text-sm font-semibold text-stone-200">
                    {order.id}
                  </p>

                </div>


                <div className="rounded-2xl border border-stone-800 bg-[#151512] p-5">

                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-stone-500">
                    Status
                  </p>

                  <div className="mt-3 flex items-center gap-2">

                    <span className="h-2 w-2 rounded-full bg-[#c7a665]" />

                    <p className="text-sm font-semibold capitalize text-stone-200">
                      {order.status}
                    </p>

                  </div>

                </div>

              </div>


              {/* AMOUNTS */}

              <div className="mt-4 grid gap-4 sm:grid-cols-3">

                <div className="rounded-2xl border border-stone-800 bg-[#11110f] p-5">

                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-stone-500">
                    Product Total
                  </p>

                  <p className="mt-3 text-xl font-semibold text-stone-100">
                    ₹
                    {Number(
                      order.total
                    ).toLocaleString("en-IN")}
                  </p>

                </div>


                <div className="rounded-2xl border border-[#c7a665]/20 bg-[#151512] p-5">

                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#9d875f]">
                    Paid
                  </p>

                  <p className="mt-3 text-xl font-semibold text-[#d2b06c]">
                    ₹
                    {Number(
                      order.amount_paid
                    ).toLocaleString("en-IN")}
                  </p>

                </div>


                <div className="rounded-2xl border border-stone-800 bg-[#11110f] p-5">

                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-stone-500">
                    Remaining
                  </p>

                  <p className="mt-3 text-xl font-semibold text-stone-100">
                    ₹
                    {Number(
                      order.remaining_amount
                    ).toLocaleString("en-IN")}
                  </p>

                </div>

              </div>


              {/* PAYMENT DETAILS */}

              <div className="mt-4 rounded-2xl border border-stone-800 bg-[#151512] p-5 sm:p-6">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#c7a665]">
                      Payment
                    </p>

                    <p className="mt-3 text-sm font-semibold text-stone-100 sm:text-base">
                      {isCod
                        ? "Cash on Delivery — 20% advance paid"
                        : "Online — fully paid"}
                    </p>

                    <p className="mt-2 text-xs leading-6 text-stone-500">
                      Shipping charges are separate
                      and are handled according to
                      your delivery terms.
                    </p>

                  </div>


                  {/* PAYMENT STATUS */}

                  <div className="shrink-0 rounded-full border border-[#c7a665]/30 bg-[#c7a665]/10 px-4 py-2">

                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#d2b06c]">
                      {order.payment_status}
                    </p>

                  </div>

                </div>

              </div>


              {/* BUTTONS */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <Link
                  href={`/my-order/${order.id}`}
                  className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#d2b06c] px-7 text-sm font-semibold text-[#11100e] shadow-[0_15px_40px_rgba(0,0,0,0.3)] transition hover:-translate-y-0.5 hover:bg-[#e0c489]"
                >
                  Track This Order

                  <span className="ml-3 text-lg">
                    →
                  </span>
                </Link>


                <Link
                  href="/my-order"
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-stone-700 px-7 text-sm font-semibold text-stone-200 transition hover:border-[#c7a665] hover:text-[#d7bb83]"
                >
                  My Orders
                </Link>

              </div>

            </div>


            {/* BOTTOM STRIP */}

            <div className="border-t border-stone-800 bg-[#0c0c0b] px-7 py-5 sm:px-10">

              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                <p className="text-[8px] font-semibold uppercase tracking-[0.35em] text-stone-600">
                  Material · Texture · Space
                </p>

                <p className="text-[8px] font-semibold uppercase tracking-[0.35em] text-[#c7a665]">
                  Maruti Tiles · Surat · Gujarat
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="border-t border-stone-800 bg-[#070706] px-5 py-10 sm:px-7">

        <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-5 sm:flex-row sm:items-center">

          <Link
            href="/"
            className="group inline-block"
          >

            <p className="font-serif text-xl uppercase tracking-[0.12em] text-stone-300 transition group-hover:text-[#d7bb83]">
              Maruti
            </p>

            <div className="mt-1 flex items-center gap-2">

              <span className="h-px w-5 bg-[#c7a665]" />

              <p className="text-[7px] font-semibold uppercase tracking-[0.5em] text-[#c7a665]">
                Tiles
              </p>

            </div>

          </Link>


          <p className="text-[10px] text-stone-600">
            © 2026 Maruti Tiles. All Rights Reserved.
          </p>

        </div>

      </footer>

    </main>
  );
}