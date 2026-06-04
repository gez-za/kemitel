import { defineConfig, devices, ReporterDescription } from "@playwright/test";
import { loadEnv } from "vite";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });
process.env = {
  ...process.env,
  ...loadEnv(!process.env.CI ? "development" : "ci", process.cwd(), "")
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const junitReporter: ReporterDescription = [
  "junit",
  {
    outputFolder: "",
    open: "never"
  }
];
const htmlReporter: ReporterDescription = ["html", { outputFolder: "tests-reports/e2e" }];
export default defineConfig({
  testDir: "./playwright",
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 5 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 3 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? [junitReporter] : [htmlReporter],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  timeout: 120 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.VITE_BASE_URL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "retain-on-failure",
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,
    serviceWorkers: "block",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"]
        // launchOptions: {
        //   executablePath: process.env.CI ? undefined : "/usr/bin/chromium-browser"
        // }
      }
    }

    // {
    //   name: "firefox",
    //   use: {
    //     ...devices["Desktop Firefox"],
    //     launchOptions: {
    //       firefoxUserPrefs: {
    //         "security.warn_submit_secure_to_insecure": false
    //       },
    //       args: ["--disable-web-security"]
    //     },
    //     bypassCSP: true
    //   }
    // }

    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] }
    // }

    /* Test  against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ]

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
