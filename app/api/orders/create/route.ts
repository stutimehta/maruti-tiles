import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

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

export async function POST(request: Request) {
  try {
    // =====================================================
    // SERVER CONFIGURATION
    // =====================================================

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

    // =====================================================
    // SUPABASE SERVER CLIENT
    // =====================================================

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

    // =====================================================
    // AUTHENTICATION
    // =====================================================

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

    // =====================================================
    // READ REQUEST
    // =====================================================

    const body = await request.json();

    const checkout = body?.checkout;

    const paymentMethod =
      body?.paymentMethod;

    if (!checkout) {
      return NextResponse.json(
        {
          error:
            "Checkout information is required.",
        },
        { status: 400 }
      );
    }

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

    // =====================================================
    // IMPORTANT:
    // NEVER TRUST customer_id FROM THE BROWSER
    //
    // We use the authenticated user's ID.
    // =====================================================

    const customerId = user.id;

    // =====================================================
    // CUSTOMER INFORMATION
    // =====================================================

    const fullName =
      typeof checkout.full_name === "string"
        ? checkout.full_name.trim()
        : "";

    const email =
      typeof checkout.email === "string"
        ? checkout.email.trim()
        : "";

    const phone =
      typeof checkout.phone === "string"
        ? checkout.phone.trim()
        : "";

    const address =
      typeof checkout.address === "string"
        ? checkout.address.trim()
        : "";

    const city =
      typeof checkout.city === "string"
        ? checkout.city.trim()
        : "";

    const state =
      typeof checkout.state === "string"
        ? checkout.state.trim()
        : "";

    const postalCode =
      typeof checkout.postal_code === "string"
        ? checkout.postal_code.trim()
        : "";

    const country =
      typeof checkout.country === "string"
        ? checkout.country.trim()
        : "India";

    // =====================================================
    // VALIDATE CUSTOMER INFORMATION
    // =====================================================

    if (
      !fullName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !postalCode ||
      !country
    ) {
      return NextResponse.json(
        {
          error:
            "Complete delivery information is required.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // CART
    // =====================================================

    const cart = Array.isArray(checkout.cart)
      ? (checkout.cart as CartItem[])
      : [];

    if (cart.length === 0) {
      return NextResponse.json(
        {
          error: "Your cart is empty.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // VALIDATE CART
    // =====================================================

    const cleanCart: CartItem[] = [];

    for (const item of cart) {
      const productId = Number(item?.id);
      const quantity = Number(item?.quantity);

      if (
        !Number.isInteger(productId) ||
        productId <= 0
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid product in your cart.",
          },
          { status: 400 }
        );
      }

      if (
        !Number.isFinite(quantity) ||
        quantity <= 0
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid product quantity.",
          },
          { status: 400 }
        );
      }

      cleanCart.push({
        id: productId,

        name:
          typeof item.name === "string"
            ? item.name
            : "",

        category:
          typeof item.category === "string"
            ? item.category
            : "",

        size:
          typeof item.size === "string"
            ? item.size
            : "",

        finish:
          typeof item.finish === "string"
            ? item.finish
            : "",

        image:
          typeof item.image === "string"
            ? item.image
            : "",

        pricePerSqFt: Number(
          item.pricePerSqFt
        ),

        quantity,
      });
    }

    // =====================================================
    // CHECK INVENTORY
    // =====================================================

    for (const item of cleanCart) {
      const {
        data: inventory,
        error: inventoryError,
      } = await supabase
        .from("product_inventory")
        .select("product_id, stock")
        .eq("product_id", item.id)
        .single();

      if (inventoryError || !inventory) {
        return NextResponse.json(
          {
            error:
              `Product ${item.id} is not available in inventory.`,
          },
          { status: 400 }
        );
      }

      const availableStock =
        Number(inventory.stock);

      if (
        !Number.isFinite(availableStock) ||
        availableStock < item.quantity
      ) {
        return NextResponse.json(
          {
            error:
              `${item.name || `Product ${item.id}`} does not have enough stock. ` +
              `Available: ${availableStock}, requested: ${item.quantity}.`,
          },
          { status: 409 }
        );
      }
    }

    // =====================================================
    // CALCULATE TOTAL
    // =====================================================

    let subtotal = 0;

    for (const item of cleanCart) {
      if (
        !Number.isFinite(item.pricePerSqFt) ||
        item.pricePerSqFt <= 0
      ) {
        return NextResponse.json(
          {
            error:
              `Invalid price for ${item.name || `product ${item.id}`}.`,
          },
          { status: 400 }
        );
      }

      subtotal +=
        item.pricePerSqFt *
        item.quantity;
    }

    subtotal =
      Math.round(subtotal * 100) / 100;

    if (
      !Number.isFinite(subtotal) ||
      subtotal <= 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid order total.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // SHIPPING
    //
    // Your current system does not include shipping
    // in the order total.
    // =====================================================

    const deliveryCharge = 0;

    const total =
      Math.round(
        (subtotal + deliveryCharge) * 100
      ) / 100;

    // =====================================================
    // PAYMENT INFORMATION
    //
    // ONLINE = full payment
    // COD    = 20% advance + 80% remaining
    // =====================================================

    const amountPaid =
      paymentMethod === "online"
        ? total
        : Math.round(
            total * 0.2 * 100
          ) / 100;

    const remainingAmount =
      paymentMethod === "online"
        ? 0
        : Math.round(
            total * 0.8 * 100
          ) / 100;

    const paymentStatus =
      paymentMethod === "online"
        ? "paid"
        : "partial";

    // =====================================================
    // CREATE ORDER
    // =====================================================

    const {
      data: order,
      error: orderError,
    } = await supabase
      .from("orders")
      .insert({
        customer_id: customerId,

        status: "Pending",

        full_name: fullName,
        email,
        phone,

        address,
        city,
        state,
        postal_code: postalCode,
        country,

        subtotal,
        delivery_charge: deliveryCharge,
        total,

        amount_paid: amountPaid,
        remaining_amount: remainingAmount,

        payment_method: paymentMethod,
        payment_status: paymentStatus,
      })
      .select(
        `
          id,
          customer_id,
          status,
          full_name,
          email,
          phone,
          address,
          city,
          state,
          postal_code,
          country,
          subtotal,
          delivery_charge,
          total,
          amount_paid,
          remaining_amount,
          payment_method,
          payment_status,
          created_at
        `
      )
      .single();

    if (orderError || !order) {
      console.error(
        "Create order error:",
        orderError
      );

      return NextResponse.json(
        {
          error:
            orderError?.message ||
            "Unable to create order.",
        },
        { status: 500 }
      );
    }

    // =====================================================
    // CREATE ORDER ITEMS
    // =====================================================

    const orderItems = cleanCart.map(
      (item) => ({
        order_id: order.id,

        product_id: item.id,

        product_name: item.name,

        category: item.category,

        size: item.size,

        finish: item.finish,

        image: item.image,

        price_per_sq_ft:
          item.pricePerSqFt,

        quantity: item.quantity,

        subtotal:
          Math.round(
            item.pricePerSqFt *
              item.quantity *
              100
          ) / 100,
      })
    );

    const {
      error: orderItemsError,
    } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (orderItemsError) {
      console.error(
        "Create order items error:",
        orderItemsError
      );

      // Remove the order if order items failed.
      await supabase
        .from("orders")
        .delete()
        .eq("id", order.id);

      return NextResponse.json(
        {
          error:
            "Order items could not be created.",
        },
        { status: 500 }
      );
    }

    // =====================================================
    // REDUCE INVENTORY
    // =====================================================

    for (const item of cleanCart) {
      const {
        data: inventory,
        error: inventoryError,
      } = await supabase
        .from("product_inventory")
        .select("stock")
        .eq("product_id", item.id)
        .single();

      if (inventoryError || !inventory) {
        console.error(
          "Inventory read error:",
          inventoryError
        );

        // Delete created order items.
        await supabase
          .from("order_items")
          .delete()
          .eq("order_id", order.id);

        // Delete created order.
        await supabase
          .from("orders")
          .delete()
          .eq("id", order.id);

        return NextResponse.json(
          {
            error:
              "Inventory could not be updated.",
          },
          { status: 500 }
        );
      }

      const currentStock =
        Number(inventory.stock);

      const newStock =
        currentStock - item.quantity;

      if (newStock < 0) {
        console.error(
          "Inventory became negative.",
          {
            productId: item.id,
            currentStock,
            requested: item.quantity,
          }
        );

        await supabase
          .from("order_items")
          .delete()
          .eq("order_id", order.id);

        await supabase
          .from("orders")
          .delete()
          .eq("id", order.id);

        return NextResponse.json(
          {
            error:
              "Not enough stock available.",
          },
          { status: 409 }
        );
      }

      const {
        error: inventoryUpdateError,
      } = await supabase
        .from("product_inventory")
        .update({
          stock: newStock,
          updated_at:
            new Date().toISOString(),
        })
        .eq("product_id", item.id);

      if (inventoryUpdateError) {
        console.error(
          "Inventory update error:",
          inventoryUpdateError
        );

        await supabase
          .from("order_items")
          .delete()
          .eq("order_id", order.id);

        await supabase
          .from("orders")
          .delete()
          .eq("id", order.id);

        return NextResponse.json(
          {
            error:
              "Product stock could not be updated.",
          },
          { status: 500 }
        );
      }
    }

    // =====================================================
    // SUCCESS
    // =====================================================

    return NextResponse.json(
      {
        success: true,

        message:
          "Order created successfully.",

        order: {
          id: order.id,
          status: order.status,

          subtotal: order.subtotal,
          total: order.total,

          amountPaid:
            order.amount_paid,

          remainingAmount:
            order.remaining_amount,

          paymentMethod:
            order.payment_method,

          paymentStatus:
            order.payment_status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create order API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create order.",
      },
      { status: 500 }
    );
  }
}