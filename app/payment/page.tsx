"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabase";

type CartItem = {
  id: number;
  name: string;
  category: string;
  size: string;
  finish: string;
  image: string;
  pricePerSqFt: number;
  quantity: number;
};

type CheckoutData = {
  customer_id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  subtotal: number;
  cart: CartItem[];
};

type PaymentMethod = "online" | "cod" | "";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
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
  modal?: {
    confirm_close?: boolean;
    escape?: boolean;
    backdropclose?: boolean;
  };
  handler: (response: RazorpayResponse) => void;
};

type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = {
  open: () => void;
  on: (
    event: string,
    callback: (response: {
      error?: {
        description?: string;
      };
    }) => void
  ) => void;
};

export default function PaymentPage() {
  const supabase = createClient();

  const [checkout, setCheckout] =
    useState<CheckoutData | null>(null);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /*
   * Load checkout information
   */
  useEffect(() => {
    async function loadCheckout() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth";
        return;
      }

      const saved = localStorage.getItem("maruti-checkout");

      if (!saved) {
        window.location.href = "/checkout";
        return;
      }

      try {
        const data = JSON.parse(saved) as CheckoutData;

        if (!data.cart || data.cart.length === 0) {
          window.location.href = "/cart";
          return;
        }

        setCheckout(data);
      } catch {
        localStorage.removeItem("maruti-checkout");
        window.location.href = "/checkout";
      }
    }

    loadCheckout();
  }, []);

  /*
   * Product total
   */
  const subtotal = useMemo(() => {
    return checkout?.subtotal || 0;
  }, [checkout]);

  /*
   * Payment calculations
   *
   * Online = 100%
   * COD    = 20% advance
   */
  const onlineAmount = subtotal;

  const codAdvanceAmount = Math.round(
    subtotal * 0.2
  );

  const codRemainingAmount = Math.round(
    subtotal * 0.8
  );

  /*
   * Amount that will actually be paid
   */
  const amountToPay =
    paymentMethod === "online"
      ? onlineAmount
      : paymentMethod === "cod"
        ? codAdvanceAmount
        : 0;

  /*
   * Load Razorpay Checkout script
   */
  async function loadRazorpayScript(): Promise<boolean> {
    if (typeof window === "undefined") {
      return false;
    }

    if (window.Razorpay) {
      return true;
    }

    return new Promise((resolve) => {
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existingScript) {
        existingScript.addEventListener("load", () => {
          resolve(!!window.Razorpay);
        });

        existingScript.addEventListener("error", () => {
          resolve(false);
        });

        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.async = true;

      script.onload = () => {
        resolve(!!window.Razorpay);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  }

  /*
   * Start Razorpay payment
   */
  async function continueToGateway() {
    if (!checkout) {
      return;
    }

    if (!paymentMethod) {
      setMessage("Please choose a payment method.");
      return;
    }

    if (amountToPay <= 0) {
      setMessage("Invalid payment amount.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      /*
       * Load Razorpay Checkout
       */
      const razorpayLoaded =
        await loadRazorpayScript();

      if (!razorpayLoaded) {
        setMessage(
          "Unable to load the payment gateway. Please check your internet connection and try again."
        );

        setLoading(false);
        return;
      }

      /*
       * Ask our server to create the Razorpay order.
       *
       * IMPORTANT:
       * The server will create the actual Razorpay order.
       */
      const createOrderResponse = await fetch(
        "/api/razorpay/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentMethod,
            checkout: {
              customer_id: checkout.customer_id,
              full_name: checkout.full_name,
              email: checkout.email,
              phone: checkout.phone,
              address: checkout.address,
              city: checkout.city,
              state: checkout.state,
              postal_code: checkout.postal_code,
              country: checkout.country,
              subtotal: checkout.subtotal,
              cart: checkout.cart,
            },
          }),
        }
      );

      const orderData =
        await createOrderResponse.json();

      if (!createOrderResponse.ok) {
        throw new Error(
          orderData?.error ||
            "Unable to create payment order."
        );
      }

      /*
       * Razorpay order returned by our server
       */
      const {
        orderId,
        amount,
        currency,
        keyId,
      } = orderData;

      if (!orderId || !keyId) {
        throw new Error(
          "Payment gateway configuration is incomplete."
        );
      }

      /*
       * Save payment attempt locally.
       */
      localStorage.setItem(
        "maruti-payment",
        JSON.stringify({
          paymentMethod,
          amountToPay,
          productTotal: subtotal,
          advanceAmount:
            paymentMethod === "cod"
              ? codAdvanceAmount
              : subtotal,
          remainingAmount:
            paymentMethod === "cod"
              ? codRemainingAmount
              : 0,
          razorpayOrderId: orderId,
          paymentStatus: "created",
        })
      );

      /*
       * Open Razorpay Checkout
       */
      const razorpay = new window.Razorpay({
        key: keyId,

        amount,

        currency,

        name: "Maruti Tiles",

        description:
          paymentMethod === "cod"
            ? "20% COD advance payment"
            : "Full online product payment",

        order_id: orderId,

        prefill: {
          name: checkout.full_name,
          email: checkout.email,
          contact: checkout.phone,
        },

        notes: {
          customer_id: checkout.customer_id,
          payment_method: paymentMethod,
          product_total: String(subtotal),
        },

        theme: {
          color: "#b38d48",
        },

        modal: {
          confirm_close: true,
          escape: true,
          backdropclose: false,
        },

        /*
         * Razorpay calls this after a successful
         * payment attempt.
         */
        handler: async (
          response: RazorpayResponse
        ) => {
          console.log(
            "RAZORPAY SUCCESS RESPONSE:",
            response
          );

          try {
            /*
             * Razorpay must return all three values after
             * a successful payment:
             * - razorpay_payment_id
             * - razorpay_order_id
             * - razorpay_signature
             */
            if (
              !response?.razorpay_payment_id ||
              !response?.razorpay_order_id ||
              !response?.razorpay_signature
            ) {
              console.error(
                "Incomplete Razorpay response:",
                response
              );

              setMessage(
                "Razorpay did not return the required payment information. Please try the payment again."
              );

              setLoading(false);
              return;
            }

            setMessage(
              "Payment received. Verifying payment..."
            );

            /*
             * Send payment details to our server.
             *
             * The server verifies the Razorpay signature.
             */
            /*
             * Get the currently logged-in Supabase session.
             * The server uses this access token to create the
             * order under the authenticated customer.
             */
            const {
              data: { session },
            } = await supabase.auth.getSession();

            if (!session?.access_token) {
              throw new Error(
                "Your login session has expired. Please sign in again."
              );
            }

            const verifyPayload = {
              razorpay_payment_id:
                response.razorpay_payment_id,

              razorpay_order_id:
                response.razorpay_order_id,

              razorpay_signature:
                response.razorpay_signature,

              paymentMethod,

              amountToPay,

              productTotal: subtotal,

              customer_id:
                checkout.customer_id,

              checkout,

              accessToken:
                session.access_token,
            };

            console.log(
              "RAZORPAY VERIFY PAYLOAD:",
              {
                ...verifyPayload,
                accessToken: "[hidden]",
                razorpay_signature: "[hidden]",
              }
            );

            const verifyResponse = await fetch(
              "/api/razorpay/verify",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify(
                  verifyPayload
                ),
              }
            );

            const verifyData =
              await verifyResponse.json();

            console.log(
              "RAZORPAY VERIFY RESPONSE:",
              verifyData
            );

            if (!verifyResponse.ok) {
              throw new Error(
                verifyData?.error ||
                  "Payment verification failed."
              );
            }

            /*
             * Payment is verified.
             */
            localStorage.setItem(
              "maruti-payment",
              JSON.stringify({
                paymentMethod,
                amountToPay,
                productTotal: subtotal,

                advanceAmount:
                  paymentMethod === "cod"
                    ? codAdvanceAmount
                    : subtotal,

                remainingAmount:
                  paymentMethod === "cod"
                    ? codRemainingAmount
                    : 0,

                razorpayOrderId:
                  response.razorpay_order_id,

                razorpayPaymentId:
                  response.razorpay_payment_id,

                paymentStatus: "verified",
              })
            );

            /*
             * The payment is verified and the Supabase order
             * has been created. Save the order ID and redirect
             * the customer to the confirmation page.
             */
            if (verifyData?.orderId) {
              const orderId =
                String(verifyData.orderId);

              localStorage.setItem(
                "maruti-order-id",
                orderId
              );

              window.location.href =
                `/order-success?orderId=${encodeURIComponent(
                  orderId
                )}`;

              return;
            }

            setMessage(
              "Payment successful and verified."
            );
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            setMessage(
              error instanceof Error
                ? error.message
                : "Payment verification failed. Please contact us."
            );
          } finally {
            setLoading(false);
          }
        },
      });

      /*
       * Handle payment failures.
       */
      razorpay.on(
        "payment.failed",
        (response) => {
          console.error(
            "Razorpay payment failed:",
            response
          );

          setMessage(
            response?.error?.description ||
              "Payment failed. Please try again."
          );

          setLoading(false);
        }
      );

      /*
       * IMPORTANT:
       * Open must happen from the button click flow.
       */
      razorpay.open();
    } catch (error) {
      console.error(
        "Razorpay checkout error:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to start payment. Please try again."
      );

      setLoading(false);
    }
  }

  /*
   * Loading state
   */
  if (!checkout) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0]">
        <p className="text-sm text-stone-500">
          Loading payment...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-stone-900">

      {/* HEADER */}

      <header className="border-b border-stone-200 bg-[#f7f5f0]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6">

          <Link
            href="/"
            className="flex items-center"
          >
            <img
              src="/images/brand/logo.png"
              alt="Maruti Tiles"
              className="h-11 w-11 object-contain"
            />

            <span className="ml-3 text-lg font-bold tracking-tight">
              MARUTI TILES
            </span>
          </Link>

          <Link
            href="/checkout"
            className="rounded-full border border-stone-300 px-5 py-2.5 text-xs font-semibold transition hover:bg-stone-950 hover:text-white"
          >
            Back to Checkout
          </Link>

        </div>
      </header>


      {/* CONTENT */}

      <section className="px-5 py-12 sm:px-6 md:py-20">

        <div className="mx-auto max-w-5xl">

          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#b38d48]">
            Payment
          </p>

          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-stone-950 sm:text-6xl">
            Choose how to pay.
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-stone-500">
            Select your payment method. The amount is calculated
            automatically from your product total.
          </p>


          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px]">

            {/* PAYMENT OPTIONS */}

            <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">

              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
                Payment Method
              </p>


              <div className="mt-7 space-y-4">

                {/* ONLINE */}

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("online");
                    setMessage("");
                  }}
                  disabled={loading}
                  className={`w-full rounded-3xl border p-5 text-left transition ${
                    paymentMethod === "online"
                      ? "border-stone-950 bg-stone-50"
                      : "border-stone-200 bg-white hover:border-stone-400"
                  }`}
                >

                  <div className="flex items-start gap-4">

                    <div
                      className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        paymentMethod === "online"
                          ? "border-stone-950"
                          : "border-stone-300"
                      }`}
                    >

                      {paymentMethod === "online" && (
                        <div className="h-2.5 w-2.5 rounded-full bg-stone-950" />
                      )}

                    </div>


                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col justify-between gap-2 sm:flex-row">

                        <div>

                          <p className="text-base font-semibold">
                            Online Payment
                          </p>

                          <p className="mt-1 text-sm text-stone-500">
                            Pay 100% of the product amount now.
                          </p>

                        </div>

                        <p className="text-lg font-semibold">
                          ₹{onlineAmount.toLocaleString("en-IN")}
                        </p>

                      </div>

                      <p className="mt-4 text-xs leading-5 text-stone-500">
                        Razorpay Checkout will let you choose an
                        available payment method such as UPI or card.
                      </p>

                    </div>

                  </div>

                </button>


                {/* COD */}

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("cod");
                    setMessage("");
                  }}
                  disabled={loading}
                  className={`w-full rounded-3xl border p-5 text-left transition ${
                    paymentMethod === "cod"
                      ? "border-stone-950 bg-stone-50"
                      : "border-stone-200 bg-white hover:border-stone-400"
                  }`}
                >

                  <div className="flex items-start gap-4">

                    <div
                      className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        paymentMethod === "cod"
                          ? "border-stone-950"
                          : "border-stone-300"
                      }`}
                    >

                      {paymentMethod === "cod" && (
                        <div className="h-2.5 w-2.5 rounded-full bg-stone-950" />
                      )}

                    </div>


                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col justify-between gap-2 sm:flex-row">

                        <div>

                          <p className="text-base font-semibold">
                            Cash on Delivery
                          </p>

                          <p className="mt-1 text-sm text-stone-500">
                            Pay 20% advance now.
                          </p>

                        </div>

                        <p className="text-lg font-semibold">
                          ₹
                          {codAdvanceAmount.toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </div>


                      <div className="mt-4 rounded-2xl bg-[#f6f3ed] p-4">

                        <div className="flex justify-between text-sm">

                          <span className="text-stone-500">
                            20% Advance
                          </span>

                          <span className="font-semibold">
                            ₹
                            {codAdvanceAmount.toLocaleString(
                              "en-IN"
                            )}
                          </span>

                        </div>


                        <div className="mt-3 flex justify-between text-sm">

                          <span className="text-stone-500">
                            Remaining 80%
                          </span>

                          <span className="font-semibold">
                            ₹
                            {codRemainingAmount.toLocaleString(
                              "en-IN"
                            )}
                          </span>

                        </div>

                      </div>

                    </div>

                  </div>

                </button>

              </div>


              {/* SHIPPING */}

              <div className="mt-7 rounded-2xl bg-[#f6f3ed] p-5">

                <p className="text-sm font-semibold">
                  Shipping charges
                </p>

                <p className="mt-2 text-xs leading-5 text-stone-500">
                  Shipping is separate from the product amount.
                  It will be calculated according to your
                  delivery location and paid directly to the
                  delivery person.
                </p>

              </div>


              {/* MESSAGE */}

              {message && (
                <div className="mt-5 rounded-2xl bg-[#f6f3ed] px-4 py-3 text-sm leading-6 text-stone-600">
                  {message}
                </div>
              )}


              {/* CONTINUE */}

              <button
                type="button"
                onClick={continueToGateway}
                disabled={loading || !paymentMethod}
                className="mt-6 flex min-h-14 w-full items-center justify-center rounded-full bg-stone-950 px-6 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {loading
                  ? "Opening Payment..."
                  : !paymentMethod
                    ? "Choose Payment Method"
                    : `Continue — ₹${amountToPay.toLocaleString(
                        "en-IN"
                      )}`}

                {!loading && paymentMethod && (
                  <span className="ml-2">
                    →
                  </span>
                )}

              </button>

            </div>


            {/* ORDER SUMMARY */}

            <aside className="h-fit rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-7">

              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
                Order Summary
              </p>


              <div className="mt-6 space-y-4">

                {checkout.cart.map((item) => (

                  <div
                    key={item.id}
                    className="flex gap-3 border-b border-stone-100 pb-4"
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />


                    <div className="min-w-0 flex-1">

                      <p className="text-sm font-semibold">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-stone-500">
                        {item.quantity} sq.ft.
                      </p>

                      <p className="mt-1 text-xs font-semibold">
                        ₹
                        {(
                          item.pricePerSqFt *
                          item.quantity
                        ).toLocaleString("en-IN")}
                      </p>

                    </div>

                  </div>

                ))}

              </div>


              <div className="mt-6 border-t border-stone-200 pt-5">

                <div className="flex justify-between text-sm">

                  <span className="text-stone-500">
                    Product Total
                  </span>

                  <span className="font-semibold">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>

                </div>


                <div className="mt-5 rounded-2xl bg-[#f6f3ed] p-4">

                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                    Pay Now
                  </p>

                  <p className="mt-1 text-2xl font-semibold">
                    {paymentMethod
                      ? `₹${amountToPay.toLocaleString(
                          "en-IN"
                        )}`
                      : "—"}
                  </p>

                </div>

              </div>

            </aside>

          </div>

        </div>

      </section>

    </main>
  );
}