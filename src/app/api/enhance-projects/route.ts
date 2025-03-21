import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { projects } = await request.json();

    if (!projects || projects.length === 0) {
      return NextResponse.json(
        { error: "No projects provided" },
        { status: 400 }
      );
    }

    const prompt = `
IMPORTANT INSTRUCTIONS:
1. You MUST return a VALID JSON object exactly matching this structure:
{
  "enhancedProjects": [
    {
      "id": "original project id",
      "projectName": "Enhanced Project Name",
      "techStack": "Enhanced Tech Stack",
      "description": "Enhanced project description highlighting impact and complexity",
      "features": [
        "Enhanced feature 1",
        "Enhanced feature 2",
        "New feature showcasing additional skills"
      ]
    }
  ]
}

2. Enhance each project by:
- Making the description more compelling
- Adding technical depth to features
- Highlighting unique skills and project impact

3. STRICTLY USE THE ORIGINAL PROJECT ID
4. DO NOT use markdown code blocks
5. ENSURE VALID JSON FORMAT

Original Projects:
${JSON.stringify(projects, null, 2)}
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(prompt);
    const enhancedProjectsText = result.response.text();

    // Extensive logging
    console.log("Raw AI Response:", enhancedProjectsText);

    // Aggressive JSON extraction
    const cleanedText = enhancedProjectsText
      .replace(/```(json)?/g, "") // Remove markdown code block markers
      .replace(/^\s*[\r\n]+/gm, "") // Remove empty lines
      .trim();

    console.log("Cleaned Response:", cleanedText);

    let parsedProjects;
    try {
      parsedProjects = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("JSON Parsing Error:", parseError);

      // Additional diagnostic logging
      console.log("First 500 characters:", cleanedText.slice(0, 500));
      console.log("Last 500 characters:", cleanedText.slice(-500));

      return NextResponse.json(
        {
          error: "Failed to parse AI response",
          rawResponse: enhancedProjectsText,
          cleanedText: cleanedText,
        },
        { status: 500 }
      );
    }

    // Validate structure
    if (
      !parsedProjects.enhancedProjects ||
      !Array.isArray(parsedProjects.enhancedProjects)
    ) {
      throw new Error("Invalid response structure");
    }

    return NextResponse.json(parsedProjects);
  } catch (error) {
    console.error("Comprehensive error details:", {
      errorName: error instanceof Error ? error.name : "Unknown Error",
      errorMessage: error instanceof Error ? error.message : error,
      errorStack: error instanceof Error ? error.stack : "No stack trace",
    });

    return NextResponse.json(
      {
        error: "Failed to enhance projects",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
