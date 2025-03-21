import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

interface ProjectPlan {
  technicalRequirements: string[];
  developmentPhases: string[];
  featuresList: string[];
  deploymentSteps: string[];
  githubRepositories: string[];
  resourceLinks: string[];
}

export async function generateProjectPlan(
  taskTitle: string
): Promise<ProjectPlan> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `
    Generate a comprehensive project implementation plan for the following task: "${taskTitle}"
    
    The plan should include:
    1. Technical requirements (tools, frameworks, and technologies)
    2. Development phases (breaking the project into manageable milestones)
    3. Features list (key functionalities of the project)
    4. Deployment steps (guidance on hosting and making the project live)
    5. Three similar GitHub repositories (provide links) based on the ${taskTitle}
    6. Resource links based on the ${taskTitle} (documentation, tutorials, or courses essential for building the project)

    Please format the response as a valid JSON object with the following structure:
    {
      "technicalRequirements": [],
      "developmentPhases": [],
      "featuresList": [],
      "deploymentSteps": [],
      "githubRepositories": [],
      "resourceLinks": []
    }
    Ensure that all array items are strings and that the entire response is a valid JSON object.
    Do not include any markdown formatting or code block syntax in your response.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Remove any markdown formatting or code block syntax
    const cleanedText = text.replace(/```json\s*|\s*```/g, "").trim();

    // Attempt to parse the JSON response
    try {
      const jsonResponse = JSON.parse(cleanedText);

      // Validate the structure of the parsed JSON
      const validatedResponse: ProjectPlan = {
        technicalRequirements: Array.isArray(jsonResponse.technicalRequirements)
          ? jsonResponse.technicalRequirements
          : [],
        developmentPhases: Array.isArray(jsonResponse.developmentPhases)
          ? jsonResponse.developmentPhases
          : [],
        featuresList: Array.isArray(jsonResponse.featuresList)
          ? jsonResponse.featuresList
          : [],
        deploymentSteps: Array.isArray(jsonResponse.deploymentSteps)
          ? jsonResponse.deploymentSteps
          : [],
        githubRepositories: Array.isArray(jsonResponse.githubRepositories)
          ? jsonResponse.githubRepositories
          : [],
        resourceLinks: Array.isArray(jsonResponse.resourceLinks)
          ? jsonResponse.resourceLinks
          : [],
      };

      return validatedResponse;
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      console.log("Raw AI response:", cleanedText);

      // If parsing fails, attempt to extract information from the text response
      const extractedPlan = extractProjectPlanFromText(cleanedText);
      return extractedPlan;
    }
  } catch (error) {
    console.error("Failed to generate AI response:", error);
    throw new Error("Failed to generate project plan");
  }
}

function extractProjectPlanFromText(text: string): ProjectPlan {
  const sections = [
    "technicalRequirements",
    "developmentPhases",
    "featuresList",
    "deploymentSteps",
    "githubRepositories",
    "resourceLinks",
  ];

  const extractedPlan: ProjectPlan = {
    technicalRequirements: [],
    developmentPhases: [],
    featuresList: [],
    deploymentSteps: [],
    githubRepositories: [],
    resourceLinks: [],
  };

  let currentSection = "";

  text.split("\n").forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine) {
      const sectionMatch = sections.find((section) =>
        trimmedLine.toLowerCase().includes(section.toLowerCase())
      );

      if (sectionMatch) {
        currentSection = sectionMatch;
      } else if (
        currentSection &&
        (trimmedLine.startsWith("-") || trimmedLine.startsWith("*"))
      ) {
        extractedPlan[currentSection as keyof ProjectPlan].push(
          trimmedLine.slice(1).trim()
        );
      }
    }
  });

  return extractedPlan;
}
