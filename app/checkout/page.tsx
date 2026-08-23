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
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0]">
        <p className="text-sm text-stone-500">
          Loading checkout...
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
            href="/cart"
            className="rounded-full border border-stone-300 px-5 py-2.5 text-xs font-semibold transition hover:bg-stone-950 hover:text-white"
          >
            Back to Cart
          </Link>

        </div>

      </header>


      {/* CONTENT */}

      <section className="px-5 py-12 sm:px-6 md:py-20">

        <div className="mx-auto max-w-7xl">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#b38d48]">
              Secure checkout
            </p>

            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-stone-950 sm:text-6xl">
              Checkout
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-stone-500">
              Enter your delivery details to place your
              Maruti Tiles order.
            </p>

          </div>


          <form
            onSubmit={continueToPayment}
            className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px]"
          >

            {/* SHIPPING DETAILS */}

            <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">

              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
                Shipping Details
              </p>


              <div className="mt-7 grid gap-4 sm:grid-cols-2">

                {/* NAME */}

                <div className="sm:col-span-2">

                  <label className="text-xs font-semibold">
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
                    className="mt-2 h-13 w-full rounded-full border border-stone-200 px-5 text-sm outline-none focus:border-stone-900"
                  />

                </div>


                {/* EMAIL */}

                <div>

                  <label className="text-xs font-semibold">
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
                    className="mt-2 h-13 w-full rounded-full border border-stone-200 px-5 text-sm outline-none focus:border-stone-900"
                  />

                </div>


                {/* PHONE */}

                <div>

                  <label className="text-xs font-semibold">
                    Phone / WhatsApp
                  </label>

                  <div className="mt-2 rounded-full border border-stone-200 bg-white px-4 focus-within:border-stone-900">

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

                  <label className="text-xs font-semibold">
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
                    className="mt-2 w-full resize-none rounded-3xl border border-stone-200 px-5 py-4 text-sm outline-none focus:border-stone-900"
                  />

                </div>


                {/* CITY */}

                <div>

                  <label className="text-xs font-semibold">
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
                    className="mt-2 h-13 w-full rounded-full border border-stone-200 bg-white px-5 text-sm outline-none focus:border-stone-900 disabled:bg-stone-100 disabled:text-stone-400"
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

                  <label className="text-xs font-semibold">
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
                    className="mt-2 h-13 w-full rounded-full border border-stone-200 bg-white px-5 text-sm outline-none focus:border-stone-900 disabled:bg-stone-100 disabled:text-stone-400"
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

                  <label className="text-xs font-semibold">
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
                    className="mt-2 h-13 w-full rounded-full border border-stone-200 px-5 text-sm outline-none focus:border-stone-900"
                  />

                </div>


                {/* COUNTRY */}

                <div>

                  <label className="text-xs font-semibold">
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
                    className="mt-2 h-13 w-full rounded-full border border-stone-200 bg-white px-5 text-sm outline-none focus:border-stone-900"
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


            {/* ORDER SUMMARY */}

            <aside className="h-fit rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-7">

              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
                Order Summary
              </p>


              <div className="mt-6 space-y-4">

                {cart.map((item) => (

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


              {/* TOTAL */}

              <div className="mt-6 space-y-4 border-t border-stone-200 pt-5">

                <div className="flex justify-between text-sm">

                  <span className="text-stone-500">
                    Product Total
                  </span>

                  <span className="font-semibold">
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

              </div>


              {/* SHIPPING MESSAGE */}

              <div className="mt-6 rounded-2xl bg-[#f6f3ed] p-4">

                <p className="text-xs font-semibold">
                  Shipping charges
                </p>

                <p className="mt-1 text-xs leading-5 text-stone-500">
                  Shipping is separate from the
                  product amount. It will be
                  calculated according to your
                  location and paid directly to
                  the delivery person.
                </p>

              </div>


              {/* PAYMENT MESSAGE */}

              <div className="mt-4 rounded-2xl border border-stone-200 p-4">

                <p className="text-xs font-semibold">
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

                <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                  {message}
                </div>

              )}


              {/* CONTINUE */}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 flex min-h-14 w-full items-center justify-center rounded-full bg-stone-950 px-6 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading
                  ? "Processing..."
                  : "Continue to Payment"}

                {!loading && (
                  <span className="ml-2">
                    →
                  </span>
                )}

              </button>

            </aside>

          </form>

        </div>

      </section>

    </main>
  );
}