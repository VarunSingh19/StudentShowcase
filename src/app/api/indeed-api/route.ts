import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description?: string;
  applicationLink: string;
  source: string;
  postedAt?: string;
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

    const result = await scrapeIndeedJobs(page);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error scraping Indeed jobs:", error);
    return NextResponse.json(
      { error: "Error scraping Indeed jobs" },
      { status: 500 }
    );
  }
}

async function scrapeIndeedJobs(page: number = 1): Promise<PaginatedResponse> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--window-size=1920x1080",
    ],
  });

  const browserPage = await browser.newPage();
  const jobs: Job[] = [];

  try {
    await browserPage.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    await browserPage.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
    });

    const baseUrl =
      "https://in.indeed.com/jobs?q=developer&l=Mumbai%2C+Maharashtra";
    const startIndex = (page - 1) * 10;
    const url = page === 1 ? baseUrl : `${baseUrl}&start=${startIndex}`;

    await browserPage.goto(url, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    await browserPage.waitForFunction(
      () => {
        const jobCards = document.querySelectorAll(
          '[class*="job_seen_beacon"], [class*="cardOutline"], .job-card'
        );
        return jobCards.length > 0;
      },
      { timeout: 30000 }
    );

    const totalJobs = await browserPage.evaluate(() => {
      const countText =
        document.querySelector("#searchCountPages")?.textContent?.trim() ||
        document
          .querySelector(".jobsearch-JobCountAndSortPane-jobCount")
          ?.textContent?.trim();
      if (countText) {
        const matches = countText.match(/\d+/g);
        return matches ? parseInt(matches[matches.length - 1]) : 0;
      }
      return 0;
    });

    const hasNextPage = await browserPage.evaluate(() => {
      return !!document.querySelector(
        '[aria-label="Next Page"], [data-testid="pagination-page-next"]'
      );
    });

    const totalPages = Math.ceil(totalJobs / 10) || 1;

    const indeedJobs = await browserPage.evaluate(() => {
      const jobElements = document.querySelectorAll(
        '[class*="job_seen_beacon"], [class*="cardOutline"], .job-card'
      );

      return Array.from(jobElements).map((el) => {
        const titleElement = el.querySelector(
          '[class*="jobTitle"], [class*="title"], h2.jobTitle a'
        );
        const linkElement =
          titleElement?.closest("a") || (titleElement as HTMLAnchorElement);

        const cardElement = el.closest('[class*="mosaic-provider-jobcards"]');
        const jobId =
          cardElement?.getAttribute("data-jk") ||
          linkElement?.href?.split("jk=")[1]?.split("&")[0] ||
          Math.random().toString();

        // const baseUrl = "https://in.indeed.com/viewjob?jk=";
        const joblink = el.querySelector("h2.jobTitle a") as HTMLAnchorElement;
        const link = joblink?.href || "";
        const applicationLink = link;

        const salaryElement = el.querySelector(
          '[class*="salary"], [class*="metadata salary-snippet"], [class*="estimated-salary"]'
        );
        const dateElement = el.querySelector(
          '[class*="date"], [class*="posted-date"], .result-footer .date'
        );
        const companyElement = el.querySelector(
          '[data-testid="company-name"], [class*="companyName"], .company'
        );
        const locationElement = el.querySelector(
          '[data-testid="text-location"], [class*="companyLocation"], .location'
        );
        const snippetElement = el.querySelector(
          '.job-snippet, [class*="job-snippet"], [class*="summary"]'
        );

        return {
          id: `indeed-${jobId}`,
          title: titleElement?.textContent?.trim() || "Untitled Position",
          company: companyElement?.textContent?.trim() || "Company Not Listed",
          location:
            locationElement?.textContent?.trim() || "Location Not Specified",
          salary: salaryElement?.textContent?.trim() || undefined,
          description: snippetElement?.textContent?.trim() || undefined,
          applicationLink: applicationLink,
          source: "Indeed",
          postedAt: dateElement?.textContent?.trim() || undefined,
        };
      });
    });

    jobs.push(...indeedJobs);

    return {
      jobs,
      totalPages,
      currentPage: page,
      hasNextPage,
    };
  } catch (error) {
    console.error("Error during scraping:", error);
    throw error;
  } finally {
    await browser.close();
  }
}
