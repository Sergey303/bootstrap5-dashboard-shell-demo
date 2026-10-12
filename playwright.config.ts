import { existsSync } from "node:fs";
import { defineConfig, firefox, webkit } from "@playwright/test";

const fullBrowserMatrix = process.env.FULL_BROWSER_MATRIX === "true";
const optionalBrowsers = [
  { name: "firefox" as const, browser: firefox },
  { name: "webkit" as const, browser: webkit },
];

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    ...optionalBrowsers
      .filter(({ browser }) => fullBrowserMatrix && existsSync(browser.executablePath()))
      .map(({ name }) => ({ name, use: { browserName: name } })),
  ],
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
  },
});
