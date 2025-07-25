import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { cartItems, customer } = await req.json();

    if (!cartItems || !customer) {
      return new NextResponse("Not enough data to checkout", { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
      shipping_options: [
        { shipping_rate: "shr_1R0LtcA3YSWhSohz9eJPjAOE" },
        // { shipping_rate: "shr_1R0LyAA3YSWhSohz5iiBvwIt" },
      ],
      line_items: cartItems.map((cartItem: any) => ({
        price_data: {
          currency: "cad",
          product_data: {
            name: cartItem.item.title,
            metadata: {
              productId: cartItem.item._id,
              ...(cartItem.size && { size: cartItem.size }),
              ...(cartItem.color && { color: cartItem.color }),
            },
          },
          unit_amount: cartItem.item.price * 100,
        },
        quantity: cartItem.quantity,
      })),
      client_reference_id: customer.clerkId,
      success_url: `${process.env.ECOMMERCE_STORE_URL}/payment_success`,
      cancel_url: `${process.env.ECOMMERCE_STORE_URL}/cart`,
    });

    return NextResponse.json(session, { headers: corsHeaders });
  } catch (err) {
    console.log("[checkout_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import { stripe } from "@/lib/stripe";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

// export async function OPTIONS() {
//   return NextResponse.json({}, { headers: corsHeaders });
// }

// export async function POST(req: NextRequest) {
//   try {
//     const { cartItems, customer } = await req.json();

//     if (!cartItems || !customer) {
//       return new NextResponse("Not enough data to checkout", { status: 400 });
//     }

//     // Define the store's default currency (set to "cad" or "usd")
//     const storeCurrency = "cad"; // Change to "usd" if needed

//     // Ensure shipping rates match the store currency
//     const shippingRates = storeCurrency === "cad"
//       ? ["shr_1R0LtcA3YSWhSohz9eJPjAOE", "shr_1Qx5rmA3YSWhSohzxaBny0kl"] // Replace with CAD shipping rates from Stripe
//       : ["shr_1R0LyAA3YSWhSohz5iiBvwIt", "shr_1R0LyAA3YSWhSohz5iiBvwIt"]; // Replace with USD shipping rates from Stripe

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       shipping_address_collection: {
//         allowed_countries: ["US", "CA"],
//       },
//       shipping_options: shippingRates.map(rate => ({ shipping_rate: rate })), // Use correct shipping rates
//       line_items: cartItems.map((cartItem: any) => ({
//         price_data: {
//           currency: storeCurrency, // Use the same currency as shipping rates
//           product_data: {
//             name: cartItem.item.title,
//             metadata: {
//               productId: cartItem.item._id,
//               ...(cartItem.size && { size: cartItem.size }),
//               ...(cartItem.color && { color: cartItem.color }),
//             },
//           },
//           unit_amount: cartItem.item.price * 100,
//         },
//         quantity: cartItem.quantity,
//       })),
//       client_reference_id: customer.clerkId,
//       success_url: `${process.env.ECOMMERCE_STORE_URL}/payment_success`,
//       cancel_url: `${process.env.ECOMMERCE_STORE_URL}/cart`,
//     });

//     return NextResponse.json(session, { headers: corsHeaders });
//   } catch (err) {
//     console.error("[checkout_POST]", err);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }
