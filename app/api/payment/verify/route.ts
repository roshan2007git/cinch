import { NextRequest } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/db";
import Order from "@/lib/models/order";
import { getOrCreateGuestUserId } from "@/lib/guest-auth";

export const maxDuration = 60;

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(key);
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getOrCreateGuestUserId(req);
    const { paymentIntentId, cinchOrderId } = await req.json();

    if (!paymentIntentId || !cinchOrderId) {
      return Response.json({ error: "paymentIntentId and cinchOrderId are required" }, { status: 400 });
    }

    // Retrieve from Stripe server-side — never trust a frontend success claim
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return Response.json(
        { error: `Payment not completed (status: ${paymentIntent.status})` },
        { status: 402 }
      );
    }

    await connectDB();

    const order = await Order.findOne({ _id: cinchOrderId, user: userId });
    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "paid") {
      return Response.json({ success: true, orderId: order._id, status: order.status });
    }

    if (order.status !== "quoted") {
      return Response.json(
        { error: `Unexpected order status '${order.status}'` },
        { status: 409 }
      );
    }

    order.payment = { paymentIntentId, paidAt: new Date() };
    order.status = "paid";
    await order.save();

    return Response.json({ success: true, orderId: order._id, status: order.status });
  } catch (err) {
    console.error("[payment/verify] Unhandled error:", err instanceof Error ? err.stack : err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown server error" },
      { status: 500 }
    );
  }
}
