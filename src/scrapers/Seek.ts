import type { JobPosting } from "./types";
import { puppeteerPool } from "./utils";

const SEEK_WEBSITE_URL = "https://www.seek.com.au";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Trailer/93.3.8652.5";

function getSEEKJobNameQuery(jobName: string): string {
  return encodeURIComponent(jobName.trim().toLowerCase().replace(/s+/g, "-"));
}

export default async function (jobName: string): Promise<JobPosting[]> {
  const browser = await puppeteerPool.getBrowser({
    headless: true,
  });

  if (!browser) {
    throw new Error("Failed to get a browser instance from the pool.");
  }

  const page = await browser.newPage();
  await page.setUserAgent(USER_AGENT);

  await page.goto(
    SEEK_WEBSITE_URL +
      `/${getSEEKJobNameQuery(jobName)}-jobs/in-Sydney-NSW-2000`,
    {
      waitUntil: "domcontentloaded",
    },
  );

  const job_titles = await page.$$eval(
    "[data-testid=job-card-title]",
    (elements) => {
      return elements.map((e) => e.textContent ?? "");
    },
  );
  const job_links = await page.$$eval(
    "[data-testid=job-card-title]",
    (elements) => {
      return elements.map((e) => e.getAttribute("href") ?? "");
    },
  );
  const job_companies = await page.$$eval(
    "[data-automation=jobCompany]",
    (elements) => {
      return elements.map((e) => e.textContent ?? "");
    },
  );
  const job_locations = await page.$$eval(
    "[data-automation=jobLocation]",
    (elements) => {
      return elements.map((e) => e.textContent ?? "");
    },
  );

  const result = job_titles.map((job_title, i) => {
    return {
      title: job_title,
      link: SEEK_WEBSITE_URL + job_links[i],
      company: job_companies[i],
      location: job_locations[i],
    };
  });

  await puppeteerPool.closeBrowser(browser);
  return result;
}
