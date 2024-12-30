import { NextRequest, NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";
import {
  PDFDocument,
  StandardFonts,
  rgb,
  PageSizes,
  PDFFont,
  PDFPage,
} from "pdf-lib";

function createDocxSections(resumeContent: string) {
  const sections = resumeContent.split("\n\n");
  const documentChildren: Paragraph[] = [];

  sections.forEach((section) => {
    if (section.startsWith("# ")) {
      documentChildren.push(
        new Paragraph({
          text: section.replace("# ", ""),
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
        })
      );
    } else if (section.startsWith("## ")) {
      documentChildren.push(
        new Paragraph({
          text: section.replace("## ", ""),
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.LEFT,
        })
      );
    } else {
      documentChildren.push(
        new Paragraph({
          children: [new TextRun({ text: section, size: 22 })],
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
  page: PDFPage,
  resumeContent: string,
  font: PDFFont,
  width: number,
  height: number
) {
  const sections = resumeContent.split("\n\n");
  let currentY = height - 100;

  const fontSize = { header1: 16, header2: 14, body: 12 };

  for (const section of sections) {
    let textColor = rgb(0, 0, 0);
    let currentFontSize = fontSize.body;

    if (section.startsWith("# ")) {
      textColor = rgb(0.2, 0.2, 0.2);
      currentFontSize = fontSize.header1;
      page.drawText(section.replace("# ", ""), {
        x: 50,
        y: currentY,
        size: currentFontSize,
        font,
        color: textColor,
      });
      currentY -= currentFontSize * 1.5;
    } else if (section.startsWith("## ")) {
      textColor = rgb(0.1, 0.1, 0.1);
      currentFontSize = fontSize.header2;
      page.drawText(section.replace("## ", ""), {
        x: 50,
        y: currentY,
        size: currentFontSize,
        font,
        color: textColor,
      });
      currentY -= currentFontSize * 1.5;
    } else {
      const lines = wrapText(section, width - 100, font, currentFontSize);
      lines.forEach((line) => {
        page.drawText(line, {
          x: 50,
          y: currentY,
          size: currentFontSize,
          font,
          color: textColor,
        });
        currentY -= currentFontSize * 1.2;
      });
    }
    currentY -= 20;
  }
}

function wrapText(
  text: string,
  maxWidth: number,
  font: PDFFont,
  fontSize: number
): string[] {
  const cleanedText = text.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
  const words = cleanedText.split(" ");
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = `${currentLine} ${word}`;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
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
      const buffer = await Packer.toBuffer(doc);

      return new NextResponse(buffer, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": "attachment; filename=resume.docx",
        },
      });
    } else if (format === "pdf") {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage(PageSizes.A4);
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      await createPdfSections(page, resumeContent, font, width, height);
      const pdfBytes = await pdfDoc.save();

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
  } catch (err) {
    console.error("Error generating resume:", err);
    return NextResponse.json(
      { message: "Failed to generate resume", err },
      { status: 500 }
    );
  }
}
