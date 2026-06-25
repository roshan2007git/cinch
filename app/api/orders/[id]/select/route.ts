import { NextRequest } from "next/server";
import connectDB from "@/lib/db";

export const maxDuration = 60;
import Order from "@/lib/models/order";
import { getOrCreateGuestUserId } from "@/lib/guest-auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getOrCreateGuestUserId(req);
  const { id } = await params;
  const { variationId } = await req.json();

  if (!variationId) {
    return Response.json({ error: "variationId is required" }, { status: 400 });
  }

  try {
    await connectDB();
  } catch {
    return Response.json({ error: "Database connection failed" }, { status: 500 });
  }

  const order = await Order.findOne({ _id: id, user: userId });
  if (!order) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status !== "awaiting_selection") {
    return Response.json(
      { error: `Cannot select variation when order status is '${order.status}'` },
      { status: 409 }
    );
  }

  const variation = order.variations.find((v) => String(v._id) === variationId);
  if (!variation) {
    return Response.json({ error: "Variation not found in this order" }, { status: 404 });
  }

  // Auto-quote from the AI-estimated price — no manual tailor step needed
  order.selectedVariationId = variationId;
  order.quote = { amount: variation.estimatedPriceInr, currency: "inr" };
  order.status = "quoted";
  await order.save();

  return Response.json({
    orderId: order._id,
    status: order.status,
    quote: order.quote,
  });
}
