import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/dbConnect/mongodb";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { name, email, password } = await req.json();

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 },
      );
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Create new user with "pending" status
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      status: "pending",
    });

    await newUser.save();

    return NextResponse.json(
      {
        message:
          "Registration successful. Please wait for Admin approval before logging in.",
      },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Registration failed", error: error.message },
      { status: 500 },
    );
  }
}
