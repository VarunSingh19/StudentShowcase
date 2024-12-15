import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: Request) {
  await dbConnect();
  const { teamId, message } = await request.json();

  const newMessage = new Message({
    teamId,
    userId: message.userId,
    userName: message.userName,
    content: message.content,
  });

  await newMessage.save();

  await pusherServer.trigger(`team-${teamId}`, "new-message", newMessage);

  return NextResponse.json(newMessage);
}
