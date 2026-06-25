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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const userId = await getOrCreateGuestUserId(req);
  const { orderId } = await params;

  try {
    await connectDB();
  } catch {
    return Response.json({ error: "Database connection failed" }, { status: 500 });
  }

  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status !== "quoted") {
    return Response.json(
      { error: `Cannot create payment when order status is '${order.status}'` },
      { status: 409 }
    );
  }

  if (!order.quote) {
    return Response.json({ error: "Order has no quote" }, { status: 400 });
  }

  const stripe = getStripe();
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.quote.amount * 100), // paise
    currency: order.quote.currency ?? "inr",
    metadata: { cinchOrderId: String(order._id), userId: String(userId) },
  });

  return Response.json({ clientSecret: paymentIntent.client_secret });
}
