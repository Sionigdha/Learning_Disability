import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // check if exists
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json(
      { success: false, message: "User already exists" },
      { status: 400 }
    );
  }

  // hash password 🔒
  const hashedPassword = await bcrypt.hash(password, 10);

  // save user
  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  return NextResponse.json({ success: true, user });
}
