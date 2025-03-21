import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const { recipientId, name, email, message } = await request.json();

    // Validate required fields
    if (!recipientId || !name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Add message to Firestore
    const docRef = await addDoc(collection(db, "contactMessages"), {
      recipientId,
      name,
      email,
      message,
      createdAt: new Date(),
      read: false,
    });

    return NextResponse.json({
      success: true,
      messageId: docRef.id,
    });
  } catch (error) {
    console.error("Error sending contact message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
