import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect/mongodb";
import User from "@/lib/models/User";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    // 1. Find User
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 2. Temporary Token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // Token Validaty

    // 3. Save Data in DB
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    // 4. For Testing show link in Termianl
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    console.log("-----------------------------------------");
    console.log("🔗 RESET LINK FOR TEST:", resetUrl);
    console.log("-----------------------------------------");

    return NextResponse.json(
      { message: "Reset link generated" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
