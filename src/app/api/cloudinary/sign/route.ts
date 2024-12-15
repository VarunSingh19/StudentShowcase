import { SignJWT } from "jose";
import { NextResponse } from "next/server";

if (!process.env.CLOUDINARY_API_SECRET) {
  throw new Error("CLOUDINARY_API_SECRET is not set");
}

export async function POST() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = await new SignJWT({ timestamp })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1m")
      .sign(new TextEncoder().encode(process.env.CLOUDINARY_API_SECRET));

    return NextResponse.json({ timestamp, signature });
  } catch (error) {
    console.error("Error generating signature:", error);
    return NextResponse.json(
      { error: "Failed to generate signature" },
      { status: 500 } // Explicitly set the error status
    );
  }
}
