import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";

type CartItem = {
  id: number;
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
  cart: CartItem[];
};

function safeEqual(
  a: string,
  b: string
) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    aBuffer,
    bBuffer
  );
}

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      paymentMethod,
      checkout,
      accessToken,
    } = body as {
      razorpay_payment_id?: string;
      razorpay_order_id?: string;
      razorpay_signature?: string;
      paymentMethod?: "online" | "cod";
      checkout?: CheckoutData;
      accessToken?: string;
    };

    /*
     * --------------------------------------------------
     * 1. CHECK REQUIRED PAYMENT INFORMATION
     * --------------------------------------------------
     */

    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        {
          error:
            "Missing Razorpay payment information.",
        },
        { status: 400 }
      );
    }

    /*
     * --------------------------------------------------
     * 2. CHECK CUSTOMER SESSION
     * --------------------------------------------------
     */

    if (!accessToken) {
      return NextResponse.json(
        {
          error:
            "Customer session is missing.",
        },
        { status: 401 }
      );
    }

    if (!checkout) {
      return NextResponse.json(
        {
          error:
            "Checkout information is missing.",
        },
        { status: 400 }
      );
    }

    /*
     * --------------------------------------------------
     * 3. RAZORPAY SERVER CONFIGURATION
     * --------------------------------------------------
     */

    const razorpayKeyId =
      process.env.RAZORPAY_KEY_ID;

    const razorpayKeySecret =
      process.env.RAZORPAY_KEY_SECRET;

    if (
      !razorpayKeyId ||
      !razorpayKeySecret
    ) {
      console.error(
        "Razorpay server keys are missing."
      );

      return NextResponse.json(
        {
          error:
            "Payment gateway is not configured correctly.",
        },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    /*
     * --------------------------------------------------
     * 4. FETCH THE RAZORPAY ORDER FROM THE SERVER
     * --------------------------------------------------
     *
     * We use Razorpay's server-side order,
     * rather than trusting the browser amount.
     */

    const razorpayOrder =
      await razorpay.orders.fetch(
        razorpay_order_id
      );

    if (!razorpayOrder) {
      return NextResponse.json(
        {
          error:
            "Razorpay order could not be found.",
        },
        { status: 400 }
      );
    }

    /*
     * --------------------------------------------------
     * 5. CHECK RAZORPAY ORDER DETAILS
     * --------------------------------------------------
     */

    const orderNotes =
      razorpayOrder.notes || {};

    const serverPaymentMethod =
      String(
        orderNotes.payment_method || ""
      );

    const serverCustomerId =
      String(
        orderNotes.customer_id || ""
      );

    const serverProductTotal =
      Number(
        orderNotes.product_total
      );

    const serverAmountPaid =
      Number(
        orderNotes.amount_paid_now
      );

    const serverRemainingAmount =
      Number(
        orderNotes.remaining_amount
      );

    if (
      serverPaymentMethod !== "online" &&
      serverPaymentMethod !== "cod"
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid payment method on Razorpay order.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(
        serverProductTotal
      ) ||
      serverProductTotal <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid product total on Razorpay order.",
        },
        { status: 400 }
      );
    }

    /*
     * Confirm the browser's selected method
     * matches the method used to create
     * the Razorpay order.
     */

    if (
      paymentMethod !==
      serverPaymentMethod
    ) {
      return NextResponse.json(
        {
          error:
            "Payment method mismatch.",
        },
        { status: 400 }
      );
    }

    /*
     * Confirm this checkout belongs to the
     * same customer stored in the Razorpay order.
     */

    if (
      String(checkout.customer_id) !==
      serverCustomerId
    ) {
      return NextResponse.json(
        {
          error:
            "Customer information mismatch.",
        },
        { status: 400 }
      );
    }

    /*
     * --------------------------------------------------
     * 6. VERIFY PAYMENT SIGNATURE
     * --------------------------------------------------
     */

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          razorpayKeySecret
        )
        .update(
          `${razorpayOrder.id}|${razorpay_payment_id}`
        )
        .digest("hex");

    const signatureValid =
      safeEqual(
        generatedSignature,
        razorpay_signature
      );

    if (!signatureValid) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Payment verification failed.",
        },
        { status: 400 }
      );
    }

    /*
     * --------------------------------------------------
     * 7. FETCH THE PAYMENT FROM RAZORPAY
     * --------------------------------------------------
     */

    const razorpayPayment =
      await razorpay.payments.fetch(
        razorpay_payment_id
      );

    /*
     * Make sure the payment belongs to
     * the Razorpay order we created.
     */

    if (
      razorpayPayment.order_id !==
      razorpayOrder.id
    ) {
      return NextResponse.json(
        {
          error:
            "Payment does not belong to this order.",
        },
        { status: 400 }
      );
    }

    /*
     * Confirm the amount matches the order.
     */

    if (
      Number(razorpayPayment.amount) !==
      Number(razorpayOrder.amount)
    ) {
      return NextResponse.json(
        {
          error:
            "Payment amount mismatch.",
        },
        { status: 400 }
      );
    }

    /*
     * For normal automatic-capture payments,
     * the successful payment should be captured.
     */

    if (
      razorpayPayment.status !==
        "captured" &&
      razorpayPayment.status !==
        "authorized"
    ) {
      return NextResponse.json(
        {
          error:
            "Payment has not been successfully authorized or captured.",
        },
        { status: 400 }
      );
    }

    /*
     * --------------------------------------------------
     * 8. SUPABASE CONFIGURATION
     * --------------------------------------------------
     */

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabasePublishableKey =
      process.env
        .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (
      !supabaseUrl ||
      !supabasePublishableKey
    ) {
      console.error(
        "Supabase environment variables are missing."
      );

      return NextResponse.json(
        {
          error:
            "Supabase is not configured correctly.",
        },
        { status: 500 }
      );
    }

    const supabaseHeaders = {
      apikey:
        supabasePublishableKey,

      Authorization:
        `Bearer ${accessToken}`,

      "Content-Type":
        "application/json",

      Prefer:
        "return=representation",
    };

    /*
     * --------------------------------------------------
     * 9. CHECK WHETHER THIS PAYMENT ALREADY
     *    CREATED AN ORDER
     * --------------------------------------------------
     */

    const existingOrderResponse =
      await fetch(
        `${supabaseUrl}/rest/v1/orders?razorpay_order_id=eq.${encodeURIComponent(
          razorpayOrder.id
        )}&select=id,status,payment_status`,
        {
          method: "GET",
          headers: supabaseHeaders,
        }
      );

    if (!existingOrderResponse.ok) {
      const existingError =
        await existingOrderResponse.text();

      console.error(
        "Supabase existing-order check failed:",
        existingError
      );

      return NextResponse.json(
        {
          error:
            "Unable to check existing order.",
        },
        { status: 500 }
      );
    }

    const existingOrders =
      await existingOrderResponse.json();

    /*
     * If this payment was already processed,
     * return the existing order instead of
     * creating a duplicate.
     */

    if (
      Array.isArray(existingOrders) &&
      existingOrders.length > 0
    ) {
      return NextResponse.json({
        success: true,
        verified: true,
        alreadyProcessed: true,
        orderId:
          existingOrders[0].id,
        paymentId:
          razorpay_payment_id,
        razorpayOrderId:
          razorpayOrder.id,
      });
    }

    /*
     * --------------------------------------------------
     * 10. VALIDATE CART
     * --------------------------------------------------
     *
     * Importing the real product catalog here
     * would be better in a shared server module.
     *
     * For now, we validate the cart shape.
     */

    if (
      !Array.isArray(checkout.cart) ||
      checkout.cart.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Checkout cart is empty.",
        },
        { status: 400 }
      );
    }

    for (const item of checkout.cart) {
      if (
        !Number.isInteger(
          Number(item.id)
        ) ||
        !Number.isFinite(
          Number(item.quantity)
        ) ||
        Number(item.quantity) <= 0
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid cart item.",
          },
          { status: 400 }
        );
      }
    }

    /*
     * --------------------------------------------------
     * 11. DETERMINE PAYMENT STATUS
     * --------------------------------------------------
     */

    const paymentStatus =
      serverPaymentMethod === "online"
        ? "paid"
        : "partial";

    /*
     * --------------------------------------------------
     * 12. CREATE SUPABASE ORDER
     * --------------------------------------------------
     */

    const orderInsertResponse =
      await fetch(
        `${supabaseUrl}/rest/v1/orders`,
        {
          method: "POST",
          headers: supabaseHeaders,
          body: JSON.stringify({
            customer_id:
              checkout.customer_id,

            status: "Confirmed",

            full_name:
              checkout.full_name,

            email:
              checkout.email,

            phone:
              checkout.phone,

            address:
              checkout.address,

            city:
              checkout.city,

            state:
              checkout.state,

            postal_code:
              checkout.postal_code,

            country:
              checkout.country,

            subtotal:
              serverProductTotal,

            /*
             * Shipping is separate and paid
             * directly to the delivery person.
             */
            delivery_charge: 0,

            total:
              serverProductTotal,

            payment_method:
              serverPaymentMethod,

            payment_status:
              paymentStatus,

            amount_paid:
              serverAmountPaid,

            remaining_amount:
              serverRemainingAmount,

            razorpay_order_id:
              razorpayOrder.id,

            razorpay_payment_id:
              razorpay_payment_id,

            paid_at:
              new Date().toISOString(),
          }),
        }
      );

    if (!orderInsertResponse.ok) {
      const orderError =
        await orderInsertResponse.text();

      console.error(
        "Supabase order creation failed:",
        orderError
      );

      return NextResponse.json(
        {
          error:
            "Payment verified, but the order could not be created. Please contact support before retrying payment.",
        },
        { status: 500 }
      );
    }

    const createdOrders =
      await orderInsertResponse.json();

    const createdOrder =
      createdOrders?.[0];

    if (!createdOrder?.id) {
      return NextResponse.json(
        {
          error:
            "Payment verified, but no order ID was returned.",
        },
        { status: 500 }
      );
    }

    /*
     * --------------------------------------------------
     * 13. CREATE ORDER ITEMS
     * --------------------------------------------------
     *
     * We store the product information that
     * the customer purchased.
     */

    const orderItems =
      checkout.cart.map((item) => ({
        order_id:
          createdOrder.id,

        product_id:
          Number(item.id),

        /*
         * These fields come from checkout data
         * created by your product/cart system.
         */
        product_name:
          String(
            (item as CartItem & {
              name?: string;
            }).name || ""
          ),

        category:
          String(
            (item as CartItem & {
              category?: string;
            }).category || ""
          ),

        size:
          String(
            (item as CartItem & {
              size?: string;
            }).size || ""
          ),

        finish:
          String(
            (item as CartItem & {
              finish?: string;
            }).finish || ""
          ),

        image:
          String(
            (item as CartItem & {
              image?: string;
            }).image || ""
          ),

        price_per_sq_ft:
          Number(
            (item as CartItem & {
              pricePerSqFt?: number;
            }).pricePerSqFt || 0
          ),

        quantity:
          Number(item.quantity),

        subtotal:
          Number(
            (item as CartItem & {
              pricePerSqFt?: number;
            }).pricePerSqFt || 0
          ) *
          Number(item.quantity),
      }));

    const itemsResponse =
      await fetch(
        `${supabaseUrl}/rest/v1/order_items`,
        {
          method: "POST",
          headers: supabaseHeaders,
          body: JSON.stringify(
            orderItems
          ),
        }
      );

    if (!itemsResponse.ok) {
      const itemsError =
        await itemsResponse.text();

      console.error(
        "Supabase order-items creation failed:",
        itemsError
      );

      /*
       * Remove the order if its items could
       * not be created.
       */
      await fetch(
        `${supabaseUrl}/rest/v1/orders?id=eq.${encodeURIComponent(
          createdOrder.id
        )}`,
        {
          method: "DELETE",
          headers: supabaseHeaders,
        }
      );

      return NextResponse.json(
        {
          error:
            "Payment was verified, but the order items could not be saved.",
        },
        { status: 500 }
      );
    }

    /*
     * --------------------------------------------------
     * 14. SUCCESS
     * --------------------------------------------------
     */

    return NextResponse.json({
      success: true,

      verified: true,

      orderCreated: true,

      orderId:
        createdOrder.id,

      paymentId:
        razorpay_payment_id,

      razorpayOrderId:
        razorpayOrder.id,

      paymentMethod:
        serverPaymentMethod,

      amountPaid:
        serverAmountPaid,

      remainingAmount:
        serverRemainingAmount,

      paymentStatus,
    });
  } catch (error) {
    console.error(
      "Razorpay verification/order creation error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to verify payment and create order.",
      },
      { status: 500 }
    );
  }
}