import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/lib/models/order";
import { getOrCreateGuestUserId } from "@/lib/guest-auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getOrCreateGuestUserId(req);
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
  } catch (err) {
    console.error("[orders/id] Unhandled error:", err instanceof Error ? err.stack : err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown server error" },
      { status: 500 }
    );
  }
}
