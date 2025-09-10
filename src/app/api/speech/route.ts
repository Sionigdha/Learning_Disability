import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Helper: run transcription + analysis
async function runAnalysis(modelName: string, base64Audio: string) {
  const model = genAI.getGenerativeModel({ model: modelName });

  // Step 1: Transcription
  const transcriptionPrompt = `Transcribe this audio into plain English text only.`;

  const transcriptionResult = await model.generateContent([
    { inlineData: { mimeType: "audio/wav", data: base64Audio } },
    { text: transcriptionPrompt },
  ]);

  console.log(`🎙 FULL transcription response (${modelName}):`, JSON.stringify(transcriptionResult, null, 2));

  const transcriptionText = transcriptionResult.response.text().trim();
  console.log(`🎙 Cleaned transcription text (${modelName}):`, transcriptionText);

  if (!transcriptionText || transcriptionText.length < 2) {
    throw new Error("Gemini did not return a transcription");
  }

  // Step 2: Analysis
  const analysisPrompt = `
Analyze this child's speech for fluency, pronunciation, speed, and verbal developmental age.

Text: "${transcriptionText}"

Return ONLY JSON:
{
  "fluency_score": "Low | Moderate | High",
  "pronunciation_issues": ["issue1", "issue2"],
  "speed": "Slow | Normal | Fast",
  "estimated_verbal_age": "X years",
  "summary": "Short child-friendly explanation"
}
`;

  const analysisResult = await model.generateContent(analysisPrompt);

  console.log(`🧠 FULL analysis response (${modelName}):`, JSON.stringify(analysisResult, null, 2));

  let textResponse = analysisResult.response.text().trim();

  // Ensure JSON safety
  if (!textResponse.startsWith("{")) {
    textResponse = textResponse.slice(textResponse.indexOf("{"));
  }
  if (!textResponse.endsWith("}")) {
    textResponse = textResponse.slice(0, textResponse.lastIndexOf("}") + 1);
  }

  return { transcription: transcriptionText, analysis: textResponse };
}

// ✅ Exported POST method (required by Next.js)
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

    // Convert audio file → base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Audio = buffer.toString("base64");

    try {
      // Try gemini-1.5-pro first
      const result = await runAnalysis("gemini-1.5-pro", base64Audio);
      return NextResponse.json({ success: true, ...result, model: "gemini-1.5-pro" });
    } catch (err: any) {
      console.warn("⚠️ gemini-1.5-pro failed, retrying with gemini-1.5-flash:", err.message);

      // Fallback to gemini-1.5-flash
      const result = await runAnalysis("gemini-1.5-flash", base64Audio);
      return NextResponse.json({ success: true, ...result, model: "gemini-1.5-flash" });
    }
  } catch (error: any) {
    console.error("Gemini Speech API error (final):", error);
    return NextResponse.json(
      { success: false, error: error.message || "Speech analysis failed" },
      { status: 500 }
    );
  }
}
