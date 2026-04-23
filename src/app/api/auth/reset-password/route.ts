import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { token, password } = await req.json();

    // 1. Token dhoondna aur check karna ke expired na ho
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() }, // Token ka time abhi baaki ho
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 },
      );
    }

    // 2. Naya password hash karna
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // 3. Reset fields ko clear karna taaki token dobara use na ho sake
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Reset Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
