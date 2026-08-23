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

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [savingId, setSavingId] =
    useState<string | null>(null);

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

      /*
       * The database RLS policy checks whether
       * this user is an approved admin.
       */
      const { data, error } =
        await supabase
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
        setMessage(error.message);
        return;
      }

      setOrders(
        (data || []) as Order[]
      );
    } catch (error) {
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
      const { error } =
        await supabase
          .from("orders")
          .update({ status })
          .eq("id", orderId);

      if (error) {
        setMessage(error.message);
        return;
      }

      setOrders((current) =>
        current.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status,
              }
            : order
        )
      );
    } catch (error) {
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
    <main className="min-h-screen bg-[#f7f5f0] text-stone-900">

      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6">

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#b38d48]">
              Maruti Tiles
            </p>

            <h1 className="mt-1 text-2xl font-semibold">
              Admin Orders
            </h1>
          </div>

          <a
            href="/"
            className="rounded-full border border-stone-300 px-5 py-2.5 text-xs font-semibold"
          >
            Back to Website
          </a>

        </div>
      </header>


      <section className="px-5 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl">

          <div className="mb-8">
            <p className="text-sm text-stone-500">
              Manage customer orders and delivery status.
            </p>
          </div>


          {loading && (
            <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
              <p className="text-sm text-stone-500">
                Loading orders...
              </p>
            </div>
          )}


          {!loading && message && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              {message}
            </div>
          )}


          {!loading &&
            !message &&
            orders.length === 0 && (
              <div className="rounded-[2rem] border border-stone-200 bg-white p-8 text-center shadow-sm">
                <h2 className="text-xl font-semibold">
                  No orders found
                </h2>

                <p className="mt-2 text-sm text-stone-500">
                  New customer orders will appear here.
                </p>
              </div>
            )}


          {!loading &&
            !message &&
            orders.length > 0 && (
              <div className="space-y-6">

                {orders.map((order) => (

                  <article
                    key={order.id}
                    className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm"
                  >

                    {/* HEADER */}

                    <div className="flex flex-col justify-between gap-4 border-b border-stone-100 pb-5 lg:flex-row lg:items-start">

                      <div>

                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                          Order ID
                        </p>

                        <p className="mt-1 break-all text-sm font-semibold">
                          {order.id}
                        </p>

                        <p className="mt-2 text-xs text-stone-500">
                          {new Date(
                            order.created_at
                          ).toLocaleString("en-IN")}
                        </p>

                      </div>


                      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">

                        <span className="rounded-full bg-[#f6f3ed] px-4 py-2 text-xs font-semibold">
                          {order.status}
                        </span>

                        <span className="rounded-full bg-stone-950 px-4 py-2 text-xs font-semibold text-white">
                          {order.payment_method === "cod"
                            ? "COD"
                            : "Online"}
                        </span>

                      </div>

                    </div>


                    {/* CUSTOMER */}

                    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr_1fr]">

                      <div>

                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                          Customer
                        </p>

                        <p className="mt-2 text-sm font-semibold">
                          {order.full_name}
                        </p>

                        <p className="mt-1 text-xs text-stone-500">
                          {order.email}
                        </p>

                        <p className="mt-1 text-xs text-stone-500">
                          {order.phone}
                        </p>

                      </div>


                      <div>

                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                          Delivery Address
                        </p>

                        <p className="mt-2 text-sm leading-6 text-stone-600">
                          {order.address}
                          <br />
                          {order.city},{" "}
                          {order.state}
                          <br />
                          {order.postal_code},{" "}
                          {order.country}
                        </p>

                      </div>


                      <div>

                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                          Payment
                        </p>

                        <div className="mt-2 space-y-2">

                          <div className="flex justify-between text-sm">
                            <span className="text-stone-500">
                              Total
                            </span>

                            <span className="font-semibold">
                              ₹
                              {Number(
                                order.total
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          </div>


                          <div className="flex justify-between text-sm">
                            <span className="text-stone-500">
                              Paid
                            </span>

                            <span className="font-semibold">
                              ₹
                              {Number(
                                order.amount_paid
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          </div>


                          <div className="flex justify-between text-sm">
                            <span className="text-stone-500">
                              Remaining
                            </span>

                            <span className="font-semibold">
                              ₹
                              {Number(
                                order.remaining_amount
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          </div>

                        </div>

                      </div>

                    </div>


                    {/* STATUS UPDATE */}

                    <div className="mt-7 border-t border-stone-100 pt-6">

                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                        Update Order Status
                      </p>


                      <div className="mt-3 flex flex-wrap gap-2">

                        {STATUSES.map(
                          (status) => (

                            <button
                              key={status}
                              type="button"
                              disabled={
                                savingId ===
                                order.id
                              }
                              onClick={() =>
                                updateStatus(
                                  order.id,
                                  status
                                )
                              }
                              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                                order.status ===
                                status
                                  ? "border-stone-950 bg-stone-950 text-white"
                                  : "border-stone-300 bg-white hover:border-stone-950"
                              } disabled:cursor-not-allowed disabled:opacity-50`}
                            >
                              {status}
                            </button>

                          )
                        )}

                      </div>

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