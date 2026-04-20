import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export async function GET() {
  try {
    await connectToDatabase();

    // Check if database is connected by counting users (should be 0 or more)
    const userCount = await User.countDocuments();

    return NextResponse.json(
      {
        message: "Database connected successfully!",
        currentUsers: userCount,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Database connection failed",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
