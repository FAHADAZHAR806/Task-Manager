import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 },
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    // FIX: user._id ko .toString() karna lazmi hai
    const token = await new SignJWT({ userId: user._id.toString() })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(secret);

    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 1 day
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
