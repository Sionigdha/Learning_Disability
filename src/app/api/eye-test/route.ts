import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    // data contains trackingAccuracy + fixationSpeed

    // In future, send to Gemini/OpenAI for deeper analysis
    // const aiResult = await model.generateContent(`Analyze this...`);

    return NextResponse.json({
      success: true,
      message: "Result received",
      recommendation:
        data.trackingAccuracy < 70 || data.fixationSpeed > 1200
          ? "⚠️ Possible focus issue, consider evaluation"
          : "✅ Normal for age",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
