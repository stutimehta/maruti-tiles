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

        // Read orderId directly from the browser URL.
        // This avoids useSearchParams() and prevents
        // the Vercel prerender/build error.
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

        // Clear temporary checkout data
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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0]">
        <p className="text-sm text-stone-500">
          Loading your order...
        </p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#f7f5f0] px-5 py-16 text-stone-900">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold">
            Order not available
          </h1>

          <p className="mt-3 text-sm leading-6 text-stone-500">
            {message ||
              "We could not load this order."}
          </p>

          <Link
            href="/my-order"
            className="mt-7 inline-flex rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white"
          >
            View My Orders
          </Link>
        </div>
      </main>
    );
  }

  const isCod =
    order.payment_method === "cod";

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-stone-900">
      <section className="px-5 py-14 sm:px-6 md:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[2.25rem] border border-stone-200 bg-white p-7 shadow-sm sm:p-10">

            {/* SUCCESS ICON */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
              ✓
            </div>

            {/* TITLE */}
            <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.35em] text-[#b38d48]">
              Order Confirmed
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Thank you, {order.full_name}.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-500">
              Your payment has been verified and
              your Maruti Tiles order has been
              confirmed.
            </p>

            {/* ORDER ID + STATUS */}
            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#f6f3ed] p-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                  Order ID
                </p>

                <p className="mt-2 break-all text-sm font-semibold">
                  {order.id}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f6f3ed] p-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                  Status
                </p>

                <p className="mt-2 text-sm font-semibold">
                  {order.status}
                </p>
              </div>
            </div>

            {/* AMOUNTS */}
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-stone-200 p-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                  Product Total
                </p>

                <p className="mt-2 text-xl font-semibold">
                  ₹
                  {Number(
                    order.total
                  ).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-200 p-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                  Paid
                </p>

                <p className="mt-2 text-xl font-semibold">
                  ₹
                  {Number(
                    order.amount_paid
                  ).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-200 p-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                  Remaining
                </p>

                <p className="mt-2 text-xl font-semibold">
                  ₹
                  {Number(
                    order.remaining_amount
                  ).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* PAYMENT DETAILS */}
            <div className="mt-5 rounded-2xl border border-stone-200 p-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                Payment
              </p>

              <p className="mt-2 text-sm font-semibold">
                {isCod
                  ? "Cash on Delivery — 20% advance paid"
                  : "Online — fully paid"}
              </p>

              <p className="mt-2 text-xs leading-5 text-stone-500">
                Shipping charges are separate and
                are handled according to your
                delivery terms.
              </p>
            </div>

            {/* BUTTONS */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/my-order/${order.id}`}
                className="inline-flex rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white"
              >
                Track This Order
              </Link>

              <Link
                href="/my-order"
                className="inline-flex rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold"
              >
                My Orders
              </Link>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}