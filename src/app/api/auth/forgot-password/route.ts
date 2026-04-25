import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect/mongodb";
import User from "@/lib/models/User";
import crypto from "crypto";
import nodemailer from "nodemailer"; // 1. Nodemailer import karein

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    // 2. Transporter Setup (Gmail ke liye)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_SERVER_USER, // Vercel/Env se aayega
        pass: process.env.EMAIL_SERVER_PASSWORD, // App Password yahan aayega
      },
    });

    // 3. Dynamic URL (Local host aur Vercel dono ke liye)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    // 4. Email Send logic
    await transporter.sendMail({
      from: `"TaskFlow Manager" <${process.env.EMAIL_SERVER_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Password Reset Request</h2>
          <p>Aapne password reset karne ki request ki hai. Niche diye gaye button par click karke naya password set karein:</p>
          <a href="${resetUrl}" style="background: #2563EB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          <p>Ye link 1 ghante tak valid hai.</p>
          <p>Agar aapne ye request nahi ki, to is email ko ignore karein.</p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "Reset link sent to your email!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Email Error:", error);
    return NextResponse.json(
      { message: "Failed to send email" },
      { status: 500 },
    );
  }
}
