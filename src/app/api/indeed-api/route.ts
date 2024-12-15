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

export async function GET() {
  try {
    const jobs = await scrapeIndeedJobs();
    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error scraping Indeed jobs:", error);
    return NextResponse.json(
      { error: "Error scraping Indeed jobs" },
      { status: 500 }
    );
  }
}

async function scrapeIndeedJobs(): Promise<Job[]> {
  const browser = await puppeteer.launch({
    headless: true, // Changed from "new" to true
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  const jobs: Job[] = [];

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    await page.goto(
      "https://in.indeed.com/jobs?q=developer&l=Mumbai%2C+Maharashtra",
      {
        waitUntil: "networkidle0",
        timeout: 60000,
      }
    );

    await page.waitForSelector(".job_seen_beacon", { timeout: 30000 });

    const indeedJobs = await page.evaluate(() => {
      const jobElements = document.querySelectorAll(".job_seen_beacon");

      return Array.from(jobElements).map((el) => {
        const linkElement = el.querySelector(
          "h2.jobTitle a"
        ) as HTMLAnchorElement;
        const link = linkElement?.href || "";
        const id =
          link.split("jk=")[1]?.split("&")[0] || Math.random().toString();

        const salaryElement = el.querySelector(
          '[class*="metadata salary-snippet"]'
        );
        const dateElement = el.querySelector('[class*="date"]');

        return {
          id: `indeed-${id}`,
          title: linkElement?.textContent?.trim() || "Untitled Position",
          company:
            el
              .querySelector('[data-testid="company-name"]')
              ?.textContent?.trim() || "Company Not Listed",
          location:
            el
              .querySelector('[data-testid="text-location"]')
              ?.textContent?.trim() || "Location Not Specified",
          salary: salaryElement?.textContent?.trim() || undefined,
          description:
            el.querySelector(".job-snippet")?.textContent?.trim() || undefined,
          applicationLink: link,
          source: "Indeed",
          postedAt: dateElement?.textContent?.trim() || undefined,
        };
      });
    });

    jobs.push(...indeedJobs);
  } catch (error) {
    console.error("Error during scraping:", error);
    throw error;
  } finally {
    await browser.close();
  }

  return jobs;
}
