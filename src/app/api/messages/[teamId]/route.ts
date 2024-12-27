// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/mongodb";
// import Message from "@/models/Message";
// import { pusherServer } from "@/lib/pusher";

// export async function GET(
//   request: Request,
//   { params }: { params: { teamId: string } }
// ) {
//   try {
//     await dbConnect();
//     const teamId = params.teamId;
//     const messages = await Message.find({ teamId }).sort({ createdAt: 1 });
//     return NextResponse.json(messages);
//   } catch (error) {
//     console.error("Error fetching messages:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(
//   request: Request,
//   { params }: { params: { teamId: string } }
// ) {
//   try {
//     await dbConnect();
//     const { messageId, content } = await request.json();
//     const updatedMessage = await Message.findByIdAndUpdate(
//       messageId,
//       { content, updatedAt: new Date() },
//       { new: true }
//     );

//     if (!updatedMessage) {
//       return NextResponse.json({ error: "Message not found" }, { status: 404 });
//     }

//     await pusherServer.trigger(
//       `team-${params.teamId}`,
//       "message-updated",
//       updatedMessage
//     );

//     return NextResponse.json(updatedMessage);
//   } catch (error) {
//     console.error("Error updating message:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   request: Request,
//   { params }: { params: { teamId: string } }
// ) {
//   try {
//     await dbConnect();
//     const { messageId } = await request.json();
//     const deletedMessage = await Message.findByIdAndUpdate(
//       messageId,
//       { isDeleted: true },
//       { new: true }
//     );

//     if (!deletedMessage) {
//       return NextResponse.json({ error: "Message not found" }, { status: 404 });
//     }

//     await pusherServer.trigger(
//       `team-${params.teamId}`,
//       "message-deleted",
//       deletedMessage
//     );

//     return NextResponse.json(deletedMessage);
//   } catch (error) {
//     console.error("Error deleting message:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";
import { pusherServer } from "@/lib/pusher";

type RouteContext = {
  params: { teamId: string };
};

async function handleDBConnect(): Promise<void> {
  try {
    await dbConnect();
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    await handleDBConnect();
    const { teamId } = params;

    if (!teamId) {
      return NextResponse.json(
        { error: "Team ID is required" },
        { status: 400 }
      );
    }

    const messages = await Message.find({ teamId }).sort({ createdAt: 1 });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    await handleDBConnect();
    const { teamId } = params;
    const body = await request.json();

    const newMessage = await Message.create({
      ...body,
      teamId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await pusherServer.trigger(`team-${teamId}`, "message-created", newMessage);

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    await handleDBConnect();
    const { teamId } = params;
    const { messageId, content } = await request.json();

    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      {
        content,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    await pusherServer.trigger(
      `team-${teamId}`,
      "message-updated",
      updatedMessage
    );

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error("Error in PUT:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    await handleDBConnect();
    const { teamId } = params;
    const { messageId } = await request.json();

    const deletedMessage = await Message.findByIdAndUpdate(
      messageId,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    await pusherServer.trigger(
      `team-${teamId}`,
      "message-deleted",
      deletedMessage
    );

    return NextResponse.json(deletedMessage);
  } catch (error) {
    console.error("Error in DELETE:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
