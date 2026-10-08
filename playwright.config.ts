import { defineConfig } from '@playwright/test';

const PORT = 3200;

/**
 * Runs against a production build (`npm test` builds first). JavaScript is off
 * by default: the tests check the HTML a crawler receives, not the hydrated page.
 */
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    javaScriptEnabled: false,
  },
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/robots.txt`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
