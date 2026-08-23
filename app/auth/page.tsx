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
        setMessage(
          "Account created. Please check your email to confirm your account."
        );
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090908] px-5 py-12 text-stone-100">

      {/* =====================================================
          PREMIUM BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Warm golden glow */}
        <div className="absolute -left-[10%] top-[10%] h-[500px] w-[500px] rounded-full bg-[#c7a665]/10 blur-[150px]" />

        <div className="absolute -right-[10%] bottom-[5%] h-[550px] w-[550px] rounded-full bg-[#d2b06c]/[0.08] blur-[160px]" />

        {/* Architectural slabs */}

        <div className="absolute left-[8%] top-[12%] h-[75%] w-[28%] rotate-[8deg] rounded-[3rem] border border-[#d2b06c]/10 bg-[linear-gradient(145deg,rgba(210,176,108,0.05),rgba(255,255,255,0.015),rgba(0,0,0,0.2))]" />

        <div className="absolute right-[8%] top-[8%] h-[82%] w-[30%] -rotate-[7deg] rounded-[3rem] border border-white/[0.06] bg-[linear-gradient(145deg,rgba(255,255,255,0.045),rgba(210,176,108,0.025),rgba(0,0,0,0.2))]" />

        {/* Fine architectural lines */}

        <div className="absolute left-0 top-[22%] h-px w-[45%] rotate-[8deg] bg-gradient-to-r from-transparent via-[#d2b06c]/25 to-transparent" />

        <div className="absolute right-0 top-[68%] h-px w-[45%] -rotate-[8deg] bg-gradient-to-r from-transparent via-[#d2b06c]/20 to-transparent" />

        {/* Corner frame */}

        <div className="absolute left-7 top-7 h-px w-24 bg-[#d2b06c]/70" />

        <div className="absolute left-7 top-7 h-20 w-px bg-[#d2b06c]/70" />

        <div className="absolute bottom-7 right-7 h-px w-24 bg-[#d2b06c]/70" />

        <div className="absolute bottom-7 right-7 h-20 w-px bg-[#d2b06c]/70" />

      </div>


      {/* =====================================================
          LOGIN CARD
      ===================================================== */}

      <div className="relative z-10 w-full max-w-md">

        <div className="rounded-[2rem] border border-stone-800 bg-[#11110f]/95 p-7 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">

          {/* BRAND */}

          <div className="flex items-center gap-3">

            <div>
              <p className="font-serif text-2xl tracking-[0.12em] text-stone-100 sm:text-[27px]">
                MARUTI
              </p>

              <div className="mt-1 flex items-center gap-2">

                <span className="h-px w-5 bg-[#d2b06c]" />

                <p className="text-[8px] font-semibold uppercase tracking-[0.48em] text-[#d2b06c]">
                  TILES
                </p>

              </div>
            </div>

          </div>


          {/* HEADING */}

          <h1 className="mt-8 font-serif text-4xl tracking-tight text-stone-100 sm:text-5xl">

            {mode === "signin"
              ? "Welcome back."
              : "Create your account."}

          </h1>

          <p className="mt-3 text-sm leading-6 text-stone-400">

            {mode === "signin"
              ? "Sign in to continue to your cart and orders."
              : "Create an account before continuing to checkout."}

          </p>


          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-4"
          >

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
                  className="h-12 w-full rounded-full border border-stone-700 bg-[#171714] px-5 text-sm text-white outline-none placeholder:text-stone-600 transition focus:border-[#d2b06c] focus:bg-[#1b1a16]"
                />


                <div className="rounded-full border border-stone-700 bg-[#171714] px-4 transition focus-within:border-[#d2b06c]">

                  <PhoneInput
                    international
                    defaultCountry="IN"
                    value={phone}
                    onChange={(value) =>
                      setPhone(value || "")
                    }
                    placeholder="Phone / WhatsApp number"
                    required
                    className="phone-input premium-phone-input"
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
              className="h-12 w-full rounded-full border border-stone-700 bg-[#171714] px-5 text-sm text-white outline-none placeholder:text-stone-600 transition focus:border-[#d2b06c] focus:bg-[#1b1a16]"
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
              className="h-12 w-full rounded-full border border-stone-700 bg-[#171714] px-5 text-sm text-white outline-none placeholder:text-stone-600 transition focus:border-[#d2b06c] focus:bg-[#1b1a16]"
            />


            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="flex min-h-13 w-full items-center justify-center rounded-full bg-[#d2b06c] px-6 font-semibold text-[#0b0b0a] shadow-[0_15px_40px_rgba(210,176,108,0.12)] transition hover:-translate-y-0.5 hover:bg-[#e0c489] disabled:cursor-not-allowed disabled:opacity-60"
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

            <p className="mt-5 rounded-2xl border border-[#c8a867]/20 bg-[#171612] px-4 py-3 text-sm leading-6 text-stone-300">
              {message}
            </p>

          )}


          {/* SWITCH SIGN IN / SIGN UP */}

          <div className="mt-7 border-t border-stone-800 pt-6 text-center">

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
              }}
              className="mt-2 text-sm font-semibold text-[#d2b06c] underline underline-offset-4 transition hover:text-[#e0c489]"
            >
              {mode === "signin"
                ? "Create an account"
                : "Sign in instead"}
            </button>

          </div>

        </div>


        {/* BOTTOM BRAND DETAIL */}

        <div className="mt-6 text-center">

          <p className="text-[8px] font-semibold uppercase tracking-[0.45em] text-stone-700">
            Architectural Collections · Surat · Gujarat
          </p>

        </div>

      </div>


      {/* =====================================================
          PHONE INPUT THEME
      ===================================================== */}

      <style jsx global>{`
        .premium-phone-input {
          height: 48px;
          display: flex;
          align-items: center;
          color: #f5f5f4;
        }

        .premium-phone-input .PhoneInputCountry {
          color: #d2b06c;
          margin-right: 8px;
        }

        .premium-phone-input .PhoneInputCountrySelect {
          background: #171714;
          color: #f5f5f4;
        }

        .premium-phone-input .PhoneInputInput {
          width: 100%;
          height: 48px;
          border: 0;
          outline: none;
          background: transparent;
          color: #f5f5f4;
          font-size: 14px;
        }

        .premium-phone-input .PhoneInputInput::placeholder {
          color: #57534e;
        }

        .premium-phone-input .PhoneInputInput:focus {
          outline: none;
        }
      `}</style>

    </main>
  );
}