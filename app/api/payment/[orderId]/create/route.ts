import { NextRequest } from "next/server";
import Razorpay from "razorpay";
import connectDB from "@/lib/db";
import Order from "@/lib/models/order";
import { getStubUserId } from "@/lib/auth";

function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) throw new Error("Razorpay keys not configured");
  return new Razorpay({ key_id, key_secret });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const userId = await getStubUserId(req);
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await params;

  await connectDB();

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

  const razorpay = getRazorpay();
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(order.quote.amount * 100), // paise
    currency: order.quote.currency,
    receipt: String(order._id),
  });

  return Response.json({
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
}
