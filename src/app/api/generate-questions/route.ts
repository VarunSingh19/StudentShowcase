// import { NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

// export async function POST(request: Request) {
//   try {
//     const { field, path, difficulty } = await request.json();

//     console.log(
//       "Received request for path:",
//       path,
//       "and difficulty:",
//       difficulty
//     );

//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//     const prompt = `Generate 1 multiple-choice questions for a ${difficulty} level assessment in ${path} and in ${field}.
//     Each question should follow this exact format:
//     {
//       "text": "Question text here",
//       "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
//       "correctAnswer": 0, // Index of the correct answer in options array
//       "explanation": "Detailed explanation of why this answer is correct",
//       "skill": "Specific skill or concept being tested"
//     }

//     Format the response as a JSON array of such objects.
//     Ensure the JSON is valid and can be parsed.
//     Do not include any markdown or code block markers.`;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     let text = response.text().trim();

//     // Remove any potential code block markers
//     text = text.replace(/```json\s?/, "").replace(/```\s?$/, "");

//     console.log("Raw Gemini response after cleanup:", text);

//     let questions;
//     try {
//       questions = JSON.parse(text);
//       if (
//         !Array.isArray(questions) ||
//         questions.length === 0 ||
//         !questions[0].text ||
//         !questions[0].options ||
//         typeof questions[0].correctAnswer !== "number" ||
//         !questions[0].explanation
//       ) {
//         throw new Error("Invalid question format");
//       }
//     } catch (parseError) {
//       console.error("Error parsing Gemini response:", parseError);
//       return NextResponse.json(
//         { error: "Failed to generate valid questions" },
//         { status: 500 }
//       );
//     }

//     console.log("Returning questions:", questions);
//     return NextResponse.json({ questions });
//   } catch (error) {
//     console.error("Error generating questions:", error);
//     return NextResponse.json(
//       { error: "Failed to generate questions: " + error },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { field, path, difficulty } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate 5 multiple-choice questions for a ${difficulty} level assessment in the ${field} field, specifically for the ${path} path. 
    Each question should have 4 options, a correct answer, an explanation, and a specific skill within ${path} that it tests.
    Format the response as a JSON array of objects, where each object has 'text', 'options', 'correctAnswer', 'explanation', and 'skill' fields.
    Ensure that the JSON is valid and can be parsed.
    Example format:
    [
      {
        "text": "What is the primary purpose of React hooks?",
        "options": [
          "To manage state in functional components",
          "To create class components",
          "To handle routing in React applications",
          "To optimize React performance"
        ],
        "correctAnswer": 0,
        "explanation": "React hooks, introduced in React 16.8, allow you to use state and other React features in functional components without writing a class.",
        "skill": "React State Management"
      },
      // ... more questions
    ]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Remove any potential code block markers
    text = text
      .replace(/```json\s?/, "")
      .replace(/```\s?$/, "")
      .trim();

    let questions;
    try {
      questions = JSON.parse(text);
      if (
        !Array.isArray(questions) ||
        questions.length === 0 ||
        !questions[0].text ||
        !questions[0].options
      ) {
        throw new Error("Invalid question format");
      }
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      console.error("Raw Gemini response:", text);
      return NextResponse.json(
        { error: "Failed to generate valid questions" },
        { status: 500 }
      );
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { error: "Failed to generate questions: " + error },
      { status: 500 }
    );
  }
}
