import { defineConfig, devices, PlaywrightTestConfig, TraceMode, ScreenshotMode, VideoMode } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

const ENV = process.env.ENV || 'uat';
dotenv.config({ path: path.resolve(__dirname, `${ENV}.env`) });

const requiredEnvVars = ['BASE_URL'];
for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    throw new Error(`Variável de ambiente obrigatória ${varName} não está definida para o ambiente ${ENV}`);
  }
}

// Funções para converter string em tipos corretos
function parseTraceMode(value?: string): TraceMode | undefined {
  const valid: TraceMode[] = ['off', 'on', 'on-first-retry', 'retain-on-failure'];
  if (value && valid.includes(value as TraceMode)) return value as TraceMode;
  return undefined;
}

function parseScreenshotMode(value?: string): ScreenshotMode | undefined {
  const valid: ScreenshotMode[] = ['off', 'on', 'only-on-failure'];
  if (value && valid.includes(value as ScreenshotMode)) return value as ScreenshotMode;
  return undefined;
}

function parseVideoMode(value?: string): VideoMode | undefined {
  const valid: VideoMode[] = ['off', 'on', 'retain-on-failure'];
  if (value && valid.includes(value as VideoMode)) return value as VideoMode;
  return undefined;
}

const commonUseOptions: PlaywrightTestConfig['use'] = {
  baseURL: process.env.BASE_URL,
  trace: parseTraceMode(process.env.TRACE) ?? 'off',
  screenshot: parseScreenshotMode(process.env.SCREENSHOT) ?? 'off',
  video: parseVideoMode(process.env.VIDEO) ?? 'off',
  headless: process.env.HEADLESS !== 'false',
  actionTimeout: Number(process.env.ACTION_TIMEOUT) || 15000,
  navigationTimeout: Number(process.env.NAVIGATION_TIMEOUT) || 30000,
};

const isCI = !!process.env.CI;
const retries = isCI ? Number(process.env.RETRIES) || 2 : 0;
const workers = isCI ? 1 : undefined;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries,
  workers,
  reporter: process.env.REPORTER || 'html',
  timeout: Number(process.env.TEST_TIMEOUT) || 60000,
  use: commonUseOptions,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: process.env.TEST_CHROMIUM === 'false' ? [] : undefined,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: process.env.TEST_FIREFOX === 'false' ? [] : undefined,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: process.env.TEST_WEBKIT === 'false' ? [] : undefined,
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
      testMatch: process.env.TEST_MOBILE === 'false' ? [] : undefined,
    },
  ],
});
