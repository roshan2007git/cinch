import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/lib/models/order";
import { getStubUserId } from "@/lib/auth";

// PATCH /api/orders/[id]/quote — set quote on an order (tailor-side action)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getStubUserId(req);
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { amount, currency = "inr" } = await req.json();

  if (typeof amount !== "number" || amount <= 0) {
    return Response.json({ error: "amount must be a positive number" }, { status: 400 });
  }

  await connectDB();

  // TODO: when real auth exists, restrict this to tailor/admin roles
  const order = await Order.findById(id);
  if (!order) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status !== "pending_quote") {
    return Response.json(
      { error: `Cannot quote when order status is '${order.status}'` },
      { status: 409 }
    );
  }

  order.quote = { amount, currency };
  order.status = "quoted";
  await order.save();

  return Response.json({ orderId: order._id, status: order.status, quote: order.quote });
}
