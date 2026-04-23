// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect/mongodb";
import User from "@/lib/models/User";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    // 1. User ko dhoondna
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 2. Temporary Token banana
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 ghanta valid

    // 3. DB mein save karna
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    // 4. Testing ke liye link Terminal mein print karna
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
