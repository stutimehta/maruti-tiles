"use client";

import { FormEvent, useState } from "react";
import { createClient } from "../lib/supabase";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function AuthPage() {
  const supabase = createClient();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    if (mode === "signup") {
      if (!phone) {
        setMessage("Please enter your phone / WhatsApp number.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone,
          },
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        /*
         * Email confirmation is disabled in Supabase.
         * The customer can now sign in directly.
         */
        setMessage(
          "Account created successfully. You can now sign in."
        );

        setMode("signin");

        // Clear signup-only fields
        setName("");
        setPhone("");
        setPassword("");
      }
    } else {
      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        setMessage(error.message);
      } else {
        window.location.href = "/cart";
      }
    }

    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] px-5 py-12 text-stone-900">
      <div className="w-full max-w-md rounded-[2rem] border border-stone-200 bg-white p-7 shadow-sm sm:p-10">

        {/* BRAND */}
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#b08c4c]">
          Maruti Tiles
        </p>

        {/* TITLE */}
        <h1 className="mt-4 font-serif text-4xl tracking-tight">
          {mode === "signin"
            ? "Welcome back."
            : "Create your account."}
        </h1>

        {/* DESCRIPTION */}
        <p className="mt-3 text-sm leading-6 text-stone-500">
          {mode === "signin"
            ? "Sign in to continue to your cart and orders."
            : "Create an account before continuing to checkout."}
        </p>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4"
        >

          {/* FULL NAME + PHONE */}
          {mode === "signup" && (
            <>
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
                className="h-12 w-full rounded-full border border-stone-200 px-5 text-sm outline-none transition focus:border-stone-900"
              />

              <div className="rounded-full border border-stone-200 bg-white px-4 transition focus-within:border-stone-900">
                <PhoneInput
                  international
                  defaultCountry="IN"
                  value={phone}
                  onChange={(value) =>
                    setPhone(value || "")
                  }
                  placeholder="Phone / WhatsApp number"
                  required
                  className="phone-input"
                />
              </div>
            </>
          )}

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
            className="h-12 w-full rounded-full border border-stone-200 px-5 text-sm outline-none transition focus:border-stone-900"
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
            minLength={6}
            className="h-12 w-full rounded-full border border-stone-200 px-5 text-sm outline-none transition focus:border-stone-900"
          />

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="flex min-h-13 w-full items-center justify-center rounded-full bg-stone-950 px-6 font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : mode === "signin"
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>

        {/* MESSAGE */}
        {message && (
          <p className="mt-5 rounded-2xl bg-[#f7f5f0] px-4 py-3 text-sm leading-6 text-stone-600">
            {message}
          </p>
        )}

        {/* SWITCH SIGN IN / SIGN UP */}
        <div className="mt-7 border-t border-stone-100 pt-6 text-center">

          <p className="text-sm text-stone-500">
            {mode === "signin"
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>

          <button
            type="button"
            onClick={() => {
              setMode(
                mode === "signin"
                  ? "signup"
                  : "signin"
              );

              setMessage("");
              setPassword("");
            }}
            className="mt-2 text-sm font-semibold text-stone-950 underline underline-offset-4"
          >
            {mode === "signin"
              ? "Create an account"
              : "Sign in instead"}
          </button>

        </div>
      </div>
    </main>
  );
}