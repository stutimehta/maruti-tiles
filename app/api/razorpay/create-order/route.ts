import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { products } from "../../../data/products";

export const runtime = "nodejs";
type CheckoutCartItem = {
  id: number;
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error(
        "Razorpay environment variables are missing."
      );

      return NextResponse.json(
        {
          error:
            "Razorpay is not configured on the server.",
        },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const body = await request.json();

    const paymentMethod = body?.paymentMethod;
    const checkout = body?.checkout;

    /*
     * Only these two payment methods
     * are allowed.
     */
    if (
      paymentMethod !== "online" &&
      paymentMethod !== "cod"
    ) {
      return NextResponse.json(
        {
          error: "Invalid payment method.",
        },
        { status: 400 }
      );
    }

    if (!checkout) {
      return NextResponse.json(
        {
          error:
            "Checkout information is required.",
        },
        { status: 400 }
      );
    }

    /*
     * We do NOT trust checkout.subtotal
     * from the browser.
     *
     * We calculate the product total again
     * using our real product catalog.
     */
    const cart = Array.isArray(checkout.cart)
      ? (checkout.cart as CheckoutCartItem[])
      : [];

    if (cart.length === 0) {
      return NextResponse.json(
        {
          error: "Your cart is empty.",
        },
        { status: 400 }
      );
    }

    let productTotal = 0;

    for (const cartItem of cart) {
      const productId = Number(cartItem?.id);
      const quantity = Number(
        cartItem?.quantity
      );

      if (
        !Number.isInteger(productId) ||
        !Number.isFinite(quantity) ||
        quantity <= 0
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid cart item or quantity.",
          },
          { status: 400 }
        );
      }

      const product = products.find(
        (item) => item.id === productId
      );

      if (!product) {
        return NextResponse.json(
          {
            error:
              "One of the products in your cart could not be found.",
          },
          { status: 400 }
        );
      }

      productTotal +=
        product.pricePerSqFt * quantity;
    }

    /*
     * Round the server-calculated total
     * to two decimal places.
     */
    productTotal =
      Math.round(productTotal * 100) / 100;

    if (
      !Number.isFinite(productTotal) ||
      productTotal <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid product total.",
        },
        { status: 400 }
      );
    }

    /*
     * ONLINE:
     * 100% of product total
     *
     * COD:
     * 20% advance
     *
     * Shipping is NOT included.
     */
    const amount =
      paymentMethod === "online"
        ? productTotal
        : Math.round(
            productTotal * 0.2 * 100
          ) / 100;

    const remainingAmount =
      paymentMethod === "cod"
        ? Math.round(
            productTotal * 0.8 * 100
          ) / 100
        : 0;

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid payment amount.",
        },
        { status: 400 }
      );
    }

    /*
     * Razorpay uses the smallest currency
     * unit.
     *
     * INR:
     * ₹1 = 100 paise
     */
    const amountInPaise = Math.round(
      amount * 100
    );

    /*
     * Create one fresh Razorpay order
     * for every payment attempt.
     */
    const order =
      await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",

        /*
         * Razorpay receipt must be unique.
         * Maximum length is 40 characters.
         */
        receipt: `MT-${Date.now()}`,

        /*
         * Partial payment is NOT enabled here.
         *
         * For COD, we create a Razorpay order
         * whose total amount is only the 20%
         * advance amount.
         */
        partial_payment: false,

        notes: {
          customer_id: String(
            checkout.customer_id || ""
          ),

          payment_method: paymentMethod,

          product_total: String(
            productTotal
          ),

          amount_paid_now: String(
            amount
          ),

          remaining_amount: String(
            remainingAmount
          ),
        },
      });

    return NextResponse.json({
      success: true,

      orderId: order.id,

      amount: order.amount,

      currency: order.currency,

      keyId,

      productTotal,

      amountToPay: amount,

      remainingAmount,
    });
  } catch (error: unknown) {
    console.error(
      "Razorpay create-order error:",
      error
    );

    const razorpayError = error as {
      error?: {
        description?: string;
        code?: string;
      };
      message?: string;
    };

    return NextResponse.json(
      {
        error:
          razorpayError?.error?.description ||
          razorpayError?.message ||
          "Unable to create Razorpay order.",
      },
      { status: 500 }
    );
  }
}