import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Convert image → base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = buffer.toString("base64");

    // ✅ Use supported Gemini model (no "-latest" suffix)
    let model;
    try {
      model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    } catch {
      model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    }

    const prompt = `
You are an expert in handwriting analysis for early detection of learning disabilities in children.

1. TRANSCRIBE the handwriting into plain English text. If unreadable, write "UNREADABLE".
2. ANALYZE the handwriting for:
   - Letter spacing
   - Shape distortion
   - Line alignment
   - Pressure balance (too light, too heavy, uneven)
   - Tilt (left-handed slant, right-handed slant)
   - Consistency of letter formation
   - Possible dysgraphia or related issues

3. Return JSON ONLY in this exact format:
{
  "transcription": "transcribed text or UNREADABLE",
  "issue_category": "e.g., Dysgraphia Risk, Pressure Imbalance, Left-handed Tilt, Shape Distortion, Neat & Normal",
  "risk_level": "Low | Moderate | High",
  "improvement_areas": ["suggestion1", "suggestion2"],
  "summary": "Short child-friendly explanation"
}
`;

    const result = await model.generateContent([
      { inlineData: { mimeType: file.type, data: base64Image } },
      { text: prompt },
    ]);

    let textResponse = result.response.text().trim();

    // Ensure JSON validity
    if (!textResponse.startsWith("{"))
      textResponse = textResponse.slice(textResponse.indexOf("{"));
    if (!textResponse.endsWith("}"))
      textResponse = textResponse.slice(0, textResponse.lastIndexOf("}") + 1);

    const analysis = JSON.parse(textResponse);

    return NextResponse.json({ success: true, ...analysis });
  } catch (error: any) {
    console.error("Handwriting API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Handwriting analysis failed" },
      { status: 500 }
    );
  }
}
