import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    const razorpayKeyId =
      process.env.RAZORPAY_KEY_ID;

    const razorpayKeySecret =
      process.env.RAZORPAY_KEY_SECRET;

    if (
      !supabaseUrl ||
      !serviceRoleKey ||
      !razorpayKeyId ||
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

    const body = await request.json();

    const orderId =
      typeof body?.orderId === "string"
        ? body.orderId.trim()
        : "";

    if (!orderId) {
      return NextResponse.json(
        {
          error: "Order ID is required.",
        },
        { status: 400 }
      );
    }

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
          full_name,
          email,
          phone
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

    if (
      order.status !== "Out for Delivery"
    ) {
      return NextResponse.json(
        {
          error:
            "Remaining payment is available only when the order is Out for Delivery.",
        },
        { status: 400 }
      );
    }

    const remainingAmount = Number(
      order.remaining_amount
    );

    if (
      !Number.isFinite(remainingAmount) ||
      remainingAmount <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "This order has no remaining balance.",
        },
        { status: 400 }
      );
    }

    if (order.payment_status === "paid") {
      return NextResponse.json(
        {
          error:
            "This order is already fully paid.",
        },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    const amountInPaise = Math.round(
      remainingAmount * 100
    );

    const receipt =
      `MT-R-${Date.now()}`.slice(0, 40);

    const razorpayOrder =
      await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt,
        partial_payment: false,
        notes: {
          order_id: order.id,
          payment_type: "remaining",
          customer_id: user.id,
          remaining_amount:
            String(remainingAmount),
        },
      });

    const { error: updateError } =
      await supabase
        .from("orders")
        .update({
          razorpay_order_id:
            razorpayOrder.id,
        })
        .eq("id", order.id)
        .eq("customer_id", user.id);

    if (updateError) {
      console.error(
        "Failed to store Razorpay order ID:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            "Unable to prepare payment.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: razorpayKeyId,
      customerName:
        order.full_name || "",
      customerEmail:
        order.email || "",
      customerPhone:
        order.phone || "",
      amountToPay: remainingAmount,
    });
  } catch (error) {
    console.error(
      "Create remaining payment error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create remaining payment.",
      },
      { status: 500 }
    );
  }
}