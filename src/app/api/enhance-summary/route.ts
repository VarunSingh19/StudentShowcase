import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(request: Request) {
  const { profile, companyName, experience, projects, certificates } =
    await request.json();

  const prompt = `
    As an AI assistant, create a professional summary for a job application. Use the following information:
    - Target Company: ${companyName}
    - Years of Experience: ${experience}
    - Skills: ${profile.skills.join(", ")}
    - Number of Projects: ${projects}
    - Number of Certificates: ${certificates}
    - Current Bio: ${profile.bio}

    Create a compelling and concise professional summary that highlights the candidate's experience, skills, and achievements. The summary should be tailored to the target company and demonstrate why the candidate is an excellent fit for a role there.
  `;

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  const enhancedSummary = result.response.text();

  return NextResponse.json({ enhancedSummary });
}
