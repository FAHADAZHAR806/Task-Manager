import { NextResponse } from "next/server";
import type { NextRequest } from "next/request";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // 1. Agar user Dashboard pe jana chahta hai aur token nahi hai
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      // 2. Token ko verify karein
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (error) {
      // Agar token fake hai ya expire ho gaya hai
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// Ye middleware sirf dashboard aur uske sub-pages par chalega
export const config = {
  matcher: ["/dashboard/:path*"],
};
