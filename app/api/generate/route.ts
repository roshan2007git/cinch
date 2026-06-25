import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
import connectDB from "@/lib/db";
import User from "@/lib/models/user";
import Order from "@/lib/models/order";
import { getStubUserId } from "@/lib/auth";
import { getLimits, currentYearMonth } from "@/lib/plans";

function getAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
  return new GoogleGenAI({ apiKey });
}

export async function POST(req: NextRequest) {
  const userId = await getStubUserId(req);
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  // Reset counter if we're in a new month
  if (user.usage.usageMonth !== thisMonth) {
    user.usage.generationsThisMonth = 0;
    user.usage.usageMonth = thisMonth;
  }

  if (
    limits.generationsPerMonth !== null &&
    user.usage.generationsThisMonth >= limits.generationsPerMonth
  ) {
    return Response.json(
      {
        error: "Generation limit reached for this month",
        limit: limits.generationsPerMonth,
        plan: user.plan,
      },
      { status: 429 }
    );
  }

  // Check saved projects limit
  if (
    limits.savedProjects !== null &&
    user.usage.savedProjectsCount >= limits.savedProjects
  ) {
    return Response.json(
      {
        error: "Saved projects limit reached",
        limit: limits.savedProjects,
        plan: user.plan,
      },
      { status: 429 }
    );
  }

  const numVariations = limits.variationsPerDesign;

  const systemPrompt = `You are a fashion design assistant. Generate exactly ${numVariations} distinct garment design variations based on the user's description.
Return ONLY a valid JSON array with no markdown, no extra text. Each element must have:
- name: string (short creative name for the design)
- description: string (2-3 sentences describing style, fabric, silhouette)
- estimatedMeasurements: object with string keys and string values (e.g. { "chest": "36 inches", "waist": "28 inches" })

Example:
[{"name":"Ivory Evening Drape","description":"A flowing ivory gown...","estimatedMeasurements":{"chest":"36 inches"}}]`;

  const ai = getAI();
  let variations;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { systemInstruction: systemPrompt },
    });

    const raw = response.text ?? "";
    // Strip any accidental markdown code fences
    const cleaned = raw.replace(/^```(?:json)?\n?/m, "").replace(/```$/m, "").trim();
    variations = JSON.parse(cleaned);

    if (!Array.isArray(variations) || variations.length === 0) {
      throw new Error("Invalid response structure from Gemini");
    }
  } catch (err) {
    console.error("Gemini error:", err);
    return Response.json({ error: "Failed to generate designs" }, { status: 502 });
  }

  // Save order and increment usage atomically-ish
  const order = await Order.create({
    user: userId,
    designInput: { text: prompt, inspirationImageUrls },
    measurementsSnapshot: user.measurements ?? {},
    variations,
    status: "awaiting_selection",
  });

  user.usage.generationsThisMonth += 1;
  user.usage.savedProjectsCount += 1;
  await user.save();

  return Response.json({
    orderId: order._id,
    variations: order.variations,
    remaining:
      limits.generationsPerMonth === null
        ? null
        : limits.generationsPerMonth - user.usage.generationsThisMonth,
  });
}
