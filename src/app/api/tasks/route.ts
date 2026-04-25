import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectToDatabase from "@/lib/dbConnect/mongodb";
import { Task } from "@/lib/models/Task";
import { jwtVerify } from "jose";

//  helper function who handles[object Object]
const getCleanUserId = (payload: any) => {
  if (!payload || !payload.userId) return null;

  let id = payload.userId;

  if (typeof id === "object") {
    id = id._id || id.id || JSON.stringify(id);
  }

  // Agar string "[object Object]" ban chuki hai, to login dobara karna hoga
  if (String(id).includes("[object Object]")) {
    return null;
  }

  return String(id).replace(/["']/g, "").trim();
};

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json([], { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const userId = getCleanUserId(payload);

    if (!userId) {
      // Agar userId kharab hai, to client ko kahein login dobara karein
      return NextResponse.json(
        { message: "Invalid token data. Please login again." },
        { status: 400 },
      );
    }

    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(tasks || []);
  } catch (error: any) {
    console.error("GET ERROR:", error.message);
    return NextResponse.json(
      { message: "Error fetching tasks", error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const userId = getCleanUserId(payload);
    if (!userId)
      return NextResponse.json(
        { message: "Session expired. Please login." },
        { status: 400 },
      );

    const { title, description, priority, dueDate } = await req.json();

    const newTask = new Task({
      title,
      description,
      priority: priority || "Medium",
      dueDate,
      userId: userId,
    });

    await newTask.save();
    return NextResponse.json(newTask, { status: 201 });
  } catch (error: any) {
    console.error("POST ERROR:", error.message);
    return NextResponse.json(
      { message: "Error creating task", error: error.message },
      { status: 500 },
    );
  }
}
