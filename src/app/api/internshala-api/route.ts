import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description?: string;
  requirements?: string[];
  applicationLink?: string;
  source: string;
}

interface PaginatedResponse {
  jobs: Job[];
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");

    const result = await scrapeInternshalaJobs(page);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error scraping Internshala jobs:", error);
    return NextResponse.json(
      { error: "Error scraping Internshala jobs" },
      { status: 500 }
    );
  }
}

async function scrapeInternshalaJobs(
  page: number = 1
): Promise<PaginatedResponse> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const browserPage = await browser.newPage();
  const jobs: Job[] = [];

  try {
    const baseUrl =
      "https://internshala.com/internships/computer-science-internship";
    const url = page === 1 ? baseUrl : `${baseUrl}/page-${page}`;

    await browserPage.goto(url, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    // Check if next page exists
    const hasNextPage = await browserPage.evaluate(() => {
      const nextButton = document.querySelector(".pagination_next");
      return nextButton !== null && !nextButton.classList.contains("disabled");
    });

    // Check total pages number
    const totalPages = await browserPage.evaluate(() => {
      const paginationLinks = Array.from(
        document.querySelectorAll(".pagination li a")
      );
      const pageNumbers = paginationLinks
        .map((link) => parseInt(link.textContent || "0"))
        .filter((num) => !isNaN(num));
      return Math.max(...pageNumbers, 1);
    });

    // Check if there are any jobs on the current page
    const jobElements = await browserPage.$$eval(
      ".internship_meta",
      (elements) =>
        elements.map((el, index) => ({
          id: `internshala-${index}`,
          title: el.querySelector("h3")?.textContent?.trim() || "Untitled Job",
          company:
            el.querySelector(".company_name")?.textContent?.trim() ||
            "Unknown Company",
          location:
            el.querySelector(".locations")?.textContent?.trim() ||
            "Not Specified",
          description: el
            .querySelector(".internship_other_details")
            ?.textContent?.trim(),
          requirements: Array.from(el.querySelectorAll(".status-success")).map(
            (req) => req.textContent?.trim() || ""
          ),
          salary: el.querySelector(".stipend")?.textContent?.trim(),
          applicationLink: el.querySelector("a")?.getAttribute("href") || "",
          source: "Internshala",
        }))
    );

    jobs.push(...jobElements);

    return {
      jobs,
      totalPages,
      currentPage: page,
      hasNextPage,
    };
  } catch (error) {
    console.error("Error scraping Internshala jobs:", error);
    throw error;
  } finally {
    await browser.close();
  }
}
