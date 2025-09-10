import { NextResponse } from "next/server";

// Sample Ishihara plates dataset
const plates = [
  { id: 1, img: "/plates/12.png", answer: "12" }, // visible to all
  { id: 2, img: "/plates/29.png", answer: "29" }, // protan detection
  { id: 3, img: "/plates/8.png", answer: "8" },   // deutan detection
  { id: 4, img: "/plates/42.png", answer: "42" }, // tritan detection
  { id: 5, img: "/plates/5.png", answer: "5" },   // deutan detection
];

export async function GET() {
  return NextResponse.json({ plates });
}
