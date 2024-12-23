// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/mongodb";
// import Message from "@/models/Message";
// import { pusherServer } from "@/lib/pusher";

// export async function POST(request: Request) {
//   await dbConnect();
//   const { teamId, message } = await request.json();

//   const newMessage = new Message({
//     teamId,
//     userId: message.userId,
//     userName: message.userName,
//     content: message.content,
//   });

//   await newMessage.save();

//   await pusherServer.trigger(`team-${teamId}`, "new-message", newMessage);

//   return NextResponse.json(newMessage);
// }
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
    readBy: [message.userId], // Mark as read by the sender
  });

  await newMessage.save();

  await pusherServer.trigger(`team-${teamId}`, "new-message", newMessage);

  return NextResponse.json(newMessage);
}

export async function PUT(request: Request) {
  await dbConnect();
  const { messageId, userId } = await request.json();

  const updatedMessage = await Message.findByIdAndUpdate(
    messageId,
    { $addToSet: { readBy: userId } },
    { new: true }
  );

  if (!updatedMessage) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  await pusherServer.trigger(
    `team-${updatedMessage.teamId}`,
    "message-read",
    updatedMessage
  );

  return NextResponse.json(updatedMessage);
}
