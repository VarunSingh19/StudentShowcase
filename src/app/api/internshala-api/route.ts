// import { NextResponse } from "next/server";
// import puppeteer from "puppeteer";

// interface Job {
//   id: string;
//   title: string;
//   company: string;
//   location: string;
//   salary?: string;
//   description?: string;
//   requirements?: string[];
//   applicationLink?: string;
//   source: string;
// }

// export async function GET() {
//   try {
//     const jobs = await scrapeJobs();
//     return NextResponse.json(jobs);
//   } catch (error) {
//     console.error("Error scraping jobs:", error);
//     return NextResponse.json({ error: "Error scraping jobs" }, { status: 500 });
//   }
// }

// async function scrapeJobs() {
//   const browser = await puppeteer.launch({
//     headless: true,
//     // Add these options for better compatibility
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//   });
//   const page = await browser.newPage();
//   const jobs: Job[] = [];

//   try {
//     // Scrape Internshala
//     await page.goto("https://internshala.com/internships/", {
//       waitUntil: "networkidle0",
//       timeout: 60000,
//     });
//     const internshalaJobs = await page.evaluate(() => {
//       const jobElements = document.querySelectorAll(".internship_meta");
//       return Array.from(jobElements).map((el, index) => ({
//         id: `internshala-${index}`,
//         title: el.querySelector("h3")?.textContent?.trim() || "Untitled Job",
//         company:
//           el.querySelector(".company_name")?.textContent?.trim() ||
//           "Unknown Company",
//         location:
//           el.querySelector(".location_link")?.textContent?.trim() ||
//           "Not Specified",
//         description: el
//           .querySelector(".internship_other_details")
//           ?.textContent?.trim(),
//         source: "Internshala",
//         applicationLink: el.querySelector("a")?.getAttribute("href") || "",
//       }));
//     });
//     jobs.push(...internshalaJobs);

//     // Scrape Naukri.com
//     await page.goto("https://www.naukri.com/jobs-in-india", {
//       waitUntil: "networkidle0",
//       timeout: 60000,
//     });
//     const naukriJobs = await page.evaluate(() => {
//       const jobElements = document.querySelectorAll(".jobTuple");
//       return Array.from(jobElements).map((el, index) => ({
//         id: `naukri-${index}`,
//         title:
//           el.querySelector(".title")?.textContent?.trim() || "Untitled Job",
//         company:
//           el.querySelector(".companyInfo")?.textContent?.trim() ||
//           "Unknown Company",
//         location:
//           el.querySelector(".location")?.textContent?.trim() || "Not Specified",
//         description: el.querySelector(".job-description")?.textContent?.trim(),
//         source: "Naukri.com",
//         applicationLink: el.querySelector("a")?.getAttribute("href") || "",
//       }));
//     });
//     jobs.push(...naukriJobs);

//     // Scrape LinkedIn Jobs
//     await page.goto("https://www.linkedin.com/jobs/", {
//       waitUntil: "networkidle0",
//       timeout: 60000,
//     });
//     const linkedinJobs = await page.evaluate(() => {
//       const jobElements = document.querySelectorAll(".job-card-container");
//       return Array.from(jobElements).map((el, index) => ({
//         id: `linkedin-${index}`,
//         title:
//           el.querySelector(".job-card-list__title")?.textContent?.trim() ||
//           "Untitled Job",
//         company:
//           el
//             .querySelector(".job-card-container__company-name")
//             ?.textContent?.trim() || "Unknown Company",
//         location:
//           el
//             .querySelector(".job-card-container__metadata-wrapper")
//             ?.textContent?.trim() || "Not Specified",
//         source: "LinkedIn",
//         applicationLink: el.querySelector("a")?.getAttribute("href") || "",
//       }));
//     });
//     jobs.push(...linkedinJobs);
//   } catch (error) {
//     console.error("Error during job scraping:", error);
//   } finally {
//     await browser.close();
//   }

//   return jobs;
// }

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

export async function GET() {
  try {
    const jobs = await scrapeInternshalaJobs();
    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error scraping Internshala jobs:", error);
    return NextResponse.json(
      { error: "Error scraping Internshala jobs" },
      { status: 500 }
    );
  }
}

async function scrapeInternshalaJobs(): Promise<Job[]> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  const jobs: Job[] = [];

  try {
    await page.goto(
      "https://internshala.com/internships/computer-science-internship/",
      {
        waitUntil: "networkidle0",
        timeout: 60000,
      }
    );

    const jobElements = await page.$$eval(".internship_meta", (elements) =>
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
  } catch (error) {
    console.error("Error scraping Internshala jobs:", error);
  } finally {
    await browser.close();
  }

  return jobs;
}
