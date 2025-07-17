import type { Browser, LaunchOptions } from "puppeteer";
import puppeteer from "puppeteer";

class PuppeteerPool {
  private pool: Set<Browser> = new Set();
  private currentInstanceCount: number = 0;
  private maxInstances: number = 5;

  constructor(maxInstances: number = 5) {
    this.maxInstances = maxInstances;
  }

  public async getBrowser(settings: LaunchOptions): Promise<Browser | null> {
    if (this.pool.size < this.maxInstances) {
      this.currentInstanceCount++;

      try {
        const browser = await puppeteer.launch(settings);
        this.pool.add(browser);
        return browser;
      } catch (error) {
        console.error("Failed to launch browser:", error);
        this.currentInstanceCount--;
        throw error;
      }
    } else {
      return null;
    }
  }

  public async closeBrowser(browser: Browser): Promise<void> {
    if (this.pool.has(browser)) {
      await browser.close();
      this.pool.delete(browser);
      this.currentInstanceCount--;
    }
  }
}

export const puppeteerPool = new PuppeteerPool(6);
