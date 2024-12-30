import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

interface AssessmentResult {
  isCorrect: boolean;
  skill: string;
}

export async function POST(request: Request) {
  try {
    const {
      results,
      field,
      path,
      difficulty,
    }: {
      results: AssessmentResult[];
      field: string;
      path: string;
      difficulty: string;
    } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Based on the following assessment results for a ${difficulty} level ${path} assessment in the ${field} field, provide 5 personalized recommendations for skill improvement:

    ${results
      .map(
        (result: AssessmentResult, index: number) =>
          `Question ${index + 1}: ${
            result.isCorrect ? "Correct" : "Incorrect"
          } (Skill: ${result.skill})`
      )
      .join("\n")}

    Include specific resources, online courses, projects to build, and books or articles to read that would help the user improve their skills in ${path} at the ${difficulty} level within the ${field} field.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const recommendations = text
      .split("\n")
      .filter((line) => line.trim() !== "");

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
