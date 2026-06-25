import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/lib/models/order";
import { getStubUserId } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getStubUserId(req);
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await connectDB();

  const order = await Order.findOne({ _id: id, user: userId }).lean();
  if (!order) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }

  return Response.json({
    _id: order._id,
    status: order.status,
    quote: order.quote ?? null,
    selectedVariationId: order.selectedVariationId ?? null,
  });
}
