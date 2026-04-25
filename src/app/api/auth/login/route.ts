import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/dbConnect/mongodb";
import User from "@/lib/models/User";
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

    // --- NEW: ADMIN APPROVAL CHECK ---
    if (user.status === "pending") {
      return NextResponse.json(
        {
          message:
            "Your account is awaiting admin approval. Please try again later.",
        },
        { status: 403 }, // 403 means Forbidden
      );
    }

    if (user.status === "rejected") {
      return NextResponse.json(
        { message: "Your account request has been rejected by the admin." },
        { status: 403 },
      );
    }
    // ---------------------------------

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

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
      maxAge: 86400,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
