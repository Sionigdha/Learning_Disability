import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No audio file uploaded" });
    }

    // Convert to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");

    // Gemini Model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const prompt = `
You are a child speech-language expert.
Analyze the child's spoken audio to evaluate speech development and detect any speech disabilities.

Return your answer strictly in JSON format like this:
{
  "transcription": "text of what child said",
  "fluency_score": "Low | Moderate | High",
  "pronunciation_issues": ["issue1", "issue2"],
  "speed": "Slow | Normal | Fast",
  "estimated_verbal_age": "X-Y years",
  "summary": "Short, parent-friendly summary of findings"
}
`;

    const result = await model.generateContent([
      { inlineData: { mimeType: file.type, data: base64Audio } },
      { text: prompt },
    ]);

    let responseText = result.response?.text() || "{}";

    // ✅ Sanitize any Markdown or code fence
    responseText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // ✅ Parse JSON safely
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      console.error("❌ JSON Parse Failed. Raw:", responseText);
      return NextResponse.json({
        success: false,
        error: "Invalid JSON returned from Gemini",
        raw: responseText,
      });
    }

    return NextResponse.json({
      success: true,
      model: "gemini-2.5-pro",
      ...parsed,
    });
  } catch (err: any) {
    console.error("Speech Analysis Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Server Error" },
      { status: 500 }
    );
  }
}
