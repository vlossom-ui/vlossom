import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './src',
    testMatch: '**/__e2e__/**/*.e2e.ts',
    fullyParallel: false,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 2 : 0,
    workers: 1,
    reporter: 'line',
    use: {
        baseURL: 'http://127.0.0.1:4174',
        trace: 'retain-on-failure',
        ...devices['Desktop Chrome'],
    },
    webServer: {
        command: 'pnpm dev:e2e',
        url: 'http://127.0.0.1:4174',
        reuseExistingServer: !process.env.CI,
    },
});
