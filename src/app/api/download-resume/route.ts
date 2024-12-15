import { NextRequest, NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";
import { PDFDocument, StandardFonts, rgb, PageSizes, drawText } from "pdf-lib";

// Helper function to create sections for DOCX
function createDocxSections(resumeContent: string) {
  // Split the resume content into sections
  const sections = resumeContent.split("\n\n");

  const documentChildren: any[] = [];

  sections.forEach((section) => {
    // Check if the section is a header
    if (section.startsWith("# ")) {
      documentChildren.push(
        new Paragraph({
          text: section.replace("# ", ""),
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          style: "Header1",
        })
      );
    }
    // Check if the section is a subheader
    else if (section.startsWith("## ")) {
      documentChildren.push(
        new Paragraph({
          text: section.replace("## ", ""),
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.LEFT,
          style: "Header2",
        })
      );
    }
    // Regular content
    else {
      documentChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: section,
              size: 22,
            }),
          ],
        })
      );
    }
  });

  return {
    sections: [
      {
        children: documentChildren,
      },
    ],
  };
}

// Helper function to create PDF sections
async function createPdfSections(
  page: any,
  resumeContent: string,
  font: any,
  width: number,
  height: number
) {
  const sections = resumeContent.split("\n\n");
  let currentY = height - 100; // Start from top with some margin

  const fontSize = {
    header1: 16,
    header2: 14,
    body: 12,
  };

  for (const section of sections) {
    let textColor = rgb(0, 0, 0); // Default black
    let currentFontSize = fontSize.body;

    // Handle headers
    if (section.startsWith("# ")) {
      textColor = rgb(0.2, 0.2, 0.2); // Slightly darker for headers
      currentFontSize = fontSize.header1;

      page.drawText(section.replace("# ", ""), {
        x: 50,
        y: currentY,
        size: currentFontSize,
        font: font,
        color: textColor,
        alignment: "center",
      });
      currentY -= currentFontSize * 1.5;
    }
    // Subheaders
    else if (section.startsWith("## ")) {
      textColor = rgb(0.1, 0.1, 0.1);
      currentFontSize = fontSize.header2;

      page.drawText(section.replace("## ", ""), {
        x: 50,
        y: currentY,
        size: currentFontSize,
        font: font,
        color: textColor,
      });
      currentY -= currentFontSize * 1.5;
    }
    // Regular content
    else {
      // Wrap text if it's too long
      const maxWidth = width - 100; // Leave margins
      const lines = wrapText(section, maxWidth, font, currentFontSize);

      lines.forEach((line) => {
        page.drawText(line, {
          x: 50,
          y: currentY,
          size: currentFontSize,
          font: font,
          color: textColor,
        });
        currentY -= currentFontSize * 1.2;
      });
    }

    // Add some space between sections
    currentY -= 20;
  }
}

function wrapText(
  text: string,
  maxWidth: number,
  font: any,
  fontSize: number
): string[] {
  // Remove newline characters and replace consecutive whitespaces
  const cleanedText = text.replace(/\n/g, " ").replace(/\s+/g, " ").trim();

  const words = cleanedText.split(" ");
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine + " " + word;

    try {
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    } catch (error) {
      // Fallback if width calculation fails
      lines.push(currentLine);
      currentLine = word;
    }
  }

  // Add the last line
  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

export async function POST(req: NextRequest) {
  try {
    const { resumeContent, format } = await req.json();

    if (!resumeContent || !format) {
      return NextResponse.json(
        { message: "Missing resumeContent or format" },
        { status: 400 }
      );
    }

    if (format === "docx") {
      const doc = new Document(createDocxSections(resumeContent));

      // Generate the DOCX file
      const buffer = await Packer.toBuffer(doc);

      return new NextResponse(buffer, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": "attachment; filename=resume.docx",
        },
      });
    } else if (format === "pdf") {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage(PageSizes.A4);
      const { width, height } = page.getSize();

      // Get a font
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Draw formatted text on the page
      await createPdfSections(page, resumeContent, font, width, height);

      // Serialize the PDFDocument to bytes
      const pdfBytes = await pdfDoc.save();

      // Return PDF
      return new NextResponse(Buffer.from(pdfBytes), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=resume.pdf",
        },
      });
    } else {
      return NextResponse.json(
        { message: "Invalid format. Use pdf or docx." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error generating resume:", error);
    return NextResponse.json(
      {
        message: "Failed to generate resume",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
