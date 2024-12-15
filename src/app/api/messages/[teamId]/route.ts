import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";

export async function GET(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    await dbConnect();
    const teamId = params.teamId;
    const messages = await Message.find({ teamId }).sort({ createdAt: 1 });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
