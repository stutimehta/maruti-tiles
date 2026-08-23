"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "../../lib/supabase";

type Order = {
  id: string;
  status: string;
  payment_method: "online" | "cod" | null;
  payment_status:
    | "pending"
    | "paid"
    | "partial"
    | "failed";
  total: number;
  amount_paid: number;
  remaining_amount: number;
  created_at: string;
};

export default function OrderDetailsPage() {
  const params = useParams();

  const orderId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";

  const supabase = createClient();

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) {
        setError("Order ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          window.location.href = "/auth";
          return;
        }

        const { data, error } =
          await supabase
            .from("orders")
            .select(
              `
              id,
              status,
              payment_method,
              payment_status,
              total,
              amount_paid,
              remaining_amount,
              created_at,
              customer_id
              `
            )
            .eq("id", orderId)
            .eq("customer_id", user.id)
            .single();

        if (error) {
          console.error(
            "Order loading error:",
            error
          );

          setError(
            "Unable to load this order."
          );

          return;
        }

        if (!data) {
          setError("Order not found.");
          return;
        }

        setOrder(data as Order);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load order."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId, supabase]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0b0a] px-5 py-12 text-white sm:px-6 md:py-16">

        {/* HEADER */}
        <header className="mx-auto mb-12 flex max-w-5xl items-center justify-between">

          <Link
            href="/"
            className="group"
          >
            <div className="leading-none">
              <p className="font-serif text-3xl tracking-[0.08em] text-white">
                MARUTI
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="h-px w-7 bg-[#c9a45d]" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#c9a45d]">
                  TILES
                </span>
              </div>
            </div>
          </Link>

        </header>

        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-stone-500">
            Loading order...
          </p>
        </div>

      </main>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#0b0b0a] px-5 py-12 text-white sm:px-6 md:py-16">

        {/* HEADER */}
        <header className="mx-auto flex max-w-5xl items-center justify-between">

          <Link
            href="/"
            className="group"
          >
            <div className="leading-none">
              <p className="font-serif text-3xl tracking-[0.08em] text-white">
                MARUTI
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="h-px w-7 bg-[#c9a45d]" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#c9a45d]">
                  TILES
                </span>
              </div>
            </div>
          </Link>

          <Link
            href="/products"
            className="rounded-full border border-[#3b3935] px-5 py-2.5 text-xs font-semibold text-white transition hover:border-[#c9a45d] hover:text-[#c9a45d]"
          >
            Continue Shopping
          </Link>

        </header>

        <div className="mx-auto mt-14 max-w-5xl">

          <Link
            href="/my-order"
            className="text-sm font-medium text-stone-400 underline underline-offset-4 transition hover:text-[#c9a45d]"
          >
            ← Back to My Orders
          </Link>

          <div className="mt-10 rounded-[2rem] border border-[#302f2b] bg-[#121210] p-8 shadow-2xl">

            <h1 className="text-2xl font-semibold text-white">
              Order not found
            </h1>

            <p className="mt-2 text-sm text-stone-500">
              {error ||
                "This order could not be found."}
            </p>

            <Link
              href="/my-order"
              className="mt-6 inline-flex rounded-full bg-[#c9a45d] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#d8b873]"
            >
              Back to My Orders
            </Link>

          </div>

        </div>

      </main>
    );
  }

  const status =
    order.status?.toLowerCase() || "confirmed";

  const steps = [
    "confirmed",
    "preparing",
    "dispatched",
    "out for delivery",
    "delivered",
  ];

  const currentStep =
    steps.indexOf(status);

  const activeStep =
    currentStep === -1
      ? 0
      : currentStep;

  return (
    <main className="min-h-screen bg-[#0b0b0a] text-white">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-[#292824] bg-[#0b0b0a]/95 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6">

          {/* TEXT LOGO ONLY */}
          <Link
            href="/"
            className="group"
          >
            <div className="leading-none">

              <p className="font-serif text-3xl tracking-[0.08em] text-white">
                MARUTI
              </p>

              <div className="mt-2 flex items-center gap-2">

                <span className="h-px w-7 bg-[#c9a45d]" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#c9a45d]">
                  TILES
                </span>

              </div>

            </div>
          </Link>

          <div className="flex items-center gap-2">

            <Link
              href="/my-order"
              className="rounded-full border border-[#3a3833] px-4 py-2.5 text-xs font-semibold text-white transition hover:border-[#c9a45d] hover:text-[#c9a45d]"
            >
              My Orders
            </Link>

            <Link
              href="/products"
              className="hidden rounded-full border border-[#c9a45d] px-5 py-2.5 text-xs font-semibold text-[#c9a45d] transition hover:bg-[#c9a45d] hover:text-black sm:inline-flex"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </header>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="px-5 py-12 sm:px-6 md:py-16">

        <div className="mx-auto max-w-5xl">

          {/* BACK */}

          <Link
            href="/my-order"
            className="text-sm font-medium text-stone-400 underline underline-offset-4 transition hover:text-[#c9a45d]"
          >
            ← Back to My Orders
          </Link>


          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <p className="mt-10 text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a45d]">
            Order Tracking
          </p>

          <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <h1 className="font-serif text-5xl tracking-tight text-white sm:text-6xl">
                Order Details
              </h1>

              <p className="mt-3 break-all text-sm text-stone-500">
                Order ID: {order.id}
              </p>

            </div>

            <span className="w-fit rounded-full border border-[#51442b] bg-[#191711] px-5 py-2.5 text-sm font-semibold capitalize text-[#d7b56d]">
              {order.status}
            </span>

          </div>


          {/* =================================================
              DELIVERY STATUS
          ================================================= */}

          <section className="mt-10 rounded-[2rem] border border-[#302e2a] bg-[#121210] p-7 shadow-2xl sm:p-10">

            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c9a45d]">
              Delivery Status
            </p>

            <div className="mt-8 grid gap-7 sm:grid-cols-5">

              {steps.map(
                (step, index) => {

                  const completed =
                    index <= activeStep;

                  const isCurrent =
                    index === activeStep;

                  return (
                    <div
                      key={step}
                      className="flex flex-col"
                    >

                      {/* STEP CIRCLE */}

                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-full text-sm font-bold transition ${
                          completed
                            ? "bg-[#c9a45d] text-black shadow-[0_0_0_5px_rgba(201,164,93,0.08)]"
                            : "border border-[#45413a] bg-[#171715] text-stone-600"
                        } ${
                          isCurrent
                            ? "ring-2 ring-[#c9a45d]/30"
                            : ""
                        }`}
                      >

                        {completed
                          ? "✓"
                          : index + 1}

                      </div>


                      {/* STEP NAME */}

                      <p
                        className={`mt-3 text-xs font-semibold capitalize ${
                          completed
                            ? "text-white"
                            : "text-stone-600"
                        }`}
                      >
                        {step}
                      </p>

                    </div>
                  );
                }
              )}

            </div>

          </section>


          {/* =================================================
              PAYMENT INFORMATION
          ================================================= */}

          <section className="mt-6 rounded-[2rem] border border-[#302e2a] bg-[#121210] p-7 shadow-2xl sm:p-10">

            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c9a45d]">
              Payment Information
            </p>

            <div className="mt-7 grid gap-7 sm:grid-cols-4">

              {/* PAYMENT */}

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-600">
                  Payment
                </p>

                <p className="mt-2 text-sm font-semibold text-white">
                  {order.payment_method ===
                  "cod"
                    ? "Cash on Delivery"
                    : "Online"}
                </p>

              </div>


              {/* PAYMENT STATUS */}

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-600">
                  Payment Status
                </p>

                <p className="mt-2 text-sm font-semibold capitalize text-[#d7b56d]">
                  {order.payment_status}
                </p>

              </div>


              {/* PAID */}

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-600">
                  Paid
                </p>

                <p className="mt-2 text-sm font-semibold text-white">
                  ₹
                  {Number(
                    order.amount_paid
                  ).toLocaleString("en-IN")}
                </p>

              </div>


              {/* REMAINING */}

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-600">
                  Remaining
                </p>

                <p className="mt-2 text-sm font-semibold text-white">
                  ₹
                  {Number(
                    order.remaining_amount
                  ).toLocaleString("en-IN")}
                </p>

              </div>

            </div>

          </section>


          {/* =================================================
              ORDER TOTAL
          ================================================= */}

          <section className="mt-6 rounded-[2rem] border border-[#302e2a] bg-[#121210] p-7 shadow-2xl sm:p-10">

            <div className="flex items-center justify-between gap-5">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c9a45d]">
                  Order Total
                </p>

                <p className="mt-2 text-sm text-stone-500">
                  Total amount for this order
                </p>

              </div>

              <p className="text-2xl font-semibold text-white sm:text-3xl">
                ₹
                {Number(
                  order.total
                ).toLocaleString("en-IN")}
              </p>

            </div>

          </section>


          {/* =================================================
              ORDER DATE
          ================================================= */}

          <section className="mt-6 rounded-[2rem] border border-[#302e2a] bg-[#121210] p-7 shadow-2xl sm:p-10">

            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c9a45d]">
              Order Date
            </p>

            <p className="mt-3 text-sm text-stone-400">
              {new Date(
                order.created_at
              ).toLocaleString("en-IN")}
            </p>

          </section>


          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="mt-8 flex flex-wrap gap-3">

            <Link
              href="/my-order"
              className="rounded-full bg-[#c9a45d] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#d8b873]"
            >
              ← My Orders
            </Link>

            <Link
              href="/products"
              className="rounded-full border border-[#46423b] bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:border-[#c9a45d] hover:text-[#c9a45d]"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="mt-10 border-t border-[#252420] bg-[#080807] px-5 py-10 text-center sm:px-6">

        <p className="text-xs text-stone-600">
          © 2026 Maruti Tiles. All Rights Reserved.
        </p>

      </footer>

    </main>
  );
}