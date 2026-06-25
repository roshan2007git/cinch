import { NextRequest } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import Order from "@/lib/models/order";
import { getStubUserId } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const userId = await getStubUserId(req);
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, cinchOrderId } =
    await req.json();

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !cinchOrderId) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Verify Razorpay signature
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    return Response.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  await connectDB();

  const order = await Order.findOne({ _id: cinchOrderId, user: userId });
  if (!order) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status !== "quoted") {
    return Response.json(
      { error: `Unexpected order status '${order.status}'` },
      { status: 409 }
    );
  }

  order.payment = {
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    paidAt: new Date(),
  };
  order.status = "paid";
  await order.save();

  return Response.json({ success: true, orderId: order._id, status: order.status });
}
