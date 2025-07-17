/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    globals: true,
    browser: {
      provider: "playwright",
      headless: true,
      enabled: true,
      instances: [
        {
          browser: "chromium",
        },
      ],
    },
  },
});
