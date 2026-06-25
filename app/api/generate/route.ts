import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
import connectDB from "@/lib/db";
import User from "@/lib/models/user";
import Order from "@/lib/models/order";
import { getOrCreateGuestUserId } from "@/lib/guest-auth";
import { getLimits, currentYearMonth } from "@/lib/plans";

export const maxDuration = 60;

function getAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
  return new GoogleGenAI({ apiKey });
}

export async function POST(req: NextRequest) {
  console.log("[generate] env check — GEMINI_API_KEY:", !!process.env.GEMINI_API_KEY, "MONGODB_URI:", !!process.env.MONGODB_URI, "STRIPE_SECRET_KEY:", !!process.env.STRIPE_SECRET_KEY);
  try {
    const userId = await getOrCreateGuestUserId(req);

    // TODO: image upload to cloud storage not yet implemented.
    // The client collects File objects in state but they are not sent to the server.
    // To implement: accept multipart/form-data or presigned-URL upload, store in
    // S3/GCS, and pass the resulting URLs here as inspirationImageUrls.
    const { prompt, inspirationImageUrls = [] } = await req.json();

    if (!prompt?.trim()) {
      return Response.json({ error: "prompt is required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const limits = getLimits(user.plan);
    const thisMonth = currentYearMonth();

    if (user.usage.usageMonth !== thisMonth) {
      user.usage.generationsThisMonth = 0;
      user.usage.usageMonth = thisMonth;
    }

    if (
      limits.generationsPerMonth !== null &&
      user.usage.generationsThisMonth >= limits.generationsPerMonth
    ) {
      return Response.json(
        { error: "Generation limit reached for this month", limit: limits.generationsPerMonth, plan: user.plan },
        { status: 429 }
      );
    }

    const numVariations = limits.variationsPerDesign;

    const systemPrompt = `You are a fashion design assistant for Cinch, a custom garment platform in India.
Generate exactly ${numVariations} distinct garment design variations based on the user's description.
Return ONLY a valid JSON array with no markdown, no extra text. Each element must have:
- name: string (short creative name, 2-5 words)
- description: string (2-3 sentences describing style, fabric, silhouette)
- estimatedMeasurements: object with string keys and string values (e.g. { "chest": "36 inches", "waist": "28 inches" })
- estimatedPriceInr: number (realistic INR price for a custom-made garment of this type, e.g. 2500 for a simple kurta, 8000 for a structured gown)

Example:
[{"name":"Ivory Evening Drape","description":"A flowing ivory gown...","estimatedMeasurements":{"chest":"36 inches"},"estimatedPriceInr":7500}]`;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { systemInstruction: systemPrompt },
    });

    const raw = response.text ?? "";
    const cleaned = raw.replace(/^```(?:json)?\n?/m, "").replace(/```$/m, "").trim();
    let variations = JSON.parse(cleaned);

    if (!Array.isArray(variations) || variations.length === 0) {
      throw new Error("Invalid response structure from Gemini");
    }

    // Ensure estimatedPriceInr is always a positive number
    variations = variations.map((v: Record<string, unknown>) => ({
      ...v,
      estimatedPriceInr: typeof v.estimatedPriceInr === "number" && v.estimatedPriceInr > 0
        ? v.estimatedPriceInr
        : 3000,
    }));

    // Generate one image per variation — non-blocking: failures fall back to no image
    const imageResults = await Promise.allSettled(
      variations.map((v: Record<string, unknown>) =>
        ai.models.generateContent({
          model: "gemini-3-pro-image-preview",
          contents: `Product photo of a garment: ${v.name}. ${v.description}. Clean studio background, fashion catalog style.`,
          config: { imageConfig: { aspectRatio: "1:1", imageSize: "1K" } },
        })
      )
    );

    imageResults.forEach((r, i) => {
      if (r.status === "rejected") console.error(`[generate] Image ${i} failed:`, r.reason);
    });

    variations = variations.map((v: Record<string, unknown>, i: number) => {
      const result = imageResults[i];
      if (result.status !== "fulfilled") return v;
      const part = result.value.candidates?.[0]?.content?.parts?.find((p: Record<string, unknown>) => p.inlineData);
      if (!part?.inlineData) return v;
      return { ...v, imageUrl: `data:image/png;base64,${(part.inlineData as Record<string, unknown>).data}` };
    });

    const order = await Order.create({
      user: userId,
      designInput: { text: prompt, inspirationImageUrls },
      measurementsSnapshot: (user.measurements as any)?.toObject?.() ?? {},
      variations,
      status: "awaiting_selection",
    });

    user.usage.generationsThisMonth += 1;
    await user.save();

    return Response.json({
      orderId: order._id,
      variations: order.variations,
      remaining:
        limits.generationsPerMonth === null
          ? null
          : limits.generationsPerMonth - user.usage.generationsThisMonth,
    });
  } catch (err) {
    console.error("[generate] Unhandled error:", err instanceof Error ? err.stack : err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown server error" },
      { status: 500 }
    );
  }
}
