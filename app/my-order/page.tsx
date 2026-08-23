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
    /*
     * Open the dynamic order page directly.
     *
     * Example:
     * /my-order/2ea54bcc-1d71-4aa5-961e-8dcc8b15383b
     */
    window.location.href = `/my-order/${orderId}`;
  }

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-stone-900">
      <section className="px-5 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-5xl">

          {/* BACK */}
          <Link
            href="/"
            className="text-sm font-medium text-stone-500 underline underline-offset-4"
          >
            ← Back to home
          </Link>

          {/* HEADER */}
          <p className="mt-10 text-[10px] font-bold uppercase tracking-[0.35em] text-[#b38d48]">
            Account
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                My Orders
              </h1>

              <p className="mt-3 text-sm text-stone-500">
                View your payment and delivery status.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex w-fit rounded-full border border-stone-300 px-5 py-2.5 text-xs font-semibold transition hover:border-stone-950"
            >
              Continue Shopping
            </Link>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="mt-10 rounded-[2rem] border border-stone-200 bg-white p-8">
              <p className="text-sm text-stone-500">
                Loading orders...
              </p>
            </div>
          )}

          {/* ERROR */}
          {!loading && message && (
            <div className="mt-10 rounded-[2rem] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              {message}
            </div>
          )}

          {/* EMPTY */}
          {!loading &&
            !message &&
            orders.length === 0 && (
              <div className="mt-10 rounded-[2rem] border border-stone-200 bg-white p-8 text-center shadow-sm">
                <h2 className="text-2xl font-semibold">
                  No orders yet
                </h2>

                <p className="mt-2 text-sm text-stone-500">
                  Your confirmed orders will appear here.
                </p>

                <Link
                  href="/products"
                  className="mt-6 inline-flex rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white"
                >
                  Browse Products
                </Link>
              </div>
            )}

          {/* ORDERS */}
          {!loading &&
            !message &&
            orders.length > 0 && (
              <div className="mt-10 space-y-5">
                {orders.map((order) => (
                  <article
                    key={order.id}
                    className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-7"
                  >
                    {/* TOP */}
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                          Order
                        </p>

                        <p className="mt-2 break-all text-sm font-semibold">
                          {order.id}
                        </p>

                        <p className="mt-2 text-xs text-stone-500">
                          {new Date(
                            order.created_at
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>

                      <span className="w-fit rounded-full bg-[#f6f3ed] px-4 py-2 text-xs font-semibold">
                        {order.status}
                      </span>
                    </div>

                    {/* DETAILS */}
                    <div className="mt-6 grid gap-4 sm:grid-cols-4">

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                          Payment
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {order.payment_method === "cod"
                            ? "COD"
                            : "Online"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                          Paid
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          ₹
                          {Number(
                            order.amount_paid
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                          Remaining
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          ₹
                          {Number(
                            order.remaining_amount
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                          Total
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          ₹
                          {Number(
                            order.total
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>

                    </div>

                    {/* PAYMENT STATUS */}
                    <div className="mt-5">
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                        Payment Status
                      </p>

                      <p className="mt-1 text-sm font-semibold capitalize">
                        {order.payment_status}
                      </p>
                    </div>

                    {/* BUTTON */}
                    <div className="mt-6 flex justify-end">

                      <button
                        type="button"
                        onClick={() =>
                          openOrder(order.id)
                        }
                        className="rounded-full bg-stone-950 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-stone-700"
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
    </main>
  );
}