import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect/mongodb";
import User from "@/lib/models/User";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    let token = req.cookies.get("token")?.value;

    if (!token) {
      const authHeader = req.headers.get("authorization");
      token = authHeader?.split(" ")[1];
    }

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 },
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const userId = decoded.id || decoded._id || decoded.userId;

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid Token Payload" },
        { status: 401 },
      );
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        name: user.name,
        email: user.email,
        id: user._id,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Auth API Error:", error.message);
    return NextResponse.json(
      {
        message: "Invalid or Expired Token",
        error: error.message,
      },
      { status: 401 },
    );
  }
}
