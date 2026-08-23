"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabase";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import {
  Country,
  State,
  City,
  ICountry,
  IState,
  ICity,
} from "country-state-city";

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

export default function CheckoutPage() {
  const supabase = createClient();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState("");

  /*
   * LOCATION
   *
   * Country → State → City
   */
  const [selectedCountry, setSelectedCountry] =
    useState<ICountry | null>(
      Country.getAllCountries().find(
        (item) => item.name === "India"
      ) || null
    );

  const [selectedState, setSelectedState] =
    useState<IState | null>(null);

  const [selectedCity, setSelectedCity] =
    useState<ICity | null>(null);

  const [postalCode, setPostalCode] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /*
   * ALL COUNTRIES
   */
  const countries = Country.getAllCountries();

  /*
   * STATES FOR SELECTED COUNTRY
   */
  const states = selectedCountry
    ? State.getStatesOfCountry(
        selectedCountry.isoCode
      )
    : [];

  /*
   * CITIES FOR SELECTED STATE
   */
  const cities =
    selectedCountry && selectedState
      ? City.getCitiesOfState(
          selectedCountry.isoCode,
          selectedState.isoCode
        )
      : [];

  useEffect(() => {
    async function loadCheckout() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          window.location.href = "/auth";
          return;
        }

        const saved = JSON.parse(
          localStorage.getItem("maruti-cart") || "[]"
        ) as CartItem[];

        if (saved.length === 0) {
          window.location.href = "/cart";
          return;
        }

        setCart(saved);

        setEmail(user.email || "");

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, phone, email")
          .eq("id", user.id)
          .single();

        if (profile) {
          setName(profile.full_name || "");
          setPhone(profile.phone || "");
          setEmail(
            profile.email || user.email || ""
          );
        }
      } catch {
        window.location.href = "/auth";
        return;
      }

      setLoaded(true);
    }

    loadCheckout();
  }, []);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        item.pricePerSqFt * item.quantity,
      0
    );
  }, [cart]);

  async function continueToPayment(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

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

      if (cart.length === 0) {
        setMessage("Your cart is empty.");
        setLoading(false);
        return;
      }

      /*
       * Make sure location has been selected.
       */
      if (!selectedCountry) {
        setMessage("Please select your country.");
        setLoading(false);
        return;
      }

      if (!selectedState) {
        setMessage("Please select your state.");
        setLoading(false);
        return;
      }

      if (!selectedCity) {
        setMessage("Please select your city.");
        setLoading(false);
        return;
      }

      /*
       * SAVE CHECKOUT DETAILS
       *
       * The order is NOT created here.
       * The customer chooses payment on /payment.
       */
      const checkoutData = {
        customer_id: user.id,

        full_name: name,
        email,
        phone,

        address,

        city: selectedCity.name,
        state: selectedState.name,
        postal_code: postalCode,
        country: selectedCountry.name,

        subtotal,
        cart,
      };

      localStorage.setItem(
        "maruti-checkout",
        JSON.stringify(checkoutData)
      );

      /*
       * Go to payment selection.
       *
       * Online Payment = 100%
       * COD = 20% advance
       */
      window.location.href = "/payment";
    } catch {
      setMessage(
        "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  }

  if (!loaded) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090909] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[10%] top-[15%] h-[400px] w-[400px] rounded-full bg-[#c7a665]/10 blur-[130px]" />
          <div className="absolute right-[5%] bottom-[5%] h-[450px] w-[450px] rounded-full bg-[#d7bb83]/[0.06] blur-[150px]" />
        </div>

        <div className="relative text-center">
          <p className="font-serif text-3xl tracking-[0.08em] text-stone-100">
            MARUTI
          </p>

          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="h-px w-5 bg-[#c7a665]" />

            <p className="text-[8px] font-semibold uppercase tracking-[0.5em] text-[#c7a665]">
              Tiles
            </p>
          </div>

          <p className="mt-8 text-sm text-stone-500">
            Loading checkout...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#090909] text-stone-100">

      {/* =========================================================
          PREMIUM BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[5%] h-[600px] w-[600px] rounded-full bg-[#b99558]/10 blur-[160px]" />

        <div className="absolute right-[-12%] top-[25%] h-[650px] w-[650px] rounded-full bg-[#d6bc83]/[0.07] blur-[170px]" />

        <div className="absolute bottom-[-15%] left-[30%] h-[550px] w-[550px] rounded-full bg-[#8d6b38]/[0.06] blur-[160px]" />

        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.015)_0%,transparent_40%,rgba(199,166,101,0.025)_100%)]" />
      </div>


      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="sticky top-0 z-50 border-b border-stone-800/80 bg-[#0b0b0a]/95 text-white backdrop-blur-xl">

        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-5 sm:px-7 lg:px-10">

          {/* TEXT-ONLY BRAND */}

          <Link
            href="/"
            className="group flex shrink-0 items-center"
            aria-label="Maruti Tiles Home"
          >
            <div className="leading-none">

              <p className="font-serif text-[27px] font-medium uppercase tracking-[0.13em] text-stone-100 transition group-hover:text-[#d8ba79] sm:text-[31px]">
                Maruti
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="h-px w-6 bg-[#c7a665]" />

                <p className="text-[8px] font-semibold uppercase tracking-[0.52em] text-[#c7a665] sm:text-[9px]">
                  Tiles
                </p>
              </div>

            </div>
          </Link>


          {/* BACK TO CART */}

          <Link
            href="/cart"
            className="rounded-full border border-stone-700 px-5 py-2.5 text-xs font-semibold text-stone-200 transition hover:border-[#c8a867] hover:bg-[#c8a867] hover:text-black"
          >
            Back to Cart
          </Link>

        </div>

      </header>


      {/* =========================================================
          CHECKOUT CONTENT
      ========================================================= */}

      <section className="relative px-5 py-12 sm:px-7 md:py-20">

        <div className="mx-auto max-w-[1400px]">

          {/* GOLD TOP LINE */}

          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-10 bg-[#c7a665]" />

            <p className="text-[9px] font-bold uppercase tracking-[0.42em] text-[#c7a665]">
              Surat · Gujarat · India
            </p>
          </div>


          {/* PAGE INTRO */}

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c8a867]">
              Secure Checkout
            </p>

            <h1 className="mt-5 max-w-[800px] font-serif text-5xl font-medium leading-[0.95] tracking-[-0.045em] text-stone-100 sm:text-6xl md:text-7xl">
              Complete your
              <span className="block text-[#c7a665]">
                selection.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-stone-400 sm:text-base">
              Enter your delivery details to place your
              Maruti Tiles order.
            </p>

          </div>


          {/* =====================================================
              CHECKOUT FORM
          ===================================================== */}

          <form
            onSubmit={continueToPayment}
            className="mt-12 grid gap-8 lg:grid-cols-[1fr_390px]"
          >

            {/* ===================================================
                SHIPPING DETAILS
            =================================================== */}

            <div className="rounded-[2rem] border border-stone-800 bg-[#11110f]/95 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.3)] sm:p-8">

              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#c7a665]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c8a867]">
                  Shipping Details
                </p>
              </div>


              <div className="mt-8 grid gap-5 sm:grid-cols-2">


                {/* NAME */}

                <div className="sm:col-span-2">

                  <label className="text-xs font-semibold text-stone-200">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    required
                    placeholder="Your full name"
                    className="mt-2 h-13 w-full rounded-full border border-stone-700 bg-[#0c0c0b] px-5 text-sm text-stone-100 outline-none placeholder:text-stone-600 transition focus:border-[#c7a665] focus:ring-1 focus:ring-[#c7a665]/30"
                  />

                </div>


                {/* EMAIL */}

                <div>

                  <label className="text-xs font-semibold text-stone-200">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    required
                    placeholder="you@example.com"
                    className="mt-2 h-13 w-full rounded-full border border-stone-700 bg-[#0c0c0b] px-5 text-sm text-stone-100 outline-none placeholder:text-stone-600 transition focus:border-[#c7a665] focus:ring-1 focus:ring-[#c7a665]/30"
                  />

                </div>


                {/* PHONE */}

                <div>

                  <label className="text-xs font-semibold text-stone-200">
                    Phone / WhatsApp
                  </label>

                  <div className="mt-2 rounded-full border border-stone-700 bg-[#0c0c0b] px-4 text-stone-100 transition focus-within:border-[#c7a665] focus-within:ring-1 focus-within:ring-[#c7a665]/30 [&_.PhoneInputCountry]:text-stone-200 [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:text-stone-100 [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:placeholder:text-stone-600">

                    <PhoneInput
                      international
                      defaultCountry="IN"
                      value={phone}
                      onChange={(value) =>
                        setPhone(value || "")
                      }
                      required
                      placeholder="Phone / WhatsApp number"
                      className="phone-input"
                    />

                  </div>

                </div>


                {/* ADDRESS */}

                <div className="sm:col-span-2">

                  <label className="text-xs font-semibold text-stone-200">
                    Address
                  </label>

                  <textarea
                    value={address}
                    onChange={(event) =>
                      setAddress(event.target.value)
                    }
                    required
                    rows={3}
                    placeholder="House / building, street, area"
                    className="mt-2 w-full resize-none rounded-3xl border border-stone-700 bg-[#0c0c0b] px-5 py-4 text-sm text-stone-100 outline-none placeholder:text-stone-600 transition focus:border-[#c7a665] focus:ring-1 focus:ring-[#c7a665]/30"
                  />

                </div>


                {/* CITY */}

                <div>

                  <label className="text-xs font-semibold text-stone-200">
                    City
                  </label>

                  <select
                    value={selectedCity?.name || ""}
                    onChange={(event) => {
                      const city = cities.find(
                        (item) =>
                          item.name ===
                          event.target.value
                      );

                      setSelectedCity(
                        city || null
                      );
                    }}
                    required
                    disabled={!selectedState}
                    className="mt-2 h-13 w-full rounded-full border border-stone-700 bg-[#0c0c0b] px-5 text-sm text-stone-100 outline-none transition focus:border-[#c7a665] disabled:bg-[#11110f] disabled:text-stone-600"
                  >

                    <option value="">
                      {selectedState
                        ? "Select city"
                        : "Select state first"}
                    </option>

                    {cities.map((city) => (
                      <option
                        key={`${city.name}-${city.stateCode}`}
                        value={city.name}
                      >
                        {city.name}
                      </option>
                    ))}

                  </select>

                </div>


                {/* STATE */}

                <div>

                  <label className="text-xs font-semibold text-stone-200">
                    State
                  </label>

                  <select
                    value={
                      selectedState?.isoCode || ""
                    }
                    onChange={(event) => {

                      const state = states.find(
                        (item) =>
                          item.isoCode ===
                          event.target.value
                      );

                      setSelectedState(
                        state || null
                      );

                      /*
                       * Reset city whenever
                       * state changes.
                       */

                      setSelectedCity(null);

                    }}
                    required
                    disabled={!selectedCountry}
                    className="mt-2 h-13 w-full rounded-full border border-stone-700 bg-[#0c0c0b] px-5 text-sm text-stone-100 outline-none transition focus:border-[#c7a665] disabled:bg-[#11110f] disabled:text-stone-600"
                  >

                    <option value="">
                      {selectedCountry
                        ? "Select state"
                        : "Select country first"}
                    </option>

                    {states.map((state) => (
                      <option
                        key={state.isoCode}
                        value={state.isoCode}
                      >
                        {state.name}
                      </option>
                    ))}

                  </select>

                </div>


                {/* PIN / ZIP */}

                <div>

                  <label className="text-xs font-semibold text-stone-200">
                    PIN / ZIP Code
                  </label>

                  <input
                    type="text"
                    value={postalCode}
                    onChange={(event) =>
                      setPostalCode(
                        event.target.value
                      )
                    }
                    required
                    placeholder="PIN / ZIP"
                    className="mt-2 h-13 w-full rounded-full border border-stone-700 bg-[#0c0c0b] px-5 text-sm text-stone-100 outline-none placeholder:text-stone-600 transition focus:border-[#c7a665] focus:ring-1 focus:ring-[#c7a665]/30"
                  />

                </div>


                {/* COUNTRY */}

                <div>

                  <label className="text-xs font-semibold text-stone-200">
                    Country
                  </label>

                  <select
                    value={
                      selectedCountry?.isoCode || ""
                    }
                    onChange={(event) => {

                      const country =
                        countries.find(
                          (item) =>
                            item.isoCode ===
                            event.target.value
                        );

                      /*
                       * Change country.
                       */

                      setSelectedCountry(
                        country || null
                      );

                      /*
                       * Reset state and city
                       * because they belong to
                       * the previous country.
                       */

                      setSelectedState(null);
                      setSelectedCity(null);

                    }}
                    required
                    className="mt-2 h-13 w-full rounded-full border border-stone-700 bg-[#0c0c0b] px-5 text-sm text-stone-100 outline-none transition focus:border-[#c7a665]"
                  >

                    <option value="">
                      Select country
                    </option>

                    {countries.map((country) => (
                      <option
                        key={country.isoCode}
                        value={country.isoCode}
                      >
                        {country.name}
                      </option>
                    ))}

                  </select>

                </div>

              </div>

            </div>


            {/* ===================================================
                ORDER SUMMARY
            =================================================== */}

            <aside className="h-fit rounded-[2rem] border border-stone-800 bg-[#11110f]/95 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.3)] sm:p-7">

              <div className="flex items-center gap-3">

                <span className="h-px w-8 bg-[#c7a665]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c8a867]">
                  Order Summary
                </p>

              </div>


              {/* PRODUCTS */}

              <div className="mt-6 space-y-4">

                {cart.map((item) => (

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

                      <p className="mt-1 text-xs font-semibold text-[#d5b675]">
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

              <div className="mt-6 space-y-4 border-t border-stone-800 pt-5">

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

              </div>


              {/* SHIPPING MESSAGE */}

              <div className="mt-6 rounded-2xl border border-[#c7a665]/15 bg-[#171511] p-4">

                <p className="text-xs font-semibold text-stone-100">
                  Shipping charges
                </p>

                <p className="mt-1 text-xs leading-5 text-stone-500">
                  Shipping is separate from the
                  product amount. It will be
                  calculated according to your
                  location and paid directly to the
                  delivery person.
                </p>

              </div>


              {/* PAYMENT MESSAGE */}

              <div className="mt-4 rounded-2xl border border-stone-800 bg-[#0d0d0c] p-4">

                <p className="text-xs font-semibold text-stone-100">
                  Payment
                </p>

                <p className="mt-1 text-xs leading-6 text-stone-500">
                  Choose your payment method on
                  the next step. Online payment
                  requires the full product amount.
                  Cash on Delivery requires a 20%
                  advance payment.
                </p>

              </div>


              {/* ERROR MESSAGE */}

              {message && (

                <div className="mt-5 rounded-2xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm leading-6 text-red-300">
                  {message}
                </div>

              )}


              {/* CONTINUE */}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 flex min-h-14 w-full items-center justify-center rounded-full bg-[#d2b06c] px-6 text-sm font-semibold text-black shadow-[0_15px_40px_rgba(210,176,108,0.12)] transition hover:-translate-y-0.5 hover:bg-[#e0c489] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading
                  ? "Processing..."
                  : "Continue to Payment"}

                {!loading && (
                  <span className="ml-3 text-lg">
                    →
                  </span>
                )}

              </button>

            </aside>

          </form>

        </div>

      </section>


      {/* =========================================================
          FOOTER ACCENT
      ========================================================= */}

      <div className="border-t border-stone-800 bg-[#070706] px-5 py-7 text-center">

        <div className="flex items-center justify-center gap-3">

          <span className="h-px w-8 bg-[#c7a665]" />

          <p className="font-serif text-sm tracking-[0.18em] text-stone-300">
            MARUTI
          </p>

          <span className="h-px w-8 bg-[#c7a665]" />

        </div>

        <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.45em] text-[#c7a665]">
          Tiles · Premium Surfaces
        </p>

        <p className="mt-4 text-[10px] text-stone-600">
          © 2026 Maruti Tiles. All Rights Reserved.
        </p>

      </div>

    </main>
  );
}