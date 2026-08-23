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
  total: number;
  amount_paid: number;
  remaining_amount: number;
  created_at: string;
};

export default function MyOrdersPage() {
  const supabase = createClient();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          window.location.href = "/auth";
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
            total,
            amount_paid,
            remaining_amount,
            created_at
            `
          )
          .eq("customer_id", user.id)
          .order("created_at", {
            ascending: false,
          });

        if (error) {
          setMessage(error.message);
          return;
        }

        setOrders((data || []) as Order[]);
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to load your orders."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [supabase]);

  function openOrder(orderId: string) {
    window.location.href = `/my-order/${orderId}`;
  }

  return (
    <main className="min-h-screen bg-[#0b0b0a] text-white">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-[#292824] bg-[#0b0b0a]/95 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6">

          {/* TEXT-ONLY MARUTI HEADER */}

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


          {/* HEADER BUTTON */}

          <Link
            href="/products"
            className="rounded-full border border-[#c9a45d] px-5 py-2.5 text-xs font-semibold text-[#c9a45d] transition hover:bg-[#c9a45d] hover:text-black"
          >
            Continue Shopping
          </Link>

        </div>

      </header>


      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <section className="px-5 py-12 sm:px-6 md:py-16">

        <div className="mx-auto max-w-5xl">

          {/* BACK */}

          <Link
            href="/"
            className="text-sm font-medium text-stone-500 underline underline-offset-4 transition hover:text-[#c9a45d]"
          >
            ← Back to home
          </Link>


          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <p className="mt-10 text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a45d]">
            Account
          </p>

          <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <h1 className="font-serif text-5xl tracking-tight text-white sm:text-6xl">
                My Orders
              </h1>

              <p className="mt-3 text-sm text-stone-500">
                View your payment and delivery status.
              </p>

            </div>


            <Link
              href="/products"
              className="inline-flex w-fit rounded-full border border-[#3a3833] px-5 py-2.5 text-xs font-semibold text-white transition hover:border-[#c9a45d] hover:text-[#c9a45d]"
            >
              Continue Shopping
            </Link>

          </div>


          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div className="mt-10 rounded-[2rem] border border-[#302e2a] bg-[#121210] p-8 shadow-2xl">

              <p className="text-sm text-stone-500">
                Loading orders...
              </p>

            </div>
          )}


          {/* =================================================
              ERROR
          ================================================= */}

          {!loading && message && (
            <div className="mt-10 rounded-[2rem] border border-red-900/50 bg-[#18100f] p-6 text-sm text-red-400">

              {message}

            </div>
          )}


          {/* =================================================
              EMPTY
          ================================================= */}

          {!loading &&
            !message &&
            orders.length === 0 && (
              <div className="mt-10 rounded-[2rem] border border-[#302e2a] bg-[#121210] p-10 text-center shadow-2xl sm:p-14">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#4a402d] bg-[#191711]">

                  <span className="text-2xl text-[#c9a45d]">
                    ◇
                  </span>

                </div>

                <h2 className="mt-6 font-serif text-3xl text-white">
                  No orders yet
                </h2>

                <p className="mt-3 text-sm text-stone-500">
                  Your confirmed orders will appear here.
                </p>

                <Link
                  href="/products"
                  className="mt-7 inline-flex rounded-full bg-[#c9a45d] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#d8b873]"
                >
                  Browse Products →
                </Link>

              </div>
            )}


          {/* =================================================
              ORDERS
          ================================================= */}

          {!loading &&
            !message &&
            orders.length > 0 && (

              <div className="mt-10 space-y-5">

                {orders.map((order) => (

                  <article
                    key={order.id}
                    className="rounded-[2rem] border border-[#302e2a] bg-[#121210] p-6 shadow-2xl transition duration-300 hover:border-[#4c422d] sm:p-7"
                  >

                    {/* =================================================
                        TOP
                    ================================================= */}

                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">

                      <div>

                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-600">
                          Order
                        </p>

                        <p className="mt-2 break-all text-sm font-semibold text-white">
                          {order.id}
                        </p>

                        <p className="mt-2 text-xs text-stone-500">
                          {new Date(
                            order.created_at
                          ).toLocaleString("en-IN")}
                        </p>

                      </div>


                      {/* STATUS */}

                      <span className="w-fit rounded-full border border-[#51442b] bg-[#191711] px-4 py-2 text-xs font-semibold capitalize text-[#d7b56d]">
                        {order.status}
                      </span>

                    </div>


                    {/* =================================================
                        DETAILS
                    ================================================= */}

                    <div className="mt-7 grid gap-6 border-t border-[#292824] pt-6 sm:grid-cols-4">

                      {/* PAYMENT */}

                      <div>

                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-600">
                          Payment
                        </p>

                        <p className="mt-2 text-sm font-semibold text-white">
                          {order.payment_method === "cod"
                            ? "COD"
                            : "Online"}
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


                      {/* TOTAL */}

                      <div>

                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-600">
                          Total
                        </p>

                        <p className="mt-2 text-sm font-semibold text-white">
                          ₹
                          {Number(
                            order.total
                          ).toLocaleString("en-IN")}
                        </p>

                      </div>

                    </div>


                    {/* =================================================
                        PAYMENT STATUS
                    ================================================= */}

                    <div className="mt-6 border-t border-[#292824] pt-5">

                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-600">
                        Payment Status
                      </p>

                      <p className="mt-2 text-sm font-semibold capitalize text-[#d7b56d]">
                        {order.payment_status}
                      </p>

                    </div>


                    {/* =================================================
                        BUTTON
                    ================================================= */}

                    <div className="mt-7 flex justify-end">

                      <button
                        type="button"
                        onClick={() =>
                          openOrder(order.id)
                        }
                        className="rounded-full bg-[#c9a45d] px-6 py-3 text-xs font-semibold text-black transition hover:-translate-y-0.5 hover:bg-[#d8b873] active:scale-95"
                      >
                        View Order →
                      </button>

                    </div>

                  </article>

                ))}

              </div>

            )}

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