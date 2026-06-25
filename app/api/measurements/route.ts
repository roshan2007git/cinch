import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/user";
import { getOrCreateGuestUserId } from "@/lib/guest-auth";

export const maxDuration = 60;

export async function PUT(req: NextRequest) {
  try {
    const userId = await getOrCreateGuestUserId(req);

    const body = await req.json();
    const { height, weight, chest, waist, hips, shoulderWidth, sleeveLength, inseam } = body;

    await connectDB();

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "measurements.height": height,
          "measurements.weight": weight,
          "measurements.chest": chest,
          "measurements.waist": waist,
          "measurements.hips": hips,
          "measurements.shoulderWidth": shoulderWidth,
          "measurements.sleeveLength": sleeveLength,
          "measurements.inseam": inseam,
        },
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ measurements: user.measurements });
  } catch (err) {
    console.error("[measurements] Unhandled error:", err instanceof Error ? err.stack : err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown server error" },
      { status: 500 }
    );
  }
}
