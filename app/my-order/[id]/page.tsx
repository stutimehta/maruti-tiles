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

type RazorpayPaymentResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayErrorResponse = {
  error?: {
    description?: string;
    code?: string;
    reason?: string;
  };
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;

  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };

  notes?: Record<string, string>;

  theme?: {
    color?: string;
  };

  handler?: (
    response: RazorpayPaymentResponse
  ) => void | Promise<void>;

  modal?: {
    ondismiss?: () => void;
  };
};

type RazorpayInstance = {
  open: () => void;

  on: (
    event: string,
    handler: (
      response: RazorpayErrorResponse
    ) => void
  ) => void;
};

type RazorpayConstructor = new (
  options: RazorpayOptions
) => RazorpayInstance;

function getRazorpayConstructor():
  | RazorpayConstructor
  | undefined {
  return (
    window as unknown as {
      Razorpay?: RazorpayConstructor;
    }
  ).Razorpay;
}

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

  const [payLoading, setPayLoading] =
    useState(false);

  const [cashLoading, setCashLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [paymentMessage, setPaymentMessage] =
    useState("");

  const [cashRequested, setCashRequested] =
    useState(false);

  /*
   * LOAD ORDER
   */

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) {
        setMessage("Order ID is missing.");
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

          setMessage(
            "Unable to load this order."
          );

          return;
        }

        if (!data) {
          setMessage("Order not found.");
          return;
        }

        setOrder(data as Order);
      } catch (error) {
        console.error(error);

        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to load order."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId, supabase]);

  /*
   * LOAD RAZORPAY
   */

  async function loadRazorpayScript() {
    if (getRazorpayConstructor()) {
      return true;
    }

    return new Promise<boolean>((resolve) => {
      const script =
        document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  }

  /*
   * PAY REMAINING ONLINE
   */

  async function payRemaining() {
    if (!order) return;

    const remainingAmount =
      Number(order.remaining_amount);

    if (remainingAmount <= 0) {
      setPaymentMessage(
        "There is no remaining amount to pay."
      );

      return;
    }

    try {
      setPayLoading(true);
      setPaymentMessage("");

      /*
       * Get the current Supabase session.
       *
       * IMPORTANT:
       * The access token must be sent to
       * the server API route.
       */

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setPayLoading(false);

        setPaymentMessage(
          "You must be signed in. Please sign in again."
        );

        return;
      }

      /*
       * CREATE RAZORPAY ORDER
       *
       * The Authorization header is important.
       */

      const response = await fetch(
        "/api/payment/create-remaining-order",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization:
              `Bearer ${session.access_token}`,
          },

          body: JSON.stringify({
            orderId: order.id,
          }),
        }
      );

      /*
       * Read response safely.
       *
       * This prevents:
       * Unexpected token '<'
       *
       * when the server accidentally
       * returns an HTML error page.
       */

      const responseText =
        await response.text();

      let data: {
        success?: boolean;
        orderId?: string;
        amount?: number;
        currency?: string;
        keyId?: string;
        customerName?: string;
        customerEmail?: string;
        customerPhone?: string;
        amountToPay?: number;
        error?: string;
      };

      try {
        data = JSON.parse(responseText);
      } catch {
        console.error(
          "Create remaining payment returned non-JSON:",
          responseText
        );

        throw new Error(
          `Payment API returned an invalid response (${response.status}). Check app/api/payment/create-remaining-order/route.ts.`
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to create remaining payment."
        );
      }

      /*
       * LOAD RAZORPAY CHECKOUT
       */

      const loaded =
        await loadRazorpayScript();

      if (!loaded) {
        throw new Error(
          "Razorpay could not be loaded. Please check your internet connection and try again."
        );
      }

      if (!data.keyId || !data.orderId) {
        throw new Error(
          "Razorpay payment information is incomplete."
        );
      }

      const RazorpayConstructor =
        getRazorpayConstructor();

      if (!RazorpayConstructor) {
        throw new Error(
          "Razorpay could not be loaded. Please refresh and try again."
        );
      }

      /*
       * OPEN RAZORPAY
       */

      const razorpay =
        new RazorpayConstructor({
          key: data.keyId,

          amount: data.amount || 0,

          currency:
            data.currency || "INR",

          name: "Maruti Tiles",

          description:
            `Remaining payment for order ${order.id}`,

          order_id: data.orderId,

          prefill: {
            name:
              data.customerName || "",

            email:
              data.customerEmail || "",

            contact:
              data.customerPhone || "",
          },

          notes: {
            order_id: order.id,
            payment_type: "remaining",
          },

          theme: {
            color: "#c9a45d",
          },

          /*
           * RAZORPAY SUCCESS
           */

          handler:
            async function (
              paymentResponse
            ) {
              try {
                setPaymentMessage(
                  "Payment received. Verifying payment..."
                );

                /*
                 * Get the latest session again.
                 *
                 * This guarantees that the
                 * verification request has
                 * a valid Supabase token.
                 */

                const {
                  data: {
                    session: currentSession,
                  },
                } =
                  await supabase.auth.getSession();

                if (
                  !currentSession?.access_token
                ) {
                  throw new Error(
                    "Your login session has expired. Please sign in again."
                  );
                }

                /*
                 * VERIFY RAZORPAY PAYMENT
                 */

                const verifyResponse =
                  await fetch(
                    "/api/payment/verify-remaining",
                    {
                      method: "POST",

                      headers: {
                        "Content-Type":
                          "application/json",

                        Authorization:
                          `Bearer ${currentSession.access_token}`,
                      },

                      body: JSON.stringify({
                        orderId: order.id,

                        razorpayPaymentId:
                          paymentResponse.razorpay_payment_id,

                        razorpayOrderId:
                          paymentResponse.razorpay_order_id,

                        razorpaySignature:
                          paymentResponse.razorpay_signature,
                      }),
                    }
                  );

                /*
                 * Read response safely.
                 */

                const verifyText =
                  await verifyResponse.text();

                let verifyData: {
                  success?: boolean;
                  error?: string;
                  message?: string;
                };

                try {
                  verifyData =
                    JSON.parse(verifyText);
                } catch {
                  console.error(
                    "Verify remaining payment returned non-JSON:",
                    verifyText
                  );

                  throw new Error(
                    `Payment verification API returned an invalid response (${verifyResponse.status}). Check app/api/payment/verify-remaining/route.ts.`
                  );
                }

                if (!verifyResponse.ok) {
                  throw new Error(
                    verifyData?.error ||
                      "Payment verification failed."
                  );
                }

                /*
                 * Update the screen immediately.
                 *
                 * The server should already have
                 * updated Supabase.
                 */

                setOrder((current) =>
                  current
                    ? {
                        ...current,

                        amount_paid:
                          Number(
                            current.total
                          ),

                        remaining_amount: 0,

                        payment_status: "paid",
                      }
                    : current
                );

                setPaymentMessage(
                  "Remaining payment successful. Your order is now fully paid."
                );
              } catch (error) {
                console.error(
                  "Remaining payment verification error:",
                  error
                );

                setPaymentMessage(
                  error instanceof Error
                    ? error.message
                    : "Payment verification failed."
                );
              } finally {
                setPayLoading(false);
              }
            },

          /*
           * RAZORPAY CLOSED
           */

          modal: {
            ondismiss: function () {
              setPayLoading(false);

              setPaymentMessage(
                "Payment window closed."
              );
            },
          },
        });

      /*
       * RAZORPAY FAILURE
       */

      razorpay.on(
        "payment.failed",
        function (
          response: RazorpayErrorResponse
        ) {
          console.error(
            "Razorpay payment failed:",
            response
          );

          setPayLoading(false);

          setPaymentMessage(
            response?.error?.description ||
              "Payment failed. Please try again."
          );
        }
      );

      /*
       * OPEN PAYMENT WINDOW
       */

      razorpay.open();
    } catch (error) {
      console.error(
        "Remaining payment error:",
        error
      );

      setPayLoading(false);

      setPaymentMessage(
        error instanceof Error
          ? error.message
          : "Unable to start payment."
      );
    }
  }

  /*
   * REQUEST CASH PAYMENT
   *
   * This does NOT mark the order
   * as paid.
   *
   * It only records that the customer
   * wants to pay the remaining amount
   * when the delivery person arrives.
   */

  async function requestCashPayment() {
    if (!order) return;

    const remainingAmount =
      Number(order.remaining_amount);

    if (remainingAmount <= 0) {
      setPaymentMessage(
        "There is no remaining amount."
      );

      return;
    }

    try {
      setCashLoading(true);
      setPaymentMessage("");

      /*
       * Get current Supabase session.
       */

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setCashLoading(false);

        setPaymentMessage(
          "Your login session has expired. Please sign in again."
        );

        return;
      }

      /*
       * REQUEST CASH PAYMENT
       */

      const response = await fetch(
        "/api/payment/request-cash",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization:
              `Bearer ${session.access_token}`,
          },

          body: JSON.stringify({
            orderId: order.id,
          }),
        }
      );

      /*
       * Read response safely.
       */

      const responseText =
        await response.text();

      let data: {
        success?: boolean;
        alreadyRequested?: boolean;
        requestId?: string;
        amount?: number;
        status?: string;
        message?: string;
        error?: string;
      };

      try {
        data = JSON.parse(responseText);
      } catch {
        console.error(
          "Cash payment API returned non-JSON:",
          responseText
        );

        throw new Error(
          `Cash payment API returned an invalid response (${response.status}). Check that app/api/payment/request-cash/route.ts exists.`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to request cash payment."
        );
      }

      setCashRequested(true);

      setPaymentMessage(
        data.message ||
          "Cash payment selected. Please pay the remaining amount to the delivery person when they arrive. The owner will confirm the payment."
      );
    } catch (error) {
      console.error(
        "Cash payment request error:",
        error
      );

      setPaymentMessage(
        error instanceof Error
          ? error.message
          : "Unable to request cash payment."
      );
    } finally {
      setCashLoading(false);
    }
  }

  /*
   * LOADING
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0b0a] px-5 py-12 text-white sm:px-6 md:py-16">
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

  /*
   * ERROR
   */

  if (message || !order) {
    return (
      <main className="min-h-screen bg-[#0b0b0a] px-5 py-12 text-white sm:px-6 md:py-16">
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
              {message ||
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

  /*
   * ORDER STATUS
   */

  const status =
    order.status?.toLowerCase() ||
    "confirmed";

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

  const remainingAmount =
    Number(order.remaining_amount);

  const isFullyPaid =
    remainingAmount <= 0 ||
    order.payment_status === "paid";

  const isOutForDelivery =
    status === "out for delivery";

  /*
   * PAGE
   */

  return (
    <main className="min-h-screen bg-[#0b0b0a] text-white">

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-[#292824] bg-[#0b0b0a]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6">

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

      {/* CONTENT */}

      <section className="px-5 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-5xl">

          <Link
            href="/my-order"
            className="text-sm font-medium text-stone-400 underline underline-offset-4 transition hover:text-[#c9a45d]"
          >
            ← Back to My Orders
          </Link>

          {/* PAGE HEADER */}

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

          {/* DELIVERY STATUS */}

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

          {/* PAYMENT INFORMATION */}

          <section className="mt-6 rounded-[2rem] border border-[#302e2a] bg-[#121210] p-7 shadow-2xl sm:p-10">

            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c9a45d]">
              Payment Information
            </p>

            <div className="mt-7 grid gap-7 sm:grid-cols-4">

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

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-600">
                  Payment Status
                </p>

                <p className="mt-2 text-sm font-semibold capitalize text-[#d7b56d]">
                  {order.payment_status}
                </p>
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-600">
                  Paid
                </p>

                <p className="mt-2 text-sm font-semibold text-white">
                  ₹
                  {Number(
                    order.amount_paid
                  ).toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-600">
                  Remaining
                </p>

                <p className="mt-2 text-sm font-semibold text-white">
                  ₹
                  {remainingAmount.toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>

            </div>

            {/* REMAINING PAYMENT */}

            {!isFullyPaid && (
              <div className="mt-8 rounded-[1.5rem] border border-[#51442b] bg-[#191711] p-6">

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9a45d]">
                  Remaining Payment
                </p>

                <div className="mt-3">

                  <p className="text-sm text-stone-400">
                    Remaining amount
                  </p>

                  <p className="mt-1 text-3xl font-semibold text-white">
                    ₹
                    {remainingAmount.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  {!isOutForDelivery ? (
                    <p className="mt-2 text-xs leading-5 text-stone-500">
                      Payment will be collected when your order is out for delivery.
                    </p>
                  ) : (
                    <>
                      <p className="mt-2 text-xs leading-5 text-stone-400">
                        Your order is out for delivery. Pay the remaining amount when the delivery person reaches you.
                      </p>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2">

                        {/* ONLINE PAYMENT */}

                        <button
                          type="button"
                          onClick={payRemaining}
                          disabled={
                            payLoading ||
                            cashLoading
                          }
                          className="min-h-14 rounded-full bg-[#c9a45d] px-7 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-[#d8b873] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {payLoading
                            ? "Opening Payment..."
                            : `Pay ₹${remainingAmount.toLocaleString(
                                "en-IN"
                              )} Online`}
                        </button>

                        {/* CASH PAYMENT */}

                        <button
                          type="button"
                          onClick={
                            requestCashPayment
                          }
                          disabled={
                            cashLoading ||
                            payLoading ||
                            cashRequested
                          }
                          className="min-h-14 rounded-full border border-[#c9a45d] bg-transparent px-7 text-sm font-bold text-[#d7b56d] transition hover:bg-[#c9a45d] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {cashLoading
                            ? "Requesting..."
                            : cashRequested
                              ? "Cash Selected"
                              : `Pay ₹${remainingAmount.toLocaleString(
                                  "en-IN"
                                )} by Cash`}
                        </button>

                      </div>

                      {paymentMessage && (
                        <div className="mt-5 rounded-2xl border border-[#3d382d] bg-[#0f0f0d] px-4 py-3">

                          <p className="text-sm leading-6 text-stone-300">
                            {paymentMessage}
                          </p>

                        </div>
                      )}
                    </>
                  )}

                </div>

              </div>
            )}

            {/* FULLY PAID */}

            {isFullyPaid && (
              <div className="mt-8 rounded-[1.5rem] border border-green-900/50 bg-green-950/20 p-5">

                <p className="text-sm font-semibold text-green-300">
                  ✓ Payment completed
                </p>

                <p className="mt-1 text-xs text-stone-500">
                  This order has no remaining
                  balance.
                </p>

              </div>
            )}

          </section>

          {/* ORDER TOTAL */}

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
                ).toLocaleString(
                  "en-IN"
                )}
              </p>

            </div>

          </section>

          {/* ORDER DATE */}

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

          {/* BUTTONS */}

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

      {/* FOOTER */}

      <footer className="mt-10 border-t border-[#252420] bg-[#080807] px-5 py-10 text-center sm:px-6">

        <p className="text-xs text-stone-600">
          © 2026 Maruti Tiles. All Rights Reserved.
        </p>

      </footer>

    </main>
  );
}