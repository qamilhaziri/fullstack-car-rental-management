import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "html",

  use: {
  baseURL: process.env.E2E_BASE_URL || "http://localhost:5173",
  trace: "on-first-retry",
  screenshot: "only-on-failure",
  video: "off",
},

  projects: [
  {
    name: "Google Chrome",
    use: {
      ...devices["Desktop Chrome"],
      channel: "chrome",
    },
  },
    ],

  webServer: {
    command: "npm run dev -- --host localhost --port 5173",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
