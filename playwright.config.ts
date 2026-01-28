import { defineConfig, devices } from '@playwright/test';
import { ENVS } from '@src/utils/constants/envs.enum.js';
import dotenv from 'dotenv';

if (!process.env.CI) dotenv.config({ path: '.env', quiet: true });

dotenv.config({
  path: `./envs-config/${process.env.ENVIRONMENT || ENVS.DEV}.env`,
  quiet: true,
});

export default defineConfig({
  use: {
    timezoneId: 'Etc/UTC',
    headless: !process.env.HEADLESS,
    screenshot: 'only-on-failure',
    baseURL: process.env.WEB_URL,
    trace: process.env.CI ? 'off' : 'retain-on-failure',
    actionTimeout: 25_000,
  },
  testDir: 'tests',
  timeout: 60 * 5 * 1_000 /* 5 min */,
  fullyParallel: true,
  forbidOnly: false,
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}-{projectName}{ext}',
  retries: process.env.CI ? 1 : 0,
  reportSlowTests: null,
  workers: process.env.CI ? 2 : 2,
  projects: [
    {
      name: 'setup',
      testDir: './hooks',
      testMatch: 'auth.setup.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Swag Labs tests',
      testDir: 'tests',
      testMatch: 'tests/**/*.test.ts',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 960 },
      },
    },
  ],
  reporter: [
    ['html', { open: 'never', outputFolder: 'pw-report-html' }],
    ['json', { outputFile: 'pw-report-json/results.json' }],
    ['list'],
  ],
});
