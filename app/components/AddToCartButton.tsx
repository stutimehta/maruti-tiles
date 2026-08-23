"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

type Props = Omit<CartItem, "quantity">;

export default function AddToCartButton({
  id,
  name,
  category,
  size,
  finish,
  image,
  pricePerSqFt,
}: Props) {
  const [packSize, setPackSize] = useState(100);
  const [repeatCount, setRepeatCount] = useState(1);
  const [added, setAdded] = useState(false);

  const quantity = packSize * repeatCount;
  const subtotal = pricePerSqFt * quantity;

  const quantityOptions = [20, 50, 100, 500];

  useEffect(() => {
    try {
      const existing = JSON.parse(
        localStorage.getItem("maruti-cart") || "[]"
      ) as CartItem[];

      const current = existing.find(
        (item) => item.id === id
      );

      if (current) {
        const closestOption = quantityOptions.reduce(
          (closest, option) =>
            Math.abs(option - current.quantity) <
            Math.abs(closest - current.quantity)
              ? option
              : closest
        );

        setPackSize(closestOption);

        setRepeatCount(
          Math.max(
            1,
            Math.round(current.quantity / closestOption)
          )
        );
      }
    } catch {
      setPackSize(100);
      setRepeatCount(1);
    }
  }, [id]);

  function selectPackSize(size: number) {
    setPackSize(size);
    setRepeatCount(1);
    setAdded(false);
  }

  function decreaseQuantity() {
    setRepeatCount((current) =>
      Math.max(1, current - 1)
    );

    setAdded(false);
  }

  function increaseQuantity() {
    setRepeatCount((current) =>
      current + 1
    );

    setAdded(false);
  }

  function addToCart() {
    try {
      const existing = JSON.parse(
        localStorage.getItem("maruti-cart") || "[]"
      ) as CartItem[];

      const existingIndex = existing.findIndex(
        (item) => item.id === id
      );

      const item: CartItem = {
        id,
        name,
        category,
        size,
        finish,
        image,
        pricePerSqFt,
        quantity,
      };

      if (existingIndex >= 0) {
        existing[existingIndex] = {
          ...existing[existingIndex],
          ...item,
          quantity:
            existing[existingIndex].quantity +
            quantity,
        };
      } else {
        existing.push(item);
      }

      localStorage.setItem(
        "maruti-cart",
        JSON.stringify(existing)
      );

      window.dispatchEvent(
        new Event("maruti-cart-updated")
      );

      setAdded(true);
    } catch {
      setAdded(false);
    }
  }

  return (
    <div className="mt-7 sm:mt-8">

      {/* =====================================================
          PRICE
      ===================================================== */}

      <div className="border-t border-stone-800 pt-5 sm:pt-6">

        <p className="text-[10px] uppercase tracking-[0.2em] text-[#a99573] sm:text-xs">
          Price per sq. ft.
        </p>

        <p className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          ₹
          {pricePerSqFt.toLocaleString("en-IN")}

          <span className="ml-2 text-sm font-medium text-stone-500">
            / sq. ft.
          </span>
        </p>

      </div>


      {/* =====================================================
          QUANTITY
      ===================================================== */}

      <div className="mt-6 rounded-3xl border border-stone-800 bg-[#151411] p-4 shadow-[0_18px_55px_rgba(0,0,0,0.3)] sm:p-5">

        <div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c8a867] sm:text-xs">
            Quantity
          </p>

          <p className="mt-1 text-xs text-stone-500">
            Select square feet
          </p>

        </div>


        {/* PRESET OPTIONS */}

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">

          {quantityOptions.map((option) => (

            <button
              key={option}
              type="button"
              onClick={() => selectPackSize(option)}
              className={`min-h-11 rounded-full border px-3 text-xs font-semibold transition active:scale-95 ${
                packSize === option
                  ? "border-[#d2b06c] bg-[#d2b06c] text-black shadow-[0_6px_20px_rgba(210,176,108,0.12)]"
                  : "border-stone-700 bg-[#0d0d0c] text-stone-200 hover:border-[#c8a867] hover:text-[#d8ba79]"
              }`}
            >
              {option} sq.ft.
            </button>

          ))}

        </div>


        {/* =====================================================
            REPEAT QUANTITY
        ===================================================== */}

        <div className="mt-4 flex items-center justify-between rounded-full border border-stone-700 bg-[#0b0b0a] p-1.5">

          {/* MINUS */}

          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={repeatCount <= 1}
            aria-label="Decrease quantity"
            className="touch-manipulation flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-2xl font-medium leading-none text-white transition hover:bg-stone-800 hover:text-[#d8ba79] disabled:cursor-not-allowed disabled:text-stone-700"
          >
            −
          </button>


          {/* QUANTITY TEXT */}

          <span className="min-w-0 flex-1 px-3 text-center text-sm font-semibold text-white sm:text-base">
            {repeatCount} × {packSize} sq.ft.
          </span>


          {/* PLUS */}

          <button
            type="button"
            onClick={increaseQuantity}
            aria-label="Increase quantity"
            className="touch-manipulation flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-2xl font-medium leading-none text-white transition hover:bg-stone-800 hover:text-[#d8ba79]"
          >
            +
          </button>

        </div>


        {/* =====================================================
            TOTAL QUANTITY
        ===================================================== */}

        <div className="mt-4 rounded-2xl border border-stone-800 bg-[#0d0d0c] px-4 py-4 text-center">

          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500">
            Total Quantity
          </p>

          <p className="mt-1 text-lg font-semibold text-white">
            {quantity} sq.ft.
          </p>

        </div>


        {/* =====================================================
            SUBTOTAL
        ===================================================== */}

        <div className="mt-5 flex items-end justify-between border-t border-stone-800 pt-4">

          <div>

            <p className="text-[10px] uppercase tracking-[0.2em] text-[#a99573]">
              Product subtotal
            </p>

            <p className="mt-1 text-sm text-stone-400">
              {quantity} × ₹
              {pricePerSqFt.toLocaleString("en-IN")}
            </p>

          </div>

          <p className="text-2xl font-semibold text-[#d8ba79]">
            ₹
            {subtotal.toLocaleString("en-IN")}
          </p>

        </div>

      </div>


      {/* =====================================================
          ADD TO CART
      ===================================================== */}

      {added ? (

        <div className="mt-4 grid gap-3 sm:grid-cols-2">

          <Link
            href="/cart"
            className="flex min-h-14 items-center justify-center rounded-full bg-[#d2b06c] px-7 text-center font-semibold text-black transition hover:bg-[#e0c489]"
          >
            View Cart

            <span className="ml-2">
              →
            </span>
          </Link>


          <button
            type="button"
            onClick={() => setAdded(false)}
            className="min-h-14 rounded-full border border-stone-700 bg-[#151411] px-6 font-semibold text-stone-200 transition hover:border-[#c8a867] hover:text-[#d8ba79]"
          >
            Continue Shopping
          </button>

        </div>

      ) : (

        <button
          type="button"
          onClick={addToCart}
          className="mt-4 flex min-h-14 w-full items-center justify-center rounded-full bg-[#d2b06c] px-7 text-center font-semibold text-black shadow-[0_15px_40px_rgba(210,176,108,0.12)] transition hover:-translate-y-0.5 hover:bg-[#e0c489] active:scale-[0.98]"
        >
          Add to Cart

          <span className="ml-3 text-lg">
            →
          </span>
        </button>

      )}


      {/* DELIVERY NOTE */}

      <p className="mt-4 text-center text-xs leading-6 text-stone-500 sm:text-sm">
        Delivery charges are calculated separately at checkout.
      </p>

    </div>
  );
}