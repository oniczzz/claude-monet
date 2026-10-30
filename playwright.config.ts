import { defineConfig } from '@playwright/test'

// Use a matching build: npm run build -- --base=/ for the local-root check.
// GitHub Actions keeps the default GitHub Pages base and all browser checks.
const basePath = process.env.PLAYWRIGHT_ROOT_BASE === '1' ? '/' : '/claude-monet/'
const baseURL = `http://127.0.0.1:4173${basePath}`

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH } : undefined,
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort --base=${basePath}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
})
