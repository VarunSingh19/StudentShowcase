import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Project } from "@/types/profile";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(request: Request) {
  const { project, companyName }: { project: Project; companyName: string } =
    await request.json();

  if (
    !project ||
    typeof project !== "object" ||
    !Array.isArray(project.features)
  ) {
    return NextResponse.json(
      { error: "Invalid project data or missing features array" },
      { status: 400 }
    );
  }

  const prompt = `
    As an AI assistant, enhance the folnlowing project features for a resume. The resume is being tailored for an application to ${companyName}. Use the following project information:
    - Project Name: ${project.projectName}
    - Tech Stack: ${project.techStack}
    - Description: ${project.description}
    - Current Features:
      ${project.features.map((feature) => `- ${feature}`).join("\n")}

    Enhance the existing features and add 2-3 new features that highlight the project's complexity, the candidate's skills, and the potential value to ${companyName}. Each feature should be concise and impactful.
  `;

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  const result = await model.generateContent(prompt);
  const enhancedFeaturesText = result.response.text();
  const enhancedFeatures = enhancedFeaturesText
    .split("\n")
    .filter((feature) => feature.trim() !== "");

  return NextResponse.json({ enhancedFeatures });
}
