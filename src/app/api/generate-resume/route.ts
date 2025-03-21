import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const {
      profile,
      projects,
      certificates,
      companyName,
      experience,
      resumeFormat,
    } = await request.json();

    const prompt = `
      Generate a professional resume based on the following information:
      
      Profile: ${JSON.stringify(profile)}
      Projects: ${JSON.stringify(projects)}
      Certificates: ${JSON.stringify(certificates)}
      Target Company: ${companyName}
      Years of Experience: ${experience}
      Resume Format: ${resumeFormat}

      Please format the resume in a structured way, including sections for:
      1. Professional Summary
      2. Skills
      3. Work Experience (based on projects)
      4. Education and Certifications
      5. Additional Information (languages, hobbies, etc.)

      Tailor the content to highlight skills and experiences relevant to ${companyName}.
      Use a ${resumeFormat} style for the formatting.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(prompt);
    const resumeContent = result.response.text();

    return NextResponse.json({ resumeContent });
  } catch (error) {
    console.error("Error generating resume:", error);
    return NextResponse.json(
      { error: "Failed to generate resume" },
      { status: 500 }
    );
  }
}
