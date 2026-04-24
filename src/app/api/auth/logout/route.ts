import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 },
    );

    // For Deleting Cookies
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0), // Immediate expiry
      path: "/", //
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Logout failed" }, { status: 500 });
  }
}
