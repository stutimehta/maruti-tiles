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

function getRazorpayConstructor() {
  return (window as Window & {
    Razorpay?: new (
      options: RazorpayOptions
    ) => RazorpayInstance;
  }).Razorpay;
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

    if (getRazorpayConstructor()) {
      return true;
    }

    return new Promise((resolve) => {
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existingScript) {
        existingScript.addEventListener("load", () => {
          resolve(!!getRazorpayConstructor());
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
        resolve(!!getRazorpayConstructor());
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
      const RazorpayConstructor = getRazorpayConstructor();

      if (!RazorpayConstructor) {
        throw new Error(
          "Razorpay could not be loaded. Please refresh the page and try again."
        );
      }

      const razorpay = new RazorpayConstructor({
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
          color: "#c7a665",
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
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090909] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[15%] top-[15%] h-[350px] w-[350px] rounded-full bg-[#c7a665]/10 blur-[130px]" />
          <div className="absolute bottom-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-[#d6bc80]/5 blur-[140px]" />
        </div>

        <p className="relative text-sm text-stone-400">
          Loading payment...
        </p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#090909] text-stone-100">

      {/* =====================================================
          PREMIUM AMBIENT BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[8%] h-[500px] w-[500px] rounded-full bg-[#b38d48]/10 blur-[150px]" />

        <div className="absolute right-[-8%] top-[30%] h-[600px] w-[600px] rounded-full bg-[#d4b875]/[0.06] blur-[170px]" />

        <div className="absolute bottom-[-15%] left-[30%] h-[500px] w-[500px] rounded-full bg-[#8c6c36]/[0.05] blur-[150px]" />
      </div>


      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0b0a]/95 text-white backdrop-blur-xl">

        <div className="mx-auto flex h-[78px] max-w-[1400px] items-center justify-between px-5 sm:px-7 lg:px-10">

          {/* TEXT ONLY BRAND */}

          <Link
            href="/"
            className="group flex shrink-0 items-center"
            aria-label="Maruti Tiles Home"
          >
            <div className="leading-none">

              <p className="font-serif text-[27px] font-medium uppercase tracking-[0.12em] text-stone-100 transition group-hover:text-[#d8ba79] sm:text-[31px]">
                Maruti
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="h-px w-6 bg-[#c7a665]" />

                <p className="text-[8px] font-semibold uppercase tracking-[0.55em] text-[#c7a665] sm:text-[9px]">
                  Tiles
                </p>
              </div>

            </div>
          </Link>


          {/* BACK BUTTON */}

          <Link
            href="/checkout"
            className="rounded-full border border-stone-700 px-5 py-2.5 text-xs font-semibold text-stone-200 transition hover:border-[#c7a665] hover:bg-[#c7a665] hover:text-black sm:px-6"
          >
            Back to Checkout
          </Link>

        </div>

      </header>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="relative z-10 px-5 py-14 sm:px-7 md:py-20 lg:py-24">

        <div className="mx-auto max-w-[1180px]">

          {/* INTRO */}

          <div className="max-w-4xl">

            <div className="flex items-center gap-3">

              <span className="h-px w-10 bg-[#c7a665]" />

              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c7a665]">
                Payment
              </p>

            </div>

            <h1 className="mt-6 max-w-4xl font-serif text-5xl font-medium leading-[0.95] tracking-[-0.045em] text-stone-100 sm:text-6xl md:text-7xl">

              Choose how to
              <span className="text-[#c7a665]">
                {" "}pay.
              </span>

            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-stone-400 sm:text-base">
              Select your payment method. The amount is calculated
              automatically from your product total.
            </p>

          </div>


          {/* =================================================
              MAIN GRID
          ================================================= */}

          <div className="mt-12 grid gap-7 lg:grid-cols-[1fr_360px]">


            {/* =================================================
                PAYMENT OPTIONS
            ================================================= */}

            <div className="rounded-[2rem] border border-stone-800 bg-[#11110f]/95 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-8">

              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">
                Payment Method
              </p>


              <div className="mt-7 space-y-4">


                {/* =================================================
                    ONLINE PAYMENT
                ================================================= */}

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("online");
                    setMessage("");
                  }}
                  disabled={loading}
                  className={`w-full rounded-3xl border p-5 text-left transition duration-300 ${
                    paymentMethod === "online"
                      ? "border-[#c7a665] bg-[#191712] shadow-[0_0_0_1px_rgba(199,166,101,0.12)]"
                      : "border-stone-800 bg-[#0d0d0c] hover:border-stone-600 hover:bg-[#151411]"
                  }`}
                >

                  <div className="flex items-start gap-4">

                    <div
                      className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        paymentMethod === "online"
                          ? "border-[#c7a665]"
                          : "border-stone-600"
                      }`}
                    >

                      {paymentMethod === "online" && (
                        <div className="h-2.5 w-2.5 rounded-full bg-[#c7a665]" />
                      )}

                    </div>


                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col justify-between gap-3 sm:flex-row">

                        <div>

                          <p className="text-base font-semibold text-stone-100">
                            Online Payment
                          </p>

                          <p className="mt-1 text-sm text-stone-500">
                            Pay 100% of the product amount now.
                          </p>

                        </div>

                        <p className="text-lg font-semibold text-[#d8bc7c]">
                          ₹
                          {onlineAmount.toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </div>

                      <p className="mt-4 text-xs leading-5 text-stone-500">
                        Razorpay Checkout will let you choose an
                        available payment method such as UPI or card.
                      </p>

                    </div>

                  </div>

                </button>


                {/* =================================================
                    CASH ON DELIVERY
                ================================================= */}

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("cod");
                    setMessage("");
                  }}
                  disabled={loading}
                  className={`w-full rounded-3xl border p-5 text-left transition duration-300 ${
                    paymentMethod === "cod"
                      ? "border-[#c7a665] bg-[#191712] shadow-[0_0_0_1px_rgba(199,166,101,0.12)]"
                      : "border-stone-800 bg-[#0d0d0c] hover:border-stone-600 hover:bg-[#151411]"
                  }`}
                >

                  <div className="flex items-start gap-4">

                    <div
                      className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        paymentMethod === "cod"
                          ? "border-[#c7a665]"
                          : "border-stone-600"
                      }`}
                    >

                      {paymentMethod === "cod" && (
                        <div className="h-2.5 w-2.5 rounded-full bg-[#c7a665]" />
                      )}

                    </div>


                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col justify-between gap-3 sm:flex-row">

                        <div>

                          <p className="text-base font-semibold text-stone-100">
                            Cash on Delivery
                          </p>

                          <p className="mt-1 text-sm text-stone-500">
                            Pay 20% advance now.
                          </p>

                        </div>

                        <p className="text-lg font-semibold text-[#d8bc7c]">
                          ₹
                          {codAdvanceAmount.toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </div>


                      <div className="mt-4 rounded-2xl border border-stone-800 bg-[#0b0b0a] p-4">

                        <div className="flex justify-between text-sm">

                          <span className="text-stone-500">
                            20% Advance
                          </span>

                          <span className="font-semibold text-stone-200">
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

                          <span className="font-semibold text-stone-200">
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


              {/* =================================================
                  SHIPPING
              ================================================= */}

              <div className="mt-7 rounded-2xl border border-stone-800 bg-[#151411] p-5">

                <p className="text-sm font-semibold text-stone-200">
                  Shipping charges
                </p>

                <p className="mt-2 text-xs leading-5 text-stone-500">
                  Shipping is separate from the product amount.
                  It will be calculated according to your
                  delivery location and paid directly to the
                  delivery person.
                </p>

              </div>


              {/* =================================================
                  MESSAGE
              ================================================= */}

              {message && (
                <div className="mt-5 rounded-2xl border border-[#6f5a31] bg-[#191712] px-4 py-3 text-sm leading-6 text-stone-300">
                  {message}
                </div>
              )}


              {/* =================================================
                  CONTINUE
              ================================================= */}

              <button
                type="button"
                onClick={continueToGateway}
                disabled={loading || !paymentMethod}
                className="mt-6 flex min-h-14 w-full items-center justify-center rounded-full bg-[#d2b06c] px-6 text-sm font-semibold text-[#11100e] shadow-[0_15px_40px_rgba(0,0,0,0.3)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e0c489] disabled:cursor-not-allowed disabled:bg-stone-800 disabled:text-stone-500 disabled:shadow-none"
              >

                {loading
                  ? "Opening Payment..."
                  : !paymentMethod
                    ? "Choose Payment Method"
                    : `Continue — ₹${amountToPay.toLocaleString(
                        "en-IN"
                      )}`}

                {!loading && paymentMethod && (
                  <span className="ml-2 text-lg">
                    →
                  </span>
                )}

              </button>

            </div>


            {/* =================================================
                ORDER SUMMARY
            ================================================= */}

            <aside className="h-fit rounded-[2rem] border border-stone-800 bg-[#11110f]/95 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-7">

              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">
                Order Summary
              </p>


              <div className="mt-6 space-y-4">

                {checkout.cart.map((item) => (

                  <div
                    key={item.id}
                    className="flex gap-3 border-b border-stone-800 pb-4"
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />


                    <div className="min-w-0 flex-1">

                      <p className="text-sm font-semibold text-stone-100">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-stone-500">
                        {item.quantity} sq.ft.
                      </p>

                      <p className="mt-1 text-xs font-semibold text-[#d8bc7c]">
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


              {/* TOTAL */}

              <div className="mt-6 border-t border-stone-800 pt-5">

                <div className="flex justify-between text-sm">

                  <span className="text-stone-500">
                    Product Total
                  </span>

                  <span className="font-semibold text-stone-100">
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>


                {/* PAY NOW */}

                <div className="mt-5 rounded-2xl border border-[#66542f] bg-[#191712] p-4">

                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#c7a665]">
                    Pay Now
                  </p>

                  <p className="mt-1 text-2xl font-semibold text-[#e0c489]">

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


      {/* =====================================================
          FOOTER ACCENT
      ===================================================== */}

      <div className="relative z-10 border-t border-stone-900 bg-[#070706] px-5 py-7 text-center">

        <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-stone-600">
          Maruti Tiles · Secure Payment
        </p>

      </div>

    </main>
  );
}