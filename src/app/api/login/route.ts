import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const prisma = new PrismaClient();
const SECRET = "my_secret_key"; // ⚠️ move to .env in production

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // find user
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  }

  // compare password 🔐
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  }

  // generate JWT
  

const token = jwt.sign({ email: user.email }, SECRET, { expiresIn: "1h" });

// ✅ Save token in cookie
(cookies() as any).set({
  name: "token",
  value: token,
  httpOnly: true,
  path: "/", // keep so cookie works on all routes
});


return NextResponse.json({ success: true });
}
