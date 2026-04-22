import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Cookie ko delete karne ke liye uski expiry past mein set kar dein
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}
