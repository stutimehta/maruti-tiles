"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "../../lib/supabase";

type Order = {
  id: string;
  status: string;
  payment_method: "online" | "cod" | null;
  payment_status: "pending" | "paid" | "partial" | "failed";
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

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f5f0] px-5 py-12 text-stone-900">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-stone-500">
            Loading order...
          </p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#f7f5f0] px-5 py-12 text-stone-900">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/my-order"
            className="text-sm font-medium text-stone-500 underline underline-offset-4"
          >
            ← Back to My Orders
          </Link>

          <div className="mt-10 rounded-[2rem] border border-red-200 bg-red-50 p-8">
            <h1 className="text-2xl font-semibold text-red-800">
              Order not found
            </h1>

            <p className="mt-2 text-sm text-red-700">
              {error ||
                "This order could not be found."}
            </p>

            <Link
              href="/my-order"
              className="mt-6 inline-flex rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white"
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
    <main className="min-h-screen bg-[#f7f5f0] px-5 py-12 text-stone-900 sm:px-6 md:py-16">
      <div className="mx-auto max-w-5xl">

        {/* BACK */}

        <Link
          href="/my-order"
          className="text-sm font-medium text-stone-500 underline underline-offset-4"
        >
          ← Back to My Orders
        </Link>

        {/* HEADER */}

        <p className="mt-10 text-[10px] font-bold uppercase tracking-[0.35em] text-[#b38d48]">
          Order Tracking
        </p>

        <div className="mt-2 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Order Details
            </h1>

            <p className="mt-3 break-all text-sm text-stone-500">
              Order ID: {order.id}
            </p>
          </div>

          <span className="w-fit rounded-full bg-[#f6f3ed] px-5 py-2.5 text-sm font-semibold capitalize">
            {order.status}
          </span>
        </div>

        {/* ORDER STATUS */}

        <section className="mt-10 rounded-[2rem] border border-stone-200 bg-white p-7 shadow-sm sm:p-10">

          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#b38d48]">
            Delivery Status
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-5">

            {steps.map(
              (step, index) => {
                const completed =
                  index <= activeStep;

                return (
                  <div
                    key={step}
                    className="flex flex-col"
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold ${
                        completed
                          ? "bg-stone-950 text-white"
                          : "border border-stone-300 bg-white text-stone-400"
                      }`}
                    >
                      {completed
                        ? "✓"
                        : index + 1}
                    </div>

                    <p
                      className={`mt-3 text-xs font-semibold capitalize ${
                        completed
                          ? "text-stone-950"
                          : "text-stone-400"
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

        {/* PAYMENT */}

        <section className="mt-6 rounded-[2rem] border border-stone-200 bg-white p-7 shadow-sm sm:p-10">

          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#b38d48]">
            Payment Information
          </p>

          <div className="mt-7 grid gap-6 sm:grid-cols-4">

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                Payment
              </p>

              <p className="mt-2 text-sm font-semibold">
                {order.payment_method ===
                "cod"
                  ? "Cash on Delivery"
                  : "Online"}
              </p>
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                Payment Status
              </p>

              <p className="mt-2 text-sm font-semibold capitalize">
                {order.payment_status}
              </p>
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                Paid
              </p>

              <p className="mt-2 text-sm font-semibold">
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

              <p className="mt-2 text-sm font-semibold">
                ₹
                {Number(
                  order.remaining_amount
                ).toLocaleString("en-IN")}
              </p>
            </div>

          </div>
        </section>

        {/* TOTAL */}

        <section className="mt-6 rounded-[2rem] border border-stone-200 bg-white p-7 shadow-sm sm:p-10">

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#b38d48]">
                Order Total
              </p>

              <p className="mt-2 text-sm text-stone-500">
                Total amount for this order
              </p>
            </div>

            <p className="text-2xl font-semibold">
              ₹
              {Number(
                order.total
              ).toLocaleString("en-IN")}
            </p>
          </div>

        </section>

        {/* ORDER DATE */}

        <section className="mt-6 rounded-[2rem] border border-stone-200 bg-white p-7 shadow-sm sm:p-10">

          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#b38d48]">
            Order Date
          </p>

          <p className="mt-3 text-sm text-stone-600">
            {new Date(
              order.created_at
            ).toLocaleString("en-IN")}
          </p>

        </section>

        {/* BUTTONS */}

        <div className="mt-8 flex flex-wrap gap-3">

          <Link
            href="/my-order"
            className="rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white"
          >
            ← My Orders
          </Link>

          <Link
            href="/products"
            className="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold"
          >
            Continue Shopping
          </Link>

        </div>

      </div>
    </main>
  );
}