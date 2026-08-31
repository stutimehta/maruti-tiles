"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase";

type Order = {
  id: string;
  customer_id: string;
  status: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  total: number;
  amount_paid: number;
  remaining_amount: number;
  payment_method: "online" | "cod" | null;
  payment_status:
    | "pending"
    | "paid"
    | "partial"
    | "failed";
  created_at: string;
};

const STATUSES = [
  "Confirmed",
  "Preparing",
  "Dispatched",
  "Out for Delivery",
  "Delivered",
];

export default function AdminOrdersPage() {
  const supabase = createClient();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    setMessage("");

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
          customer_id,
          status,
          full_name,
          email,
          phone,
          address,
          city,
          state,
          postal_code,
          country,
          total,
          amount_paid,
          remaining_amount,
          payment_method,
          payment_status,
          created_at
          `
        )
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error("Load orders error:", error);
        setMessage(error.message);
        return;
      }

      setOrders((data || []) as Order[]);
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(
    orderId: string,
    status: string
  ) {
    setSavingId(orderId);
    setMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth";
        return;
      }

      /*
       * IMPORTANT:
       *
       * We use .select() after update.
       *
       * This makes Supabase return the actual
       * updated database row.
       *
       * If RLS blocks the UPDATE, this will fail
       * instead of falsely changing the screen.
       */
      const { data: updatedOrder, error } =
        await supabase
          .from("orders")
          .update({
            status: status,
          })
          .eq("id", orderId)
          .select(
            `
            id,
            customer_id,
            status,
            full_name,
            email,
            phone,
            address,
            city,
            state,
            postal_code,
            country,
            total,
            amount_paid,
            remaining_amount,
            payment_method,
            payment_status,
            created_at
            `
          )
          .single();

      if (error) {
        console.error(
          "Order status update error:",
          error
        );

        setMessage(
          `Unable to update order status: ${error.message}`
        );

        return;
      }

      if (!updatedOrder) {
        setMessage(
          "Order status was not updated. Check your Supabase RLS UPDATE policy."
        );

        return;
      }

      /*
       * Only update the screen AFTER Supabase
       * confirms that the database row changed.
       */
      setOrders((current) =>
        current.map((order) =>
          order.id === orderId
            ? {
                ...order,
                ...(updatedOrder as Order),
              }
            : order
        )
      );

      setMessage(
        `Order status updated to "${status}".`
      );
    } catch (error) {
      console.error(
        "Update status error:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to update order."
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0b0a] text-white">

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-[#292824] bg-[#0b0b0a]/95 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6">

          <div>
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

          <a
            href="/"
            className="rounded-full border border-[#4a4030] px-5 py-2.5 text-xs font-semibold text-white transition hover:border-[#c9a45d] hover:bg-[#c9a45d] hover:text-black"
          >
            Back to Website
          </a>

        </div>

      </header>

      {/* CONTENT */}

      <section className="px-5 py-10 sm:px-6 md:py-14">

        <div className="mx-auto max-w-7xl">

          {/* PAGE HEADER */}

          <div className="mb-9">

            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c9a45d]">
              Administration
            </p>

            <h1 className="mt-3 font-serif text-4xl tracking-tight text-white sm:text-5xl">
              Admin Orders
            </h1>

            <p className="mt-3 text-sm text-stone-500">
              Manage customer orders and delivery status.
            </p>

          </div>

          {/* LOADING */}

          {loading && (
            <div className="rounded-[2rem] border border-[#302e2a] bg-[#121210] p-8 shadow-2xl">

              <p className="text-sm text-stone-500">
                Loading orders...
              </p>

            </div>
          )}

          {/* MESSAGE */}

          {!loading && message && (
            <div className="mb-6 rounded-2xl border border-[#51442b] bg-[#191711] p-5 text-sm text-[#d7b56d]">
              {message}
            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            orders.length === 0 && (
              <div className="rounded-[2rem] border border-[#302e2a] bg-[#121210] p-10 text-center shadow-2xl">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#4a402d] bg-[#191711]">

                  <span className="text-2xl text-[#c9a45d]">
                    ◇
                  </span>

                </div>

                <h2 className="mt-6 font-serif text-3xl text-white">
                  No orders found
                </h2>

                <p className="mt-3 text-sm text-stone-500">
                  New customer orders will appear here.
                </p>

              </div>
            )}

          {/* ORDERS */}

          {!loading &&
            orders.length > 0 && (

              <div className="space-y-6">

                {orders.map((order) => (

                  <article
                    key={order.id}
                    className="rounded-[2rem] border border-[#302e2a] bg-[#121210] p-6 shadow-2xl transition duration-300 hover:border-[#4b402c] sm:p-7"
                  >

                    {/* ORDER HEADER */}

                    <div className="flex flex-col justify-between gap-5 border-b border-[#292824] pb-6 lg:flex-row lg:items-start">

                      <div>

                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-600">
                          Order ID
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

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="rounded-full border border-[#55462b] bg-[#191711] px-4 py-2 text-xs font-semibold text-[#d7b56d]">
                          {order.status}
                        </span>

                        <span className="rounded-full border border-[#383630] bg-[#1a1917] px-4 py-2 text-xs font-semibold text-stone-300">
                          {order.payment_method === "cod"
                            ? "COD"
                            : "Online"}
                        </span>

                      </div>

                    </div>

                    {/* CUSTOMER / DELIVERY / PAYMENT */}

                    <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_1fr_1fr]">

                      {/* CUSTOMER */}

                      <div>

                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#6d6961]">
                          Customer
                        </p>

                        <p className="mt-3 text-sm font-semibold text-white">
                          {order.full_name}
                        </p>

                        <p className="mt-2 break-all text-xs text-stone-500">
                          {order.email}
                        </p>

                        <p className="mt-1 text-xs text-stone-500">
                          {order.phone}
                        </p>

                      </div>

                      {/* DELIVERY */}

                      <div>

                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#6d6961]">
                          Delivery Address
                        </p>

                        <p className="mt-3 text-sm leading-6 text-stone-400">
                          {order.address}
                          <br />
                          {order.city},{" "}
                          {order.state}
                          <br />
                          {order.postal_code},{" "}
                          {order.country}
                        </p>

                      </div>

                      {/* PAYMENT */}

                      <div>

                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#6d6961]">
                          Payment
                        </p>

                        <div className="mt-3 space-y-3">

                          <div className="flex justify-between gap-4 text-sm">

                            <span className="text-stone-500">
                              Total
                            </span>

                            <span className="font-semibold text-white">
                              ₹
                              {Number(
                                order.total
                              ).toLocaleString("en-IN")}
                            </span>

                          </div>

                          <div className="flex justify-between gap-4 text-sm">

                            <span className="text-stone-500">
                              Paid
                            </span>

                            <span className="font-semibold text-white">
                              ₹
                              {Number(
                                order.amount_paid
                              ).toLocaleString("en-IN")}
                            </span>

                          </div>

                          <div className="flex justify-between gap-4 text-sm">

                            <span className="text-stone-500">
                              Remaining
                            </span>

                            <span className="font-semibold text-[#d7b56d]">
                              ₹
                              {Number(
                                order.remaining_amount
                              ).toLocaleString("en-IN")}
                            </span>

                          </div>

                          <div className="flex justify-between gap-4 text-sm">

                            <span className="text-stone-500">
                              Payment Status
                            </span>

                            <span className="font-semibold capitalize text-white">
                              {order.payment_status}
                            </span>

                          </div>

                        </div>

                      </div>

                    </div>

                    {/* STATUS UPDATE */}

                    <div className="mt-8 border-t border-[#292824] pt-6">

                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#6d6961]">
                        Update Order Status
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">

                        {STATUSES.map((status) => {

                          const isCurrent =
                            order.status === status;

                          const isSaving =
                            savingId === order.id;

                          return (
                            <button
                              key={status}
                              type="button"
                              disabled={isSaving}
                              onClick={() =>
                                updateStatus(
                                  order.id,
                                  status
                                )
                              }
                              className={`rounded-full border px-4 py-2.5 text-xs font-semibold transition ${
                                isCurrent
                                  ? "border-[#c9a45d] bg-[#c9a45d] text-black"
                                  : "border-[#3a3833] bg-[#171715] text-stone-400 hover:border-[#c9a45d] hover:text-[#d7b56d]"
                              } disabled:cursor-not-allowed disabled:opacity-50`}
                            >
                              {isSaving &&
                              !isCurrent
                                ? "Updating..."
                                : status}
                            </button>
                          );

                        })}

                      </div>

                    </div>

                  </article>

                ))}

              </div>

            )}

        </div>

      </section>

      {/* FOOTER */}

      <footer className="border-t border-[#252420] bg-[#080807] px-5 py-10 text-center">

        <p className="text-xs text-stone-600">
          © 2026 Maruti Tiles. All Rights Reserved.
        </p>

      </footer>

    </main>
  );
}