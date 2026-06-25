import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/lib/models/order";
import { getOrCreateGuestUserId } from "@/lib/guest-auth";

// PATCH /api/orders/[id]/quote — override quote (tailor/admin action)
// In normal flow quotes are set automatically by the select route.
// TODO: when real auth exists, restrict this to tailor/admin roles.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await getOrCreateGuestUserId(req); // ensures cookie is set
  const { id } = await params;
  const { amount, currency = "inr" } = await req.json();

  if (typeof amount !== "number" || amount <= 0) {
    return Response.json({ error: "amount must be a positive number" }, { status: 400 });
  }

  await connectDB();

  const order = await Order.findById(id);
  if (!order) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }

  order.quote = { amount, currency };
  order.status = "quoted";
  await order.save();

  return Response.json({ orderId: order._id, status: order.status, quote: order.quote });
}
