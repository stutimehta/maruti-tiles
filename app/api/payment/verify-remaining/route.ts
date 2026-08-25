import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    const razorpayKeySecret =
      process.env.RAZORPAY_KEY_SECRET;

    if (
      !supabaseUrl ||
      !serviceRoleKey ||
      !razorpayKeySecret
    ) {
      return NextResponse.json(
        {
          error:
            "Server payment configuration is missing.",
        },
        { status: 500 }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    /*
     * AUTHENTICATION
     */

    const authorization =
      request.headers.get("authorization");

    if (!authorization) {
      return NextResponse.json(
        {
          error: "You must be signed in.",
        },
        { status: 401 }
      );
    }

    const token = authorization.replace(
      /^Bearer\s+/i,
      ""
    );

    if (!token) {
      return NextResponse.json(
        {
          error: "Invalid authentication token.",
        },
        { status: 401 }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        {
          error:
            "Your session is invalid or expired.",
        },
        { status: 401 }
      );
    }

    /*
     * READ REQUEST
     */

    const body = await request.json();

    const orderId =
      typeof body?.orderId === "string"
        ? body.orderId.trim()
        : "";

    const razorpayPaymentId =
      typeof body?.razorpayPaymentId === "string"
        ? body.razorpayPaymentId.trim()
        : "";

    const razorpayOrderId =
      typeof body?.razorpayOrderId === "string"
        ? body.razorpayOrderId.trim()
        : "";

    const razorpaySignature =
      typeof body?.razorpaySignature === "string"
        ? body.razorpaySignature.trim()
        : "";

    if (
      !orderId ||
      !razorpayPaymentId ||
      !razorpayOrderId ||
      !razorpaySignature
    ) {
      return NextResponse.json(
        {
          error:
            "Payment verification information is incomplete.",
        },
        { status: 400 }
      );
    }

    /*
     * LOAD ORDER
     */

    const {
      data: order,
      error: orderError,
    } = await supabase
      .from("orders")
      .select(
        `
          id,
          customer_id,
          status,
          total,
          amount_paid,
          remaining_amount,
          payment_status,
          payment_method,
          razorpay_order_id
        `
      )
      .eq("id", orderId)
      .eq("customer_id", user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        {
          error: "Order not found.",
        },
        { status: 404 }
      );
    }

    /*
     * ALREADY PAID
     */

    if (
      order.payment_status === "paid" ||
      Number(order.remaining_amount) <= 0
    ) {
      return NextResponse.json({
        success: true,
        alreadyPaid: true,
        message:
          "This order is already fully paid.",
      });
    }

    /*
     * PAYMENT MUST HAPPEN AT DELIVERY
     */

    if (order.status !== "Out for Delivery") {
      return NextResponse.json(
        {
          error:
            "Remaining payment can only be completed when the order is Out for Delivery.",
        },
        { status: 400 }
      );
    }

    /*
     * CHECK RAZORPAY ORDER
     */

    if (
      !order.razorpay_order_id ||
      order.razorpay_order_id !==
        razorpayOrderId
    ) {
      return NextResponse.json(
        {
          error:
            "Razorpay order does not match this order.",
        },
        { status: 400 }
      );
    }

    /*
     * VERIFY RAZORPAY SIGNATURE
     *
     * HMAC SHA256:
     *
     * razorpayOrderId + "|" + razorpayPaymentId
     */

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          razorpayKeySecret
        )
        .update(
          `${razorpayOrderId}|${razorpayPaymentId}`
        )
        .digest("hex");

    const generatedBuffer =
      Buffer.from(generatedSignature);

    const receivedBuffer =
      Buffer.from(razorpaySignature);

    if (
      generatedBuffer.length !==
      receivedBuffer.length
    ) {
      return NextResponse.json(
        {
          error:
            "Payment signature verification failed.",
        },
        { status: 400 }
      );
    }

    const signatureValid =
      crypto.timingSafeEqual(
        generatedBuffer,
        receivedBuffer
      );

    if (!signatureValid) {
      return NextResponse.json(
        {
          error:
            "Payment signature verification failed.",
        },
        { status: 400 }
      );
    }

    /*
     * CALCULATE FINAL TOTAL
     */

    const totalAmount =
      Number(order.total);

    if (
      !Number.isFinite(totalAmount) ||
      totalAmount <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid order total.",
        },
        { status: 400 }
      );
    }

    /*
     * PAYMENT DATE
     */

    const paidAt =
      new Date().toISOString();

    /*
     * UPDATE ORDER
     *
     * IMPORTANT:
     * The remaining payment was made ONLINE.
     */

    const {
      data: updatedOrder,
      error: updateError,
    } = await supabase
      .from("orders")
      .update({
        amount_paid: totalAmount,

        remaining_amount: 0,

        payment_status: "paid",

        payment_method: "online",

        razorpay_order_id:
          razorpayOrderId,

        razorpay_payment_id:
          razorpayPaymentId,

        paid_at: paidAt,
      })
      .eq("id", order.id)
      .eq("customer_id", user.id)
      .select(
        `
          id,
          total,
          amount_paid,
          remaining_amount,
          payment_method,
          payment_status,
          razorpay_order_id,
          razorpay_payment_id,
          paid_at
        `
      )
      .single();

    if (updateError || !updatedOrder) {
      console.error(
        "Remaining payment update error:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            "Payment was verified, but the order could not be updated.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,

      alreadyPaid: false,

      message:
        "Remaining online payment verified successfully.",

      order: updatedOrder,
    });
  } catch (error) {
    console.error(
      "Verify remaining payment error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to verify remaining payment.",
      },
      { status: 500 }
    );
  }
}