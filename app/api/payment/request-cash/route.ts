import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          error:
            "Supabase server configuration is missing.",
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
          error:
            "Invalid authentication token.",
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
            "Your session is invalid or expired. Please sign in again.",
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
          total,
          amount_paid,
          remaining_amount,
          payment_status,
          status
        `
      )
      .eq("id", orderId)
      .eq("customer_id", user.id)
      .single();

    if (orderError || !order) {
      console.error(
        "Cash request order error:",
        orderError
      );

      return NextResponse.json(
        {
          error: "Order not found.",
        },
        { status: 404 }
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

    const {
      data: existingRequest,
      error: existingError,
    } = await supabase
      .from("cash_payment_requests")
      .select(
        `
          id,
          status,
          amount
        `
      )
      .eq("order_id", order.id)
      .eq("customer_id", user.id)
      .eq("status", "requested")
      .maybeSingle();

    if (existingError) {
      console.error(
        "Existing cash request error:",
        existingError
      );

      return NextResponse.json(
        {
          error:
            "Unable to check the existing cash request.",
        },
        { status: 500 }
      );
    }

    if (existingRequest) {
      return NextResponse.json({
        success: true,
        alreadyRequested: true,
        requestId: existingRequest.id,
        amount: Number(
          existingRequest.amount
        ),
        message:
          "A cash payment request already exists for this order.",
      });
    }

    const {
      data: cashRequest,
      error: insertError,
    } = await supabase
      .from("cash_payment_requests")
      .insert({
        order_id: order.id,
        customer_id: user.id,
        amount: remainingAmount,
        status: "requested",
      })
      .select(
        `
          id,
          order_id,
          customer_id,
          amount,
          status,
          requested_at
        `
      )
      .single();

    if (insertError || !cashRequest) {
      console.error(
        "Cash request insert error:",
        insertError
      );

      return NextResponse.json(
        {
          error:
            "Unable to create cash payment request.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      alreadyRequested: false,
      requestId: cashRequest.id,
      orderId: cashRequest.order_id,
      amount: Number(
        cashRequest.amount
      ),
      status: cashRequest.status,
      message:
        "Cash payment request created successfully.",
    });
  } catch (error) {
    console.error(
      "Request cash payment error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to request cash payment.",
      },
      { status: 500 }
    );
  }
}