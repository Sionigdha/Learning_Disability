import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jwt from "jsonwebtoken";

const SECRET = "my_secret_key"; // ⚠️ should be in .env

// list of protected routes
const protectedRoutes = ["/dashboard", "/chat"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // only check protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const token = req.cookies.get("token")?.value || "";

    try {
      jwt.verify(token, SECRET); // ✅ valid token
      return NextResponse.next();
    } catch (err) {
      // 🚫 no/invalid token → redirect to login
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}
