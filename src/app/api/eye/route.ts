import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { hits, misses, driftClicks, reactionTimes, score } = await req.json();

    const total = hits + misses;
    const accuracy = total > 0 ? Math.round((hits / total) * 100) : 0;
    const avgTime =
      reactionTimes.length > 0
        ? reactionTimes.reduce((a: number, b: number) => a + b, 0) /
          reactionTimes.length
        : 0;

    // ⚙️ Smart feedback logic
    let feedback = "";
    let level = "";

    if (accuracy >= 90 && avgTime <= 3 && driftClicks < 3) {
      feedback = "⚡ Excellent focus, coordination, and reaction control!";
      level = "excellent";
    } else if (accuracy >= 70 && avgTime <= 5) {
      feedback =
        "✅ Good focus and reaction speed. Slight distractibility observed.";
      level = "good";
    } else if (driftClicks > 5 && avgTime < 4) {
      feedback =
        "⚠️ Frequent clicks outside the target indicate impulsivity or low attention stability.";
      level = "impulsive";
    } else if (avgTime > 7 && accuracy < 60) {
      feedback =
        "😴 Slow reaction times and poor accuracy may indicate fatigue or low visual tracking ability.";
      level = "poor";
    } else {
      feedback =
        "🤔 Irregular performance pattern. Could reflect inconsistent attention or hesitation.";
      level = "mixed";
    }

    return NextResponse.json({
      averageTime: avgTime,
      accuracy,
      feedback,
      level,
      driftClicks,
      score,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error generating behavioral feedback" },
      { status: 500 }
    );
  }
}
