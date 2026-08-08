import { defineConfig, devices } from "@playwright/test";

const APP_PORT = Number(process.env.E2E_PORT ?? 3100);
const MOCK_PORT = Number(process.env.MOCK_SUPABASE_PORT ?? 54321);

const APP_URL = `http://127.0.0.1:${APP_PORT}`;
const MOCK_URL = `http://127.0.0.1:${MOCK_PORT}`;

/**
 * The suite runs the real app against `tests/mock-supabase.mjs` instead of a
 * live Supabase project, so it needs no credentials and no network.
 *
 * Sandboxes that ship their own Chromium can point at it with
 * PLAYWRIGHT_CHROMIUM_PATH; everyone else gets the browser Playwright
 * installed via `npx playwright install chromium`.
 */
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "list" : [["list"], ["html", { open: "never" }]],
  timeout: 45_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: APP_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(executablePath ? { launchOptions: { executablePath } } : {}),
      },
    },
  ],

  webServer: [
    {
      command: "node tests/mock-supabase.mjs",
      url: `${MOCK_URL}/__health`,
      reuseExistingServer: !process.env.CI,
      stdout: "ignore",
    },
    {
      command: `npm run build && npx next start --port ${APP_PORT}`,
      url: APP_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
      stdout: "ignore",
      env: {
        NEXT_PUBLIC_SUPABASE_URL: MOCK_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
      },
    },
  ],
});
