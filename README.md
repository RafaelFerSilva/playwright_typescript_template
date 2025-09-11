# Playwright / Typescript Template

Ultimamente venho trabalhando em um projeto de automação de testes end-to-end utilizando **Playwright** com **TypeScript**.

O objetivo é um template para automação de testes que sirva como base para projetos escaláveis e reutilizáveis.

Compartilho aqui os passos dessa evolução — desde um setup inicial até a construção de uma arquitetura robusta, baseada em **Ports & Adapters**, que suporta tanto **Page Object Model (POM)** quanto o padrão **Screenplay**.

Ao final temos uma explicação detalhada sobre cada componente e sua função no template. O template abrange Screenplay e Page Object Model, o objetivo e deixar a cargo do time escolher qual padrão seguir.

## Inicializar um projeto

- Vamos iniciar criando uma pasta para nosso projeto.
    
    ```yaml
    ~/Documents/playwright_typescript_template
    ```
    

- O playwright tem um comando que já realiza a configuração básica de um projeto.
    - No nosso caso selecionamos para utilizar typescript.

[Installation | Playwright](https://playwright.dev/docs/intro#installing-playwright)

```bash
npm init playwright@latest
```

Ao final teremos a estrutura do projeto pronta contendo exemplo e no terminal uma mensagem similar a abaixo.

---

## Executando os primeiros testes

Ao final da configuração do projeto temos uma mensagem similar a que temos abaixo exibida no terminal.

✔ Success! Created a Playwright Test project at /home/rafael/Documents/playwright_code_base

Inside that directory, you can run several commands:

```bash
npx playwright test
	Runs the end-to-end tests.

npx playwright test --ui
	Starts the interactive UI mode.

npx playwright test --project=chromium
	Runs the tests only on Desktop Chrome.

npx playwright test example
	Runs the tests in a specific file.

npx playwright test --debug
	Runs the tests in debug mode.

npx playwright codegen
	Auto generate tests with Codegen.
```

We suggest that you begin by typing:

```bash
npx playwright test
```

And check out the following files:

- ./tests/example.spec.ts - Example end-to-end test
- ./tests-examples/demo-todo-app.spec.ts - Demo Todo App end-to-end tests
- ./playwright.config.ts - Playwright Test configuration

Visit https://playwright.dev/docs/intro for more information.

Podemos utilizar os comandos acima para executar alguns exemplos de testes.

A sugestão é iniciar com o comando:

```bash
npx playwright test
```

E depois da execução ver o report com:

```bash
npx playwright show-report
```

O arquivo de teste em questão esta na seguinte pasta:

```bash
tests/example.spec.ts
```

São basicamente dois testes.

```bash
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

```

Podemos ver no report que são executados por 3 tipos de navegadores


Se deseja executar os testes em um único navegador podemos utilizar um comando como o abaixo. A flag — headed indica que desejamos ver a execução do testes, por default o framework executa em headless mode.

```bash
npx playwright test --project=chromium --headed
```

Para facilitar nossa execução podemos criar um script no package.json para excecutar este comando acima:

```json
{
  "name": "playwright_code_base",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "npx playwright test --project=chromium --headed"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "devDependencies": {
    "@playwright/test": "^1.55.0",
    "@types/node": "^24.3.0"
  }
}

```

Agora quando executarmos o alias abaixo o comando será executado.

```bash
npm run test
```

---

## Configuração do framework

O framework dispoem de um arquivo de configuração **playwright.config.ts** onde temos vários recursos dispóníveis para configuração do projeto, desde execução até baseUrl e reports.

[Test configuration | Playwright](https://playwright.dev/docs/test-configuration)

Podemos observar na documentação que temos inúmeras opções de configurações que podem ser aplicadas:

[Test use options | Playwright](https://playwright.dev/docs/test-use-options)

Darei destaque aqui a duas: **screenshot** e **headless.**

Podemos configurar para salvar screenshots de forma automática e podemos também configurar para estar ou não em headless mode

```tsx
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-conf  iguration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    // Capture screenshot after each test failure.
    screenshot: 'only-on-failure',

    // Run browser in headless mode.
    headless: false,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
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
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

```

No nosso caso como colocar headless para false podemos remover a tag —headed do nosso script

**package.json**

```tsx
{
  "name": "playwright_code_base",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "npx playwright test --project=chromium"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "devDependencies": {
    "@playwright/test": "^1.55.0",
    "@types/node": "^24.3.0"
  }
}
```

Em relação ao screenshot podemos fazer o seguinte: 
Vá até o arquivo de teste e faça uma alteração para que um dos testes falhe, exemplo adicionar um letra a mais na validação de texto:

```tsx
test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installationn' })).toBeVisible();
});
```

Agora se executarmos os testes deixando a linha da configuração do screenshot  comentada veremos que terá uma falha mais sem screenshot. Se executarmos novamente descomentando a linha vemos que teremos o screenshot com o erro em questão.

## Emuladores

Podemos configurar para executarmos testes emulando devices como mobile por exemplo:

```tsx
 {
      name: 'Mobile',
      use: { ...devices['iPhone 12'] },
    },
```

**playwright.config.ts**

```tsx
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-conf  iguration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    // Capture screenshot after each test failure.
    // screenshot: 'only-on-failure',

    // Run browser in headless mode.
    headless: false,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    {
      name: 'Mobile',
      use: { ...devices['iPhone 12'] },
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

```

Para execução faremos algo como:

```bash
npx playwright test --project=Mobile
```

---

## Environments

Para controlar variáveis de ambientes podemos utilizar recursos como o dotenv:

[npm: dotenv](https://www.npmjs.com/package/dotenv)

```bash
npm i dotenv
```

Podemos criar ambientes distintos para executar testes em cada um deles conforme a necessidade do projeto. Para ter um ambiente de teste como uat “user acceptence tests”, rc “release current” ou mesmo em prd “production”.

Nosso arquivo de configurações já vem com o dotenv basicamente configurado. O que faremos primeiro é criar os arquivos .env para cada ambiente, no caso seriam uat.env e rc.env.

**uat.env**

```bash
BASE_URL=https://test-automation-practice.com.br/
```

**rc.env**

```bash
BASE_URL=https://test-automation-practice.com.br/
```

Neste momento teremos apenas a base url que utilizaremos para alguns de nosso exemplos.

Agora vamos atualizar nosso arquivo de configuração para ler os arquivos de variáveis de ambiente e setar a base URL vindo dos arquivos, um detalhe é que deixaremos uat como ambiente padrão.

**playwright.config.ts**

```tsx
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';

// Define o ambiente padrão como 'uat' caso não seja passado
const env = process.env.ENV || 'uat';

dotenv.config({ path: path.resolve(__dirname, `${env}.env`) });

/**
 * See https://playwright.dev/docs/test-conf  iguration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: false,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    {
      name: 'Mobile',
      use: { ...devices['iPhone 12'] },
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

```

Agora para executar cada ambiente precisamos passar a variável ENV desejada. O comando de execução dos testes ficaria da seguinte forma:

```bash
ENV=rc npx playwright test --project=chromium
```

Podemos atualizar o package.json para facilitar a execução utilizando criando um script para executar RC dado que UAT é o default.

**package.json**

```tsx
{
  "name": "playwright_code_base",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "npx playwright test --project=chromium",
    "test:rc": "ENV=rc npx playwright test --project=chromium",
    "report": "npx playwright show-report",
    "debug": "npx playwright test --debug --project=chromium"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "devDependencies": {
    "@playwright/test": "^1.55.0",
    "@types/node": "^24.3.0"
  },
  "dependencies": {
    "dotenv": "^17.2.1"
  }
}
```

Se executar o teste em rc verá no terminal que estaremos utilizando o arquivo rc.env

```bash
npm run test:rc
```

---

### Otimizando a configuração

Vamos começar instalando o cross env para facilitar a execução em vários OS.

```bash
npm install --save-dev cross-env
```

Nós implementaremos uma configuração onde podemos controlar muitas coisas via variáveis de ambiente. Nosso arquivo .env será algo similar a este aqui

**uat.env**

```yaml
BASE_URL=https://uat.seusite.com
HEADLESS=false
TRACE=on
SCREENSHOT=on-failure
VIDEO=off
ACTION_TIMEOUT=15000
NAVIGATION_TIMEOUT=30000
TEST_TIMEOUT=60000
RETRIES=1
REPORTER=html
TEST_CHROMIUM=true
TEST_FIREFOX=false
TEST_WEBKIT=false
TEST_MOBILE=false
```

Agora vamos atualizar nosso arquivo de configuração para utilizar as variaveis de ambiente.

**playwright.config.ts**

```jsx
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
```

Agora temos o controle alterando os valores das variáveis de ambiente.

---

## Configurações tsconfig

Na raiz do projeto crie o arquivo tsconfig.json, ele será responsável pela configuração geral do projeto

**tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",                          // Moderno, compatível com Node.js e navegadores atuais
    "module": "CommonJS",                        // Compatível com Node.js (Playwright roda em Node)
    "lib": ["ES2020", "DOM"],                    // Suporte a APIs modernas e DOM para testes web
    "strict": true,                              // Ativa todas as verificações estritas do TS para qualidade
    "moduleResolution": "node",                  // Resolve módulos no estilo Node.js
    "esModuleInterop": true,                      // Facilita importações de módulos CommonJS
    "skipLibCheck": true,                         // Ignora checagem de tipos em libs para acelerar build
    "forceConsistentCasingInFileNames": true,    // Evita problemas de case sensitivity em sistemas diferentes
    "types": ["@playwright/test", "node"],       // Tipos essenciais para Playwright e Node.js
    "outDir": "dist",                             // Saída compilada
    "rootDir": ".",                               // Raiz do projeto
    "noImplicitAny": true,                        // Evita any implícito para maior segurança
    "noUnusedLocals": true,                        // Erros para variáveis locais não usadas
    "noUnusedParameters": true,                    // Erros para parâmetros não usados
    "noFallthroughCasesInSwitch": true,           // Evita fallthrough em switch
    "resolveJsonModule": true,                     // Permite importar JSON como módulo
    "allowSyntheticDefaultImports": true,         // Permite import default sintético para compatibilidade
    "incremental": true                            // Compilação incremental para builds mais rápidos
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

Na pasta de teste crie outro tsconfig.json. Este tem configurações específicas de teste.

**tests/tsconfig.json**

```tsx
{
  "compilerOptions": {
    "target": "ES2020", // Código moderno compatível com Node e navegadores atuais
    "module": "CommonJS", // Módulos para Node.js (Playwright roda em Node)
    "lib": ["ES2020", "DOM"], // Suporte a APIs modernas e DOM para testes web
    "strict": true, // Ativa todas as verificações estritas do TS
    "moduleResolution": "node", // Resolve módulos no estilo Node.js
    "esModuleInterop": true, // Facilita importações de módulos CommonJS
    "skipLibCheck": true, // Ignora checagem de tipos em libs para acelerar build
    "forceConsistentCasingInFileNames": true, // Evita problemas de case sensitivity
    "types": ["@playwright/test", "node"], // Tipos essenciais para Playwright e Node.js
    "outDir": "../dist/tests", // Saída compilada dos testes
    "rootDir": ".", // Raiz dos testes
    "noImplicitAny": true, // Evita any implícito
    "noUnusedLocals": true, // Erros para variáveis locais não usadas
    "noUnusedParameters": true, // Erros para parâmetros não usados
    "noFallthroughCasesInSwitch": true, // Evita fallthrough em switch
    "resolveJsonModule": true, // Permite importar JSON como módulo
    "allowSyntheticDefaultImports": true, // Permite import default sintético
    "incremental": true, // Compilação incremental para builds mais rápidos
    "baseUrl": ".", // Base para paths relativos
    "paths": {
      // Exemplo de alias para facilitar importações
      "@pages/*": ["pages/*"],
      "@utils/*": ["utils/*"],
      "@screenplay/*": ["screenplay/*"],
      "@fixtures/*": ["fixtures/*"]
    }
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "../dist", "../out"]
}

```

### Vamos atualizar nosso package com alguns scripts

Atualize seu package json adicionando scripts para lint e format

**package.json**

```json
{
  "name": "playwright_screenplay_pageobject_template",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "pretest": "tsc --incremental -p tests/tsconfig.json",
    "test": "playwright test",
    "test:uat": "cross-env ENV=uat npx playwright test",
    "test:rc": "cross-env ENV=rc npx playwright test",
    "test:ci": "HEADLESS=true npx playwright test",
    "report": "npx playwright show-report",
    "debug": "npx playwright test --debug --project=chromium"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "devDependencies": {
    "@playwright/test": "^1.55.0",
    "@types/node": "^24.3.1"
  },
  "dependencies": {
    "dotenv": "^17.2.2"
  }
}

```

---

# Iniciando o projeto de automação

Agora que temos uma base para nosso projeto vamos começar a automatizar uma aplicação (site) e assim conforme as necessidade vão surgindo nós vamos evoluindo nosso projeto.

Vamos começar atualizando o teste que veio de exemplo com a instalação do playwright para usarmos a nossa base url e acessar o site que vamos automatizar: 

[Test Automation Practice](https://test-automation-practice.com.br/)

**uat.env**

```tsx
BASE_URL=https://test-automation-practice.com.br/
HEADLESS=false
TRACE=on
SCREENSHOT=on-failure
VIDEO=off
ACTION_TIMEOUT=15000
NAVIGATION_TIMEOUT=30000
TEST_TIMEOUT=60000
RETRIES=1
REPORTER=html
TEST_CHROMIUM=true
TEST_FIREFOX=false
TEST_WEBKIT=false
TEST_MOBILE=false
```

Podemos deletar a pasta tests-examples.

Atualizamos o arquivo da pasta tests para:

**tests/home.spec.ts**

```tsx
import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  })

  test('Should Be Possible Access Home Page', async ({ page }) => {
    await expect(page.getByTestId('hero-title')).toBeVisible();
  });
});

```

O que temos em nosso teste é basicamente:

- beforeEach → Um hook que executa antes de cada teste e acessa a base url do projeto.
- await expect(page.getByTestId('hero-title')).toBeVisible(); → Validação de um elemento na página.

Existem alguns padrões de projeto que podemos utilizar para criar automações de forma escalável. Iremos implementar dois destes aqui, Page Object e Screen Play. Iremos utilizar este nosso teste para exemplificar como ficaria em cada padrão.

---

## Padrão Page Object

### O que é?

O **Page Object** é um padrão que encapsula a interação com uma página ou componente da aplicação em uma classe. Isso promove reutilização, organização e manutenção do código de testes.

### Estrutura

- Uma classe para cada página ou componente.
- Métodos que representam ações e verificações na página.
- O teste usa essa classe para interagir com a página.

---

### Exemplo com Page Object

Com o objetivo de deixa o projeto mais organizado nós vamos criar um nova estrutura para ele. Criaremos uma pasta src na raiz do projeto e dentro dela estaremos colocando toda a implementação do nosso framework. Iniciaremos com a página HomePage.ts

### 1. Criar o arquivo de page para home

Este é o arquivo referente a página home do site, seguindo o conceite de page object ele é responsável por todas as interações com a home page

**src/adapters/pages/HomePage.ts**

```tsx
import { Page, expect } from "@playwright/test";

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string = "/"): Promise<void> {
    await this.page.goto(url);
  }

  async expectHeroTitleVisible(title: string): Promise<void> {
    await expect(this.page.getByTestId("hero-title")).toHaveText(title);
  }
}
```

### 2. Criar um arquivo de teste para utilizar page object

Este é o arquivo de teste da home onde utilizamos o arquivo de page.

**tests/PageObject/home.spec.ts**

```tsx
import { test } from "@playwright/test";
import { HomePage } from "@pages/HomePage";

test.describe("Home Page Tests - Page Object", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test("should navigate to the home page and verify hero title", async () => {
    await homePage.goto();
    await homePage.expectHeroTitleVisible("Test Automation Practice");
  });
});
```

### 3. No configuração de pastas

Dado que temos um nova configuração separando o framework dos testes vamos precisar atualizar também os arquivos tsconfig.json.

Arquivo da raiz do projeto:

**tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["@playwright/test", "node"],
    "outDir": "dist",
    "rootDir": "./",
    "baseUrl": ".",
    "paths": {
      "@framework/*": ["src/*"],
      "@pages/*": ["src/adapters/pages/*"],
      "@utils/*": ["src/utils/*"],
      "@screenplay/*": ["src/screenplay/*"]
    }
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "tests"]
}

```

Arquivo da pasta de testes:

**tests/tsconfig.json**

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "../dist/tests",
    "rootDir": "../",
    "baseUrl": "../",
    "paths": {
      "@framework/*": ["src/*"],
      "@pages/*": ["src/adapters/pages/*"],
      "@utils/*": ["src/utils/*"],
      "@screenplay/*": ["src/screenplay/*"],
      "@tests/*": ["tests/*"],
      "@fixtures/*": ["tests/fixtures/*"]
    }
  },
  "include": [
    "../src/**/*.ts",
    "**/*.ts"
  ],
  "exclude": ["node_modules", "../dist"]
}
```

Agora ao executar os testes vemos que mesmo com a nova estrutura tudo funciona conforme esperado.

```bash
npm run test
```

---

## Padrão Screenplay

### O que é?

O **Screenplay** é um padrão mais avançado e flexível que modela testes como interações entre **atores** e **tarefas**. Cada ator pode realizar tarefas e fazer perguntas (assertivas). Isso facilita a escalabilidade, legibilidade e reutilização.

### Estrutura

- **Actor**: representa o usuário/testador.
- **Tasks**: ações que o ator pode executar.
- **Questions**: verificações que o ator pode fazer.
- **Abilities**: habilidades que o ator possui (ex: usar o browser).

---

### Exemplo com Screenplay

Vamos começa criando nossa estrutura com o screenplay.

### 1. Criar o arquivo de habilidades para acessar o browser

Como estamos fazendo um teste de front-end o actor precisar ter a habilidade de acessar uma url via browser.

**src/screenplay/abilities/BrowseTheWeb.ts**

```tsx
import { Page } from '@playwright/test';

export class BrowseTheWeb {
  constructor(public page: Page) {}

  static using(page: Page) {
    return new BrowseTheWeb(page);
  }
}
```

### 2. Criar o arquivo para representar um ator

Um ator ele precisa ter habilidades para executar tarefas e responder questões. Por conta disso além da classe Actor nós vamos também criar algumas interfaces para representar as habilidades, tasks e questions. Por convensão as interfaces começam com a letra I maiúscula.

O Ator tem uma lista de habilidades (ele pode fazer várias coisas), ele tenta executar tasks que são ações, e valida os resultados das ações fazendo perguntas.

**src/screenplay/core/Actor.ts**

```tsx
export interface IAbility {}

export interface ITask {
  performAs(actor: Actor): Promise<void>;
}

export interface IQuestion {
  answeredBy(actor: Actor): Promise<any>;
}

export class Actor {
  private abilities = new Map<Function, IAbility>();

  constructor(public name: string) {}

  whoCan(...abilities: IAbility[]) {
    for (const ability of abilities) {
      this.abilities.set(ability.constructor, ability);
    }
    return this;
  }

  abilityTo<T extends IAbility>(abilityType: new (...args: any[]) => T): T {
    const ability = this.abilities.get(abilityType);
    if (!ability) {
      throw new Error(`${this.name} does not have ability ${abilityType.name}`);
    }
    return ability as T;
  }

  attemptsTo(...tasks: ITask[]) {
    return Promise.all(tasks.map(task => task.performAs(this)));
  }

  asksFor<T>(question: IQuestion): Promise<T> {
    return question.answeredBy(this);
  }
}
```

### 3. Criar uma task para navegar até uma URL

Dado que o ator tem a habilidade de manipular um browser nós vamos criar uma task para que ele navegue até uma determinada URL. Se observar no método **performAs** vemos que estamos habilitando o actor a utilizar a habilidade do browser, aqui esta a relação entre actor, habilidade e task, se o actor não esta habilitado a utilizar uma habilidade ele não pode executar uma task que seja relacionada a habilidade.

**src/screenplay/tasks/NavigateTo.ts**

```tsx

import { BrowseTheWeb } from '@screenplay/abilities/BrowseTheWeb';
import { ITask, Actor } from '@screenplay/core/Actor';

export class NavigateTo implements ITask {
  constructor(private url: string) {}

  static theUrl(url: string = '/') {
    return new NavigateTo(url);
  }

  async performAs(actor: Actor): Promise<void> {
    const browser = actor.abilityTo(BrowseTheWeb);
    await browser.page.goto(this.url);
  }
}

```

### 4. Criar uma question para realizar uma validação (assertions)

Até o momento não sabíamos o que iriámos testar, temos a habilidade de acessar um browser, conseguimos executar uma task que acessa uma URL. Agora vamos criar uma question que vai validar o title de uma página web, em nosso caso utilizaremos o site que configuramos como base url: https://test-automation-practice.com.br/ e validaremos o title da página.

**src/screenplay/questions/IsHeroTitleVisible.ts**

```tsx
import { expect } from '@playwright/test';
import { BrowseTheWeb } from '@screenplay/abilities/BrowseTheWeb';
import { IQuestion, Actor } from '@screenplay/core/Actor';

export class IsHeroTitleVisible implements IQuestion {
  static onPage() {
    return new IsHeroTitleVisible();
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    const browser = actor.abilityTo(BrowseTheWeb);
    const element = browser.page.getByTestId('hero-title');
    try {
      await expect(element).toBeVisible();
      return true;
    } catch {
      return false;
    }
  }
}

```

### 5. Criar o teste para usar Screenplay

Temos aqui o mesmo testes que fizemos com pageobject só que agora com screenplay.

Vemos no testes todo o fluxo que criamos.

- Criar um ator com uma habilidade.
- Tentar executar uma ação (task) com este actor.
- Validar se a ação gerou o resultado esperado (question)

**tests/Screenplay/home.spec.ts**

```tsx
import { test, expect } from "@playwright/test";
import { Actor } from "@screenplay/core/Actor";
import { NavigateTo } from "@screenplay/tasks/NavigateTo";
import { IsHeroTitleVisible } from "@screenplay/questions/IsHeroTitleVisible";
import { BrowseTheWeb } from "@screenplay/abilities/BrowseTheWeb";

test.describe("Home Page - Screenplay", () => {
  test("Should Be Possible Access Home Page", async ({ page }) => {
    const actor = new Actor("Tester").whoCan(BrowseTheWeb.using(page));

    await actor.attemptsTo(NavigateTo.theUrl());

    const isVisible = await actor.asksFor(IsHeroTitleVisible.onPage());
    expect(isVisible).toBeTruthy()
  });
});

```

Quando olhamos para o screenplay vemos que temos uma complexidade maior que o pageObject, isso nos faz pensar que se o time tiver dificuldades técnicas provavelmente este padrão pode ser um problema

Uma forma prática de entender o padrão Screenplay é pensar no fluxo lógico de um usuário (o **Ator**) e nas permissões que ele possui para interagir com o sistema.

No Screenplay, um **Ator** pode executar duas coisas principais: **Tarefas** (ações que ele realiza no sistema) e **Perguntas** (validações ou consultas sobre o estado do sistema). Porém, para que o ator consiga executar uma tarefa ou responder a uma pergunta, ele precisa possuir as **Habilidades** (Abilities) necessárias, que representam as capacidades técnicas ou permissões para realizar essas ações.

Por exemplo, no caso do ator que deseja acessar uma URL (uma **Tarefa** chamada `NavigateTo`) e verificar se um título está visível na página (uma **Pergunta** chamada `IsHeroTitleVisible`), ambas dependem da habilidade `BrowseTheWeb`. Essa habilidade representa a capacidade do ator de interagir com o navegador via Playwright.

Dentro da implementação, o método `abilityTo` é responsável por verificar se o ator possui a habilidade requerida para executar a tarefa ou responder à pergunta:

```tsx

const browser = actor.abilityTo(BrowseTheWeb);
```

Se o ator **não possuir** a habilidade `BrowseTheWeb`, ele **não poderá** executar a tarefa `NavigateTo` nem responder à pergunta `IsHeroTitleVisible`. Nesse caso, o método `abilityTo` lança um erro, garantindo que o teste não continue em um estado inconsistente.

Essa estrutura garante que cada ator tenha explicitamente as permissões necessárias para as ações que irá realizar, promovendo clareza, segurança e organização no design dos testes.


### 6. Separando as interfaces.

Quando criamos nosso actor nós deixamos algumas interfaces como IAbility, ITask e IQuestion na mesma classe do actor. O melhor seria deixar estas interfaces em seus próprios arquivos pois podemos utilizar em outros lugares.

Dentro de /src vamos criar uma pasta chamada interfaces e dentro dela as seguintes Interfaces.

**src/interfaces/IAbility.ts**

```tsx
export interface IAbility {}
```

**src/interfaces/IAccountApiPort.ts**

```tsx
import { IUser, IUserCreationResponse } from "@interfaces/IUser";

export interface IAccountApiPort {
  createUser(user: IUser): Promise<IUserCreationResponse>;
}
```

**src/interfaces/IDatabaseAdapter.ts**

```tsx
export interface IDatabaseAdapter {
  connect(): Promise<void>;
  executeScript(scriptPath: string): Promise<any[]>;
  replaceValuesAndExecuteScript(scriptPath: string, values: string[]): Promise<{ modifiedSql: string; rows: any[] }>;
  closeConnection(): Promise<void>;
  query(sql: string, params?: any[]): Promise<any[]>
  execute(sql: string, params?: any[]): void
}
```

**src/interfaces/IDbConfig.ts**

```tsx
export type IDBConfig = {
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
};
```

**src/interfaces/IQuestion.ts**

```tsx

import { Actor } from "@screenplay/core/Actor";

export interface IQuestion<T = any> {
  answeredBy(actor: Actor): Promise<T>;
  stepName?(): string;
}
```

**src/interfaces/IQuestionValidationOptions.ts**

```tsx
export interface IQuestionValidationOptions<T> {
  invalidValues?: T[];           
  errorMessage?: string;       
  errorClass?: new (msg: string) => Error; 
}

```

**src/interfaces/ITask.ts**

```tsx

import { Actor } from "@screenplay/core/Actor";

export interface ITask {
  performAs(actor: Actor): Promise<void>;
  stepName?(): string;
}

```

**src/interfaces/IUser.ts**

```tsx
export interface IUser {
  userName: string;
  password: string;
}

export interface IUserCreationResponse {
  userID: string;
  username: string;
  books: any[];
}
```

Agora vamos atualizar os tsconfig.json adicionando o path da interface:

**tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["@playwright/test", "node"],
    "outDir": "dist",
    "rootDir": "./",
    "baseUrl": ".",
    "paths": {
      "@framework/*": ["src/*"],
      "@pages/*": ["src/adapters/pages/*"],
      "@utils/*": ["src/utils/*"],
      "@screenplay/*": ["src/screenplay/*"],
      "@interfaces/*": ["src/interfaces/*"]
    }
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

**tests/tsconfig.json**

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "../dist/tests",
    "rootDir": "../",
    "baseUrl": "../",
    "paths": {
      "@framework/*": ["src/*"],
      "@pages/*": ["src/adapters/pages/*"],
      "@utils/*": ["src/utils/*"],
      "@screenplay/*": ["src/screenplay/*"],
      "@tests/*": ["tests/*"],
      "@fixtures/*": ["tests/fixtures/*"],
      "@interfaces/*": ["src/interfaces/*"]
    }
  },
  "include": [
    "../src/**/*.ts",
    "**/*.ts"
  ],
  "exclude": ["node_modules", "../dist"]
}
```

Por fim atualizamos nossas classes para utilizarem o novo caminho das interfaces

**src/screenplay/core/Actor.ts**

```tsx
import { IAbility } from "@framework/interfaces/IAbility";
import { IQuestion } from "@framework/interfaces/IQuestion";
import { ITask } from "@framework/interfaces/ITask";

export class Actor {
  private abilities = new Map<Function, IAbility>();

  constructor(public name: string) {}

  whoCan(...abilities: IAbility[]) {
    for (const ability of abilities) {
      this.abilities.set(ability.constructor, ability);
    }
    return this;
  }

  abilityTo<T extends IAbility>(abilityType: new (...args: any[]) => T): T {
    const ability = this.abilities.get(abilityType);
    if (!ability) {
      throw new Error(`${this.name} does not have ability ${abilityType.name}`);
    }
    return ability as T;
  }

  attemptsTo(...tasks: ITask[]) {
    return Promise.all(tasks.map(task => task.performAs(this)));
  }

  asksFor<T>(question: IQuestion): Promise<T> {
    return question.answeredBy(this);
  }
}

```

**src/screenplay/tasks/NavigateTo.ts**

```tsx
import { ITask } from '@framework/interfaces/ITask';
import { BrowseTheWeb } from '@screenplay/abilities/BrowseTheWeb';
import { Actor } from '../core/Actor';

export class NavigateTo implements ITask {
  constructor(private url: string) {}

  static theUrl(url: string = '/') {
    return new NavigateTo(url);
  }

  async performAs(actor: Actor): Promise<void> {
    const browser = actor.abilityTo(BrowseTheWeb);
    await browser.page.goto(this.url);
  }
}
```

**src/screenplay/questions/IsHeroTitleVisible.ts**

```tsx
import { expect } from '@playwright/test';
import { BrowseTheWeb } from '@screenplay/abilities/BrowseTheWeb';
import { Actor } from '@screenplay/core/Actor';
import { IQuestion } from '@interfaces/IQuestion';

export class IsHeroTitleVisible implements IQuestion {
  static onPage() {
    return new IsHeroTitleVisible();
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    const browser = actor.abilityTo(BrowseTheWeb);
    const element = browser.page.getByTestId('hero-title');
    try {
      await expect(element).toBeVisible();
      return true;
    } catch {
      return false;
    }
  }
}
```

---

# Allure report

Vamos configurar o report do allure para termos mais uma opção além do report nativo do playwright.

## **Instale o Allure Playwright Reporter**

Instalar o java jdk

```bash
sudo apt update

sudo apt install openjdk-11-jdk
```

Configurar a variável de ambiente `JAVA_HOME`

Linux: Adicione no seu arquivo `~/.bashrc`, `~/.zshrc` ou equivalente:

```bash
export JAVA_HOME=$(/usr/libexec/java_home)  # macOS
# ou para Linux, algo como:
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
```

```bash

npm install --save-dev @playwright/test allure-playwright

npm install --save-dev allure-commandline
```

**2. Como configurar no .env**

```bash
BASE_URL=https://test-automation-practice.com.br/
HEADLESS=false
TRACE=off
SCREENSHOT=only-on-failure
VIDEO=off
ACTION_TIMEOUT=15000
NAVIGATION_TIMEOUT=30000
TEST_TIMEOUT=60000
RETRIES=1
REPORTER=allure-playwright
TEST_CHROMIUM=true
TEST_FIREFOX=false
TEST_WEBKIT=false
TEST_MOBILE=false
```

1. **Gerar e visualizar o relatório Allure**
Após rodar os testes:

```bash
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

Lembre de adicionar as pastas do allure no seu gitignore

```bash

# Playwright
node_modules/
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
uat.env
rc.env
env.*
/dist
/allure-report
/allure-results
venv/
*.env
```

Podemos também adicionar os comandos como scrips no package.json

```bash
{
  "name": "playwright_screenplay_pageobject_template",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "pretest": "tsc --incremental -p tests/tsconfig.json",
    "test": "playwright test",
    "test:uat": "cross-env ENV=uat npx playwright test",
    "test:rc": "cross-env ENV=rc npx playwright test",
    "test:ci": "HEADLESS=true npx playwright test",
    "report": "npx playwright show-report",
    "debug": "npx playwright test --debug --project=chromium",
    "allure:clean": "rm -rf allure-results allure-report",
    "allure:generate": "allure generate allure-results --clean -o allure-report",
    "allure:open": "allure open allure-report",
    "allure": "npm run allure:generate && npm run allure:open",
    "test:allure": "npm run allure:clean && npm run test ; npm run allure"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "devDependencies": {
    "@playwright/test": "^1.55.0",
    "@types/node": "^24.3.1",
    "allure-commandline": "^2.34.1",
    "allure-playwright": "^3.4.0",
    "cross-env": "^10.0.0",
    "typescript": "^5.9.2"
  },
  "dependencies": {
    "dotenv": "^17.2.2"
  }
}

```

Agora podemos executar da seguinte forma que seja gerado o report do allure e aberto no browser

```bash
npm run allure
```

Ou se preferir podemos executar um comando que limpa o report antigo, executa os teste, gera o novo report e abre o mesmo.

```bash
npm run test:allure
```

## Allure logger

Vamos criar uma classe para customizar o uso do allure. O report do allure precisa ser contruido utilizando steps e outros recursos, vamos adicionar este recursos em uma classe.

**src/utils/AllureLogger.ts**

```tsx
import { test } from '@playwright/test';

export class AllureLogger {
  static log(message: string) {
    test.step(message, async () => {});
  }

  static info(message: string) {
    this.log(`INFO: ${message}`);
  }

  static warn(message: string) {
    this.log(`WARN: ${message}`);
  }

  static error(message: string, error?: Error) {
    console.error(`[ALLURE ERROR] ${message}`, error || '');
    test.step(`❌ ${message}`, async () => {
      if (error) {
        this.attachment('Error Details', error.stack || error.message, 'text/plain');
      }
    });
  }

  static success(message: string, details?: any) {
    console.info(`[ALLURE SUCCESS] ✅ ${message}`, details || '');
    test.step(`✅ ${message}`, async () => {
      if (details) {
        this.attachment('Success Details', JSON.stringify(details, null, 2), 'application/json');
      }
    });
  }

  static step<T>(name: string, fn: () => Promise<T>): Promise<T> {
    return test.step(name, async () => {
      try {
        return await fn();
      } catch (error) {
        this.error(`Erro no step "${name}": ${(error as Error).message}`);
        throw error;
      }
    });
  }

  static async attachment(name: string, content: string | Buffer, type: string) {
    const testInfo = test.info();
    if (testInfo) {
      await testInfo.attach(name, {
        body: typeof content === 'string' ? Buffer.from(content, 'utf-8') : content,
        contentType: type,
      });
    } else {
      console.warn(`Attachment "${name}" não anexado: fora do contexto do teste`);
    }
  }

  static apiRequest(method: string, url: string, payload?: any) {
    const message = `API ${method.toUpperCase()} ${url}`;
    test.step(message, async () => {
      this.attachment('Request URL', url, 'text/plain');
      this.attachment('HTTP Method', method.toUpperCase(), 'text/plain');
      if (payload) {
        this.attachment('Request Payload', JSON.stringify(payload, null, 2), 'application/json');
      }
    });
  }

  static apiResponse(statusCode: number, responseBody?: any) {
    const message = `API Response [${statusCode}]`;
    test.step(message, async () => {
      this.attachment('Status Code', statusCode.toString(), 'text/plain');
      if (responseBody) {
        this.attachment('Response Body', JSON.stringify(responseBody, null, 2), 'application/json');
      }
    });
  }
}

```

## Allure Steps

Vamos também criar uma classe para os steps do allure, ela será similar a um wrapper onde vamos emcapsular todos os métodos de uma page.

**src/utils/AllureStep.ts**

```tsx
import { AllureLogger } from '@utils/AllureLogger';

export function withAllureSteps<T extends { new(...args: any[]): {} }>(Base: T, stepNamePrefix?: string) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args);

      const propertyNames = Object.getOwnPropertyNames(Base.prototype);

      for (const propertyName of propertyNames) {
        if (propertyName === 'constructor') continue;

        const originalMethod = (this as any)[propertyName];
        if (typeof originalMethod === 'function') {
          (this as any)[propertyName] = async (...methodArgs: any[]) => {
            const stepName = stepNamePrefix
              ? `${stepNamePrefix} - ${propertyName}(${methodArgs.map(a => JSON.stringify(a)).join(', ')})`
              : `${propertyName}(${methodArgs.map(a => JSON.stringify(a)).join(', ')})`;
            
            console.info(`${stepName} is being executed`);
            return AllureLogger.step(stepName, async () => {
              return await originalMethod.apply(this, methodArgs);
            });
          };
        }
      }
    }
  };
}

```

---

# Database

Vamos criar uma estrutura genérica para conexões com banco de dados.

## 1. Interface `IDatabaseAdapter`

Como queremos algo genérico vamos criar uma interface para ser a porta de conexão com nosso projeto. A interface contém os métodos que um adapter precisar ter para se conextar ao nosso projeto.

**src/interfaces/IDatabaseAdapter.ts**

```tsx
export interface IDatabaseAdapter {
  connect(): Promise<void>;
  executeScript(scriptPath: string): Promise<any[]>;
  replaceValuesAndExecuteScript(scriptPath: string, values: string[]): Promise<{ modifiedSql: string; rows: any[] }>;
  closeConnection(): Promise<void>;
  query(sql: string, params?: any[]): Promise<any[]>
  execute(sql: string, params?: any[]): void
}
```

## 2. Adapter MySQL implementando a interface

Agora vamos para o adapter que neste caso utilizaremos para MySQL, porém podemos criar para qualquer banco que possamos utilizar no projeto. Ele deve implementar a interface IDatabaseAdapter que representa a porta e assim deve conter todos os métodos da interface.

Instalar o mysql2

```bash
npm i mysql2
```

**src/adapters/database/MySQLAdapter.ts**

```tsx
import mysql, { Connection, RowDataPacket } from 'mysql2/promise';
import fs from 'fs';
import { IDatabaseAdapter } from '@interfaces/IDatabaseAdapter';
import { IDBConfig } from '@framework/interfaces/IDbConfig';

export class MySQLAdapter implements IDatabaseAdapter {
  private config: IDBConfig;
  private connection: Connection | null = null;
  private TIMEOUT = 60_000; // ms
  private INTERVAL = 5_000; // ms

  constructor(dbConfig: IDBConfig) {
    this.config = dbConfig;
  }

  async connect(): Promise<void> {
    const start = Date.now();
    while (Date.now() - start < this.TIMEOUT) {
      try {
        this.connection = await mysql.createConnection({
          host: this.config.DB_HOST,
          port: this.config.DB_PORT,
          user: this.config.DB_USER,
          password: this.config.DB_PASSWORD,
          database: this.config.DB_NAME,
          connectTimeout: 5_000,
        });
        return;
      } catch (err) {
        console.log(`Connection attempt failed: ${err}`);
        await new Promise(res => setTimeout(res, this.INTERVAL));
      }
    }
    throw new Error('Failed to connect to database after timeout');
  }

  async executeScript(scriptPath: string): Promise<any[]> {
    if (!this.connection) throw new Error('Not connected');
    const sql = fs.readFileSync(scriptPath, 'utf-8').trim();
    if (!sql) throw new Error('Script file is empty');
    const [rows] = await this.connection.query<RowDataPacket[]>(sql);
    return Array.isArray(rows) ? rows : [];
  }

  async replaceValuesAndExecuteScript(scriptPath: string, values: string[]): Promise<{ modifiedSql: string; rows: any[] }> {
    if (!this.connection) throw new Error('Not connected');
    let sql = fs.readFileSync(scriptPath, 'utf-8').trim();

    let i = 0;
    const modifiedSql = sql.replace(/\$\$/g, () => {
      if (i < values.length) {
        return values[i++];
      }
      return '$$';
    });

    const [rows] = await this.connection.query<RowDataPacket[]>(modifiedSql);
    return {
      modifiedSql,
      rows: Array.isArray(rows) ? rows : [],
    };
  }

  async closeConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  }

  async query(sql: string, params?: any[]): Promise<any[]> {
    if (!this.connection) throw new Error('Not connected');
    const [rows] = await this.connection.query(sql, params);
    return Array.isArray(rows) ? rows : [];
  }

  async execute(sql: string, params?: any[]): Promise<void> {
    if (!this.connection) throw new Error('Not connected');
    await this.connection.execute(sql, params);
  }
}

```

## 3. Serivice para o Adapter

Ele vai receber o adapter e implementar os métodos genéricos que precisamos, ele atua como uma camada intermediária. Podemos ver que o service não recebe diretamente o adpter, ele recebe a interface referente ao adpter, isso é a inversão de dependência, o adapter implementa a IDatabaseAdapter e service espera algo que seja do “tipo” IDatabaseAdapter, logo qualquer adpter que implementa a interface pode ser utilizado.

**src/service/DbService.ts**

```tsx
import { test } from "@playwright/test";
import { AllureLogger } from "@utils/AllureLogger";
import { IDatabaseAdapter } from "@interfaces/IDatabaseAdapter";

export class DbService {
  constructor(private adapter: IDatabaseAdapter) {}

  async executeScript(scriptPath: string) {
    return test.step(`Executar script SQL: ${scriptPath}`, async () => {
      AllureLogger.info(`Iniciando execução do script SQL: ${scriptPath}`);
      const result = await this.adapter.executeScript(scriptPath);
      AllureLogger.attachment(
        "Resultado do script SQL",
        JSON.stringify(result, null, 2),
        "application/json"
      );
      return result;
    });
  }

  async replaceValuesAndExecuteScript(scriptPath: string, values: string[]) {
    return test.step(`Executar script SQL com substituição de valores: ${scriptPath}`, async () => {
      AllureLogger.info(
        `Iniciando execução do script SQL com valores: ${values.join(", ")}`
      );
      const { modifiedSql, rows } =
        await this.adapter.replaceValuesAndExecuteScript(scriptPath, values);
      AllureLogger.attachment("SQL modificado", modifiedSql, "text/plain");
      AllureLogger.attachment(
        "Resultado do script SQL",
        JSON.stringify(rows, null, 2),
        "application/json"
      );
      return { modifiedSql, rows };
    });
  }

  async query(sql: string, params?: any[]) {
    return test.step(`Executar consulta SQL: ${sql}`, async () => {
      if (params && params.length > 0) {
        AllureLogger.info(
          `Executando consulta SQL com parâmetros: ${params.join(", ")}`
        );
      }

      const rows = await this.adapter.query(sql, params);
      AllureLogger.attachment("Consulta SQL", sql, "text/plain");
      if (params && params.length > 0) {
        AllureLogger.attachment(
          "Parâmetros da consulta",
          JSON.stringify(params, null, 2),
          "application/json"
        );
      }
      if (!rows || rows.length === 0) {
        AllureLogger.info("A consulta SQL não retornou resultados.");
      }
      return rows;
    });
  }

  async execute(sql: string, params?: any[]) {
    return test.step(`Executar comando SQL: ${sql}`, async () => {
      AllureLogger.info(
        `Executando comando SQL com parâmetros: ${params?.join(", ")}`
      );
      const result = await this.adapter.execute(sql, params);
      AllureLogger.attachment("Comando SQL", sql, "text/plain");
      AllureLogger.attachment(
        "Parâmetros do comando",
        JSON.stringify(params, null, 2),
        "application/json"
      );
      return result;
    });
  }
}

```

Lembrando que precisamos adicionar o services no path do projeto.

**tsconfig.json**

tests/tsconfig.json

```bash
"@services/*": ["src/services/*"]
```

---

## 4. Ability Screenplay `AccessDatabase`

Como temos uma implementação do screenplay no projeto vamos criar uma Habilidade para que nosso ator consiga acessar o banco de dados. Como podemos ver a habilidade recebe o service.

**src/screenplay/abilities/AccessDatabase.ts**

```tsx

import { IAbility } from '@framework/interfaces/IAbility';
import { IDatabaseAdapter } from '@interfaces/IDatabaseAdapter';
import { DbService } from '@services/DbService';

export class AccessDatabase implements IAbility {
  constructor(private readonly service: DbService) {}

  static using(adapter: IDatabaseAdapter): AccessDatabase {
    return new AccessDatabase(new DbService(adapter));
  }

  db(): DbService {
    return this.service;
  }
}

```

## 5. Agora vamos criar tasks para o ator

### Task para executar script SQL simples

**tests/screenplay/tasks/ExecuteSqlScript.ts**

```tsx
import { Actor } from '@screenplay/core/Actor';
import { AccessDatabase } from '@screenplay/abilities/AccessDatabase';
import { ITask } from '@interfaces/ITask';

export class ExecuteSqlScript implements ITask {
  private scriptPath: string;

  constructor(scriptPath: string) {
    this.scriptPath = scriptPath;
  }

  static fromFile(scriptPath: string) {
    return new ExecuteSqlScript(scriptPath);
  }

  async performAs(actor: Actor): Promise<void> {
    const db = actor.abilityTo(AccessDatabase).db();
    await db.executeScript(this.scriptPath);
  }
}

```

### Task para executar script SQL com substituição de valores

**tests/screenplay/tasks/ExecuteSqlScriptWithValues.ts**

```tsx
import { Actor } from '@screenplay/core/Actor';
import { AccessDatabase } from '@screenplay/abilities/AccessDatabase';
import { ITask } from '@interfaces/ITask';

export class ExecuteSqlScriptWithValues implements ITask {
  private scriptPath: string;
  private values: string[];

  constructor(scriptPath: string, values: string[]) {
    this.scriptPath = scriptPath;
    this.values = values;
  }

  static fromFileWithValues(scriptPath: string, values: string[]) {
    return new ExecuteSqlScriptWithValues(scriptPath, values);
  }

  async performAs(actor: Actor): Promise<void> {
    const db = actor.abilityTo(AccessDatabase).db();
    await db.replaceValuesAndExecuteScript(this.scriptPath, this.values);
  }
}

```

## Criar Questions para o Ator

### Question para executar um script SQL e retornar os dados

**src/screenplay/questions/QueryDatabase.ts**

```tsx
import { Question, Actor } from '@screenplay/core/Actor';
import { AccessDatabase } from '@screenplay/abilities/AccessDatabase';

export class QueryDatabase implements Question<any[]> {
  private scriptPath: string;

  constructor(scriptPath: string) {
    this.scriptPath = scriptPath;
  }

  static fromFile(scriptPath: string) {
    return new QueryDatabase(scriptPath);
  }

  async answeredBy(actor: Actor): Promise<any[]> {
    const db = actor.abilityTo(AccessDatabase);
    const results = await db.executeScript(this.scriptPath);
    return results;
  }
}
```

### Question para verificar se um dado existe (boolean)

**tests/screenplay/questions/DoesDataExist.ts**

```tsx
import { Actor } from '@screenplay/core/Actor';
import { AccessDatabase } from '@screenplay/abilities/AccessDatabase';
import { IQuestion } from '@framework/interfaces/IQuestion';

export class DoesDataExist implements IQuestion<any> {
  private rows: any[];

  constructor(rows: any[]) {
    this.rows = rows;
  }

  static fromRows(rows: any[]) {
    return new DoesDataExist(rows);
  }

  async answeredBy(actor: Actor): Promise<any>{
    actor.abilityTo(AccessDatabase).db();
    return this.rows.length > 0;
  }
}

```

---

## **Database Conection**

Utilizaremos um arquivo docker compose para executar um banco de dados local e assim conectarmos no mesmo para testarmos nossa implementação.

Neste caso não precisamos estar no mesmo projeto de teste, podemos criar um projeto novo somente para criar o banco de dados.

1. Crie um ambiente virtual (uma pasta isolada com Python e pip próprios):

```bash
python3 -m venv venv
```

1. Ative o ambiente virtual:

```bash
source venv/bin/activate
```

1. Instales os seguintes pacotes

```bash
pip install python-dotenv
```

```bash
python -m pip install mysql-connector-python
```

Criar o arquivo docker compose

**docker-compose.yml**

```yaml
services:
  mysql:
    image: mysql:latest
    container_name: cypress-mysql-test
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  mysql_data:

```

Vamos Criar um arquivo .env para conter as variáveis de ambiente para conexão ao banco de dados.

**.env**

```
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=testdb
MYSQL_USER=testuser
MYSQL_PASSWORD=testpassword

DB_NAME=testdb
DB_USER=testuser
DB_PASSWORD=testpassword
DB_HOST=localhost
DB_PORT=3306
```

Precisamos de dados no banco para nosso teste então vamos usar um recurso onde criamos um arquivo init.sql para popular nosso banco. Ele cria a base de dados, cria a tabela e inseri dados.

**init.sql**

```sql
CREATE DATABASE IF NOT EXISTS testdb;

USE testdb;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);

INSERT INTO users (username, email, password) VALUES
('user1', 'user1@example.com', 'password123'),
('user2', 'user2@example.com', 'password123'),
('user3', 'user3@example.com', 'password123'),
('user4', 'user4@example.com', 'password123'),
('user5', 'user5@example.com', 'password123'),
('user6', 'user6@example.com', 'password123'),
('user7', 'user7@example.com', 'password123'),
('user8', 'user8@example.com', 'password123'),
('user9', 'user9@example.com', 'password123'),
('user10', 'user10@example.com', 'password123');
```

Quando executarmos o docker compose estaremos iniciando um container com o database.

`docker compose up -d`

Criamos um script python para conectar ao banco, executar o init.sql e criar dados para utilizarmos nos testes.

**init_db.py**

```python
"""Database Initialization Script

This enhanced script initializes a MySQL database with:
- Robust connection handling with retry mechanism
- Proper transaction management
- Detailed logging
- Environment variable support
- Configurable parameters
- Type hints and documentation
"""

import os
import time
from pathlib import Path
from typing import Optional

import mysql.connector
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class DatabaseInitializer:
    """    A robust database initializer that creates and configures a MySQL database.

    Args:
        host (str): Database server host.
        user (str): Database username.
        password (str): Database password.
        database (str): Database name.
        init_file (str): Path to SQL initialization file. Defaults to 'init.sql'
        timeout (int): Connection timeout in seconds. Defaults to 60
        interval (int): Retry interval in seconds. Defaults to 5
    """

    def __init__(
        self,
        host: str = "",
        user: str = "",
        password: str = "",
        database: str = "",
        init_file: str = "init.sql",
        timeout: int = 60,
        interval: int = 5
    ):
        self.host = os.getenv("DB_HOST", host)
        self.user = os.getenv("DB_USER", user)
        self.password = os.getenv("DB_PASSWORD", password)
        self.database = os.getenv("DB_NAME", database)
        self.init_file = Path(init_file)
        self.timeout = timeout
        self.interval = interval
        self.connection: Optional[mysql.connector.MySQLConnection] = None

    def initialize(self) -> bool:
        """        Main initialization method that handles the complete process.

        Returns:
            bool: True if initialization succeeded, False otherwise
        """
        try:
            if not self._connect_with_retry():
                return False

            if not self._execute_init_script():
                return False

            return True

        except Exception as e:
            print(f"⛔ Critical error during initialization: {e}")
            return False
        finally:
            self._close_connection()

    def _connect_with_retry(self) -> bool:
        """        Attempts to connect to the database with retry logic.

        Returns:
            bool: True if connection succeeded, False if timeout reached
        """
        start_time = time.time()
        attempts = 0

        while (time.time() - start_time) < self.timeout:
            attempts += 1
            try:
                print(f"Attempt #{attempts}: Connecting to MySQL at {self.host}...")
                self.connection = mysql.connector.connect(
                    host=self.host,
                    user=self.user,
                    password=self.password,
                    database=self.database,
                    connect_timeout=5
                )

                if self.connection.is_connected():
                    print(f"✅ Successfully connected to database '{self.database}'")
                    return True

            except mysql.connector.Error as e:
                print(f"⚠️ Connection attempt failed: {e}")
                time.sleep(self.interval)
                continue

        print(f"⛔ Timeout after {self.timeout} seconds. Could not connect to database.")
        return False

    def _execute_init_script(self) -> bool:
        """        Executes the SQL initialization script.

        Returns:
            bool: True if script executed successfully, False otherwise
        """
        if not self.connection or not self.connection.is_connected():
            print("⛔ No active database connection")
            return False

        if not self.init_file.exists():
            print(f"⛔ Initialization file not found: {self.init_file}")
            return False

        try:
            with open(self.init_file, 'r') as file:
                sql_commands = file.read()

            if not sql_commands.strip():
                print("⚠️ Initialization file is empty")
                return True  # Considered success with no commands

            with self.connection.cursor() as cursor:
                # Execute each command separately
                for command in sql_commands.split(';'):
                    command = command.strip()
                    if command:
                        try:
                            cursor.execute(command)
                        except mysql.connector.Error as e:
                            print(f"⚠️ Error executing command: {command}\nError: {e}")
                            continue

                self.connection.commit()
                print("✅ Database initialized successfully")
                return True

        except Exception as e:
            print(f"⛔ Error executing initialization script: {e}")
            self.connection.rollback()
            return False

    def _close_connection(self) -> None:
        """Closes the database connection if it exists."""
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("✅ Database connection closed")

if __name__ == "__main__":
    # Example usage
    initializer = DatabaseInitializer(
        host="127.0.0.1",
        user="testuser",
        password="testpassword",
        database="testdb",
        init_file="init.sql",
        timeout=60,
        interval=5
    )

    if initializer.initialize():
        print("🚀 Database initialization completed successfully")
        exit(0)
    else:
        print("❌ Database initialization failed")
        exit(1)
```

Dado que estamos com o container em execução, podemos executar o script e assim o banco estará populado com dados para teste.

Agora executamos o script e nosso banco será populado.

```bash
python init_db.py
```

Teremos uma mensagem simila ra esta abaixo

Attempt #1: Connecting to MySQL at localhost...
✅ Successfully connected to database 'testdb'
✅ Database initialized successfully
✅ Database connection closed
🚀 Database initialization completed successfully

---

## Criar arquivos sqls

Vamos agora criar arquivos .sql para que possamos fazer tests que lêem os arquivos e executam os mesmos.

**tests/sql/test.sql**

```sql
SELECT * FROM users;
```

**tests/sql/users_replace.sql**

```sql
SELECT * FROM users LIMIT $$;
```

---

Agora precisamos que as variaveis do banco estejam no uat.env (ou rc.env dependendo de onde esta executando)

```sql
BASE_URL=https://test-automation-practice.com.br/
HEADLESS=false
TRACE=on
SCREENSHOT=only-on-failure
VIDEO=off
ACTION_TIMEOUT=15000
NAVIGATION_TIMEOUT=30000
TEST_TIMEOUT=60000
RETRIES=1
REPORTER=allure-playwright
TEST_CHROMIUM=true
TEST_FIREFOX=false
TEST_WEBKIT=false
TEST_MOBILE=false

MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=testdb
MYSQL_USER=testuser
MYSQL_PASSWORD=testpassword

DB_NAME=testdb
DB_USER=testuser
DB_PASSWORD=testpassword
DB_HOST=localhost
DB_PORT=3306
```

## Injetar o adpter via fixture

Criar fixture customizada para injetar o adaptador conectado nos testes.

A fixture garante que seja instanciado o adapter, aberta a conexão, utilizada a conexão e fechado ao final. Seu scope é worker e assim ela é executada por cada worker e não por teste.

Se observar nós estamos sobrescrevendo o test do playwright e exportando o mesmo, com isso mudamos o comportamento dele extendendo para o uso da adpter.

**src/fixtures/dbAdapter.ts**

```tsx
import { MySQLAdapter } from '@framework/adapters/database/MySQLAdapter';
import { test as base } from '@playwright/test';

const dbConfig = {
  DB_HOST: process.env.DB_HOST!,
  DB_PORT: Number(process.env.DB_PORT),
  DB_NAME: process.env.DB_NAME!,
  DB_USER: process.env.DB_USER!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
};

export const test = base.extend<
  {},
  {
    dbAdapter: MySQLAdapter
  }
>({
  dbAdapter: [
    async ({}, use) => {
      const db = new MySQLAdapter(dbConfig);
      await db.connect();
      await use(db);
      await db.closeConnection();
    }, { scope: 'worker' }],
});

```

## Criando um teste para conexão com banco de dados

E o arquivo de teste para validar a conexão com o banco:

**tests/Screenplay/connect_database.spec.ts**

```tsx
import{ expect } from "@playwright/test";
import { test } from "@framework/fixtures/dbAdapter";
import { Actor } from "@screenplay/core/Actor";
import { AccessDatabase } from "@screenplay/abilities/AccessDatabase";
import { ExecuteSqlScript } from "@screenplay/tasks/ExecuteSqlScript";
import { DoesDataExist } from "@screenplay/questions/DoesDataExist";

test.describe('Connect Database - Screenplay', () => {
  test('Should Be Possible Connect Database', async ({ dbAdapter }) => {
    const actor = new Actor('Tester').whoCan(AccessDatabase.using(dbAdapter));
    const scriptResult = await actor.attemptsTo(ExecuteSqlScript.fromFile('src/sql/test.sql'))
    const hasRows = await actor.asksFor(DoesDataExist.fromRows(scriptResult))
    expect(hasRows).toBeTruthy();
  });
})

```

Se executar os testes verá que termos uma conexão, validamos um dado do banco e fechamos a conexão.

---

## Melhorando a implementação do banco.

Vamos melhorar a implementação para não ficarmos conectando ao banco em todo teste.

- Cria um singleton do adaptador de banco para manter uma única conexão
- Usa os hooks globais do Playwright (`globalSetup` e `globalTeardown`) para conectar e desconectar

### 1. Criar um singleton para o adaptador MySQL

Garante o retorno de uma instância ou a criação de uma nova.

**tests/adapters/DatabaseConnection.ts**

```tsx

import { IDBConfig } from '@framework/interfaces/IDbConfig';
import { MySQLAdapter } from './MySQLAdapter';

let instance: MySQLAdapter | null = null;

export function getDatabaseInstance(config: IDBConfig): MySQLAdapter {
  if (!instance) {
    instance = new MySQLAdapter(config);
  }
  return instance;
}
```

### 2. Criar globalSetup e globalTeardown para conectar/desconectar

**tests/global-setup.ts**

```tsx
import { getDatabaseInstance } from "@framework/adapters/database/DatabaseConnection";
import { IDBConfig } from "@framework/interfaces/IDbConfig";

const dbConfig: IDBConfig = {
  DB_HOST: process.env.DB_HOST!,
  DB_PORT: Number(process.env.DB_PORT),
  DB_NAME: process.env.DB_NAME!,
  DB_USER: process.env.DB_USER!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
};

async function globalSetup() {
  const db = getDatabaseInstance(dbConfig);
  await db.connect();
}

export default globalSetup;

```

**tests/global-teardown.ts**

```tsx
import { getDatabaseInstance } from "@framework/adapters/database/DatabaseConnection";

async function globalTeardown() {
  if (!getDatabaseInstance) return;
  const db = getDatabaseInstance({} as any);
  await db.closeConnection();
}

export default globalTeardown;

```

## Implementação para conexão nos testes com pageObject

### Criando repositories

Uma outra implementação que é bastante utilizada são os respositories, eles também são uma camada intermediária porém são dedicados a entidades específicas, no nosso caso criaremos um para user.

**src/repositories/UserRepository.ts**

```tsx
import { DbService } from '@services/DbService';
import { AllureLogger } from '@utils/AllureLogger';

export interface User {
  id: number;
  username: string;
  email: string;
}

export class UserRepository {
  constructor(private dbService: DbService) {}

  async getUserById(id: number): Promise<User | null> {
    return AllureLogger.step(`Buscar usuário pelo ID: ${id}`, async () => {
      const rows = await this.dbService.query('SELECT * FROM users WHERE id = ?', [id]);
      return rows.length > 0 ? (rows[0] as User) : null;
    });
  }

  async insertUser(username: string, email: string): Promise<void> {
    return AllureLogger.step(`Inserir usuário: ${username}`, async () => {
      await this.dbService.execute('INSERT INTO users (username, email) VALUES (?, ?)', [username, email]);
    });
  }

  async updateUserEmail(id: number, newEmail: string): Promise<void> {
    return AllureLogger.step(`Atualizar email do usuário ID: ${id}`, async () => {
      await this.dbService.execute('UPDATE users SET email = ? WHERE id = ?', [newEmail, id]);
    });
  }

  async deleteUser(id: number): Promise<void> {
    return AllureLogger.step(`Deletar usuário ID: ${id}`, async () => {
      await this.dbService.execute('DELETE FROM users WHERE id = ?', [id]);
    });
  }
}

```

### Atualizar o tsconfg.json

Vamos adicionar os novos paths

**tests/tsconfig.json**

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "../dist/tests",
    "rootDir": "../",
    "baseUrl": "../",
    "paths": {
      "@framework/*": ["src/*"],
      "@pages/*": ["src/adapters/pages/*"],
      "@utils/*": ["src/utils/*"],
      "@screenplay/*": ["src/screenplay/*"],
      "@tests/*": ["tests/*"],
      "@fixtures/*": ["tests/fixtures/*"],
      "@interfaces/*": ["src/interfaces/*"],
      "@services/*": ["src/services/*"],
      "@adapters/*": ["src/adapters/*"],
      "@sql": ["src/sql/*"],
      "@repositories/*": ["src/repositories/*"]
    }
  },
  "include": [
    "../src/**/*.ts",
    "**/*.ts"
  ],
  "exclude": ["node_modules", "../dist"]
}

```

**tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["@playwright/test", "node"],
    "outDir": "dist",
    "rootDir": "./",
    "baseUrl": ".",
    "paths": {
      "@framework/*": ["src/*"],
      "@pages/*": ["src/adapters/pages/*"],
      "@utils/*": ["src/utils/*"],
      "@screenplay/*": ["src/screenplay/*"],
      "@tests/*": ["tests/*"],
      "@fixtures/*": ["tests/fixtures/*"],
      "@interfaces/*": ["src/interfaces/*"],
      "@services/*": ["src/services/*"],
      "@adapters/*": ["src/adapters/*"],
      "@sql": ["src/sql/*"],
      "@repositories/*": ["src/repositories/*"]
    }
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "tests"]
}

```

---

### Criando testes para utilizar repository e service

Por fim podemos criar nossos testes utilizando as duas implementações

**tests/specs/PageObject/connect_database.spec.ts**

```tsx
import { expect } from "@playwright/test";
import { test } from "@fixtures/dbAdapter";
import { DbService } from "@services/DbService";
import { UserRepository } from "@repositories/UserRepository";

test.describe("Connect Database - PageObject", () => {
  test("Execute SQL Script", async ({ dbAdapter }) => {
    const dbService = new DbService(dbAdapter);
    const user = await dbService.executeScript("tests/sql/test.sql");
    expect(user[0].id).toEqual(1);
  });

  test("Get User By ID", async ({ dbAdapter }) => {
    const userRepository = new UserRepository(dbAdapter);
    const user = await userRepository.getUserById(1);
    expect(user?.id).toEqual(1);
  });
});
```

### Por que ter os dois?

**1. DbService (serviço genérico)**

- Abstrai operações genéricas e utilitárias no banco, como executar scripts SQL completos, rodar comandos que não se encaixam em uma entidade específica, ou operações administrativas.
- Útil para tarefas que envolvem múltiplas tabelas, migrações, scripts de setup, ou execuções ad hoc.
- Serve como uma camada intermediária simples entre o adapter e o código que precisa executar scripts SQL arbitrários.

**2. Repositories (camada específica por entidade)**

- Encapsulam a lógica de acesso e manipulação de dados para uma entidade específica (ex: usuário, pedido, produto).
- Facilitam a manutenção, testes e reutilização de código.
- Permitem implementar regras de negócio específicas, validações e queries otimizadas para cada entidade.
- Melhoram a legibilidade e organização do código, deixando os testes e serviços mais claros.

---

# Criando uma classe para erros

Vamos criar uma classe customizada para erros

**tests/errors/TestErrors.ts**

```tsx
import { AllureLogger } from "@utils/AllureLogger";

export class TestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TestError";
    AllureLogger.error(message);
  }
}

export class TaskFailedError extends TestError {
  constructor(taskName: string, message: string) {
    super(`Task "${taskName}" failed: ${message}`);
    this.name = "TaskFailedError";
  }
}

export class QuestionValidationError extends TestError {
  constructor(questionName: string, message: string) {
    super(`Question "${questionName}" validation failed: ${message}`);
    this.name = "QuestionValidationError";
  }
}

export class DatabaseConnectionError extends TestError {
  constructor(message: string) {
    super(`Database connection error: ${message}`);
    this.name = "DatabaseConnectionError";
  }
}

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly endpoint: string,
    message: string
  ) {
    super(`API Error [${statusCode}] ${endpoint}: ${message}`);
    this.name = 'ApiError';
  }
}

```

Lembre de adicionar o path de errors nos tsconfig.json

```bash
"@errors/*": ["src/errors/*"]
```

---

# Aplicando melhorias no report com Allure

Nesta sessão estamos mostrando uma forma de automatizar algumas coisas no Allure report de uma forma que não seja necessário criar os steps em cada teste ou método. Está implementação trará mais complexidade ao projeto, porém trás benefícios também.

## Atualização do Actor (ScreenPlay)

Vamos atualizar nosso actor para capturar e inserir logs tanto no console do terminal quanto no report do allure. O objetivo é não ter que fazer isso manualmente adicionando steps nos testes.

**src/screenplay/core/Actor.ts**

```tsx

import { test } from "@playwright/test";
import { AllureLogger } from "@utils/AllureLogger";
import { TaskFailedError, QuestionValidationError } from "@errors/TestErrors";
import { IAbility } from "@framework/interfaces/IAbility";
import { IQuestion } from "@framework/interfaces/IQuestion";
import { IQuestionValidationOptions } from "@framework/interfaces/IQuestionValidationOptions";
import { ITask } from "@framework/interfaces/ITask";

export class Actor {
  private abilities = new Map<Function, IAbility>();
  private static indent = "  "; 

  constructor(public name: string) {}

  static named(name: string): Actor {
    return new Actor(name);
  }

  whoCan(...abilities: IAbility[]) {
    for (const ability of abilities) {
      this.abilities.set(ability.constructor, ability);
    }
    return this;
  }

  abilityTo<T extends IAbility>(abilityType: new (...args: any[]) => T): T {
    const ability = this.abilities.get(abilityType);
    if (!ability) {
      throw new Error(`${this.name} does not have ability ${abilityType.name}`);
    }
    return ability as T;
  }

  async attemptsTo(...tasks: ITask[]) {
    return Promise.all(
      tasks.map((task) =>
        test.step(
          task.stepName?.() || `Task: ${task.constructor.name}`,
          async () => {
            const stepName = task.stepName?.() || task.constructor.name;
            const testName = test.info().title;
            console.info(
              `${Actor.indent}[Test: ${testName}] [Actor: ${this.name}] Iniciando Task: ${stepName}`
            );
            AllureLogger.info(`Iniciando Task: ${stepName}`);

            try {
              await task.performAs(this);
              console.info(
                `${Actor.indent}[Test: ${testName}] [Actor: ${this.name}] Task concluída: ${stepName}`
              );
              AllureLogger.success(`Task concluída: ${stepName}`);
            } catch (error) {
              console.error(
                `${Actor.indent}[Test: ${testName}] [Actor: ${this.name}] `,
                error
              );
              throw new TaskFailedError(stepName, (error as Error).message);
            }
          }
        )
      )
    );
  }

  async asksFor<T extends string | number | boolean | null | undefined>(
    question: IQuestion<T>,
    options?: IQuestionValidationOptions<T>
  ): Promise<T> {
    const invalidValues =
      options?.invalidValues ?? ([false, null, undefined] as T[]);
    const ErrorClass = options?.errorClass ?? QuestionValidationError;

    return test.step(
      question.stepName?.() || `Question: ${question.constructor.name}`,
      async () => {
        const stepName = question.stepName?.() || question.constructor.name;
        const testName = test.info().title;
        console.info(
          `${Actor.indent}[Test: ${testName}] [Actor: ${this.name}] Respondendo Question: ${stepName}`
        );
        AllureLogger.info(`Respondendo Question: ${stepName}`);

        try {
          const result = await question.answeredBy(this);

          if (invalidValues.includes(result)) {
            const errorMessage =
              options?.errorMessage ??
              `Question "${stepName}" retornou valor inválido: ${result}`;
            console.error(
              `${Actor.indent}[Test: ${testName}] [Actor: ${this.name}] ${errorMessage}`
            );
            throw new ErrorClass(stepName, errorMessage);
          }

          console.info(
            `${Actor.indent}[Test: ${testName}] [Actor: ${this.name}] Question respondida: ${stepName} = ${result}`
          );
          AllureLogger.success(`Question respondida: ${stepName}`);
          return result;
        } catch (error) {
          console.error(
            `${Actor.indent}[Test: ${testName}] [Actor: ${this.name}] `,
            error
          );
          throw error;
        }
      }
    );
  }
}

```

## Atualizando o arquivo home (PageObject)

Para o page object a atualização é menos custosa, neste caso vamos apenas utilizar o wrapper do allure step de uma forma que envolva a classe toda. O wrapper irá identificar os métodos da classe e adicionar step em cada um deles.

**tests/pages/HomePage.ts**

```tsx
import { Page, expect } from "@playwright/test";
import { withAllureSteps } from "@utils/AllureStep"

class HomePageBase {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string = "/"): Promise<void> {
    await this.page.goto(url);
  }

  
  async expectHeroTitleVisible(title: string): Promise<void> {
    await expect(this.page.getByTestId("hero-title")).toHaveText(title);
  }
}

export const HomePage = withAllureSteps(HomePageBase, 'HomePage');

```

Teremos também uma atualização no arquivo de teste apenas para identificar a instância da page.

**tests/PageObject/home.spec.ts**

```tsx
import { test } from "@playwright/test";
import { HomePage } from "@pages/HomePage";

test.describe("Home Page Tests - Page Object", () => {
  let homePage: InstanceType<typeof HomePage>;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test("should navigate to the home page and verify hero title", async () => {
    await homePage.goto();
    await homePage.expectHeroTitleVisible("Test Automation Practice");
  });
});

```

---

# Implementações com APIs

Em nosso caso vamos utilizar a seguinte API para teste: https://demoqa.com/swagger/#/Account/AccountV1UserPost

Vamos criar um adapter para a API.

**src/adapters/api/DemoQAAccountApiAdapter.ts**

```tsx
import { IAccountApiPort } from "@interfaces/IAccountApiPort";
import { IUser, IUserCreationResponse } from "@interfaces/IUser";
import { APIRequestContext } from "@playwright/test";
import { ApiError } from "@errors/TestErrors";
import { AllureLogger } from "@utils/AllureLogger";

export class DemoQAAccountApiAdapter implements IAccountApiPort {
  private readonly baseUrl = "https://demoqa.com/Account/v1";

  constructor(private readonly request: APIRequestContext) {}

  async createUser(user: IUser): Promise<IUserCreationResponse> {
    const endpoint = `${this.baseUrl}/User`;

    try {
      AllureLogger.info(
        `Enviando requisição para criar usuário: { username: ${user.userName} }`
      );

      const response = await this.request.post(endpoint, {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        data: {
          userName: user.userName,
          password: user.password,
        },
      });

      const responseBody = await response.json();

      if (!response.ok()) {
        AllureLogger.error(
          `Falha na criação de usuário - Status: ${response.status()} - Detalhes: ${JSON.stringify(responseBody)}`
        );

        throw new ApiError(
          response.status(),
          endpoint,
          responseBody?.message ||
            `HTTP ${response.status()}: ${JSON.stringify(responseBody)}`
        );
      }

      AllureLogger.info(
        `Usuário criado com sucesso via API: { username: ${responseBody.username}, userID: ${responseBody.userID} }`
      );

      return responseBody;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      AllureLogger.error(
        `Erro inesperado ao criar usuário: ${(error as Error).message}`
      );
      throw new ApiError(
        0,
        endpoint,
        `Unexpected error: ${(error as Error).message}`
      );
    }
  }
}

```

Vamos criar uma nova habilidade para nosso actor.

**src/screenplay/abilities/CallAccountService.ts**

```tsx

import { IAbility } from "@framework/interfaces/IAbility";
import { IAccountApiPort } from "@interfaces/IAccountApiPort";

/**
 * Ability que permite ao Actor usar um AccountService
 * Encapsula o acesso ao service layer
 */
export class CallAccountService implements IAbility {
  constructor(private readonly accountService: IAccountApiPort) {}

  static using(accountService: IAccountApiPort): CallAccountService {
    return new CallAccountService(accountService);
  }

  get service(): IAccountApiPort {
    return this.accountService;
  }
}

```

Agora criaremos uma task para realizar o registro do user.

**src/screenplay/tasks/CreateUserViaService.ts**

```tsx

import { Actor } from '@screenplay/core/Actor';
import { CallAccountService } from '@screenplay/abilities/CallAccountService';
import { IUser } from '@interfaces/IUser';
import { ITask } from '@framework/interfaces/ITask';

/**
 * Task simples para criar um usuário via Service
 * Usa apenas a funcionalidade básica de criação sem validações extras
 */
export class CreateUserViaService implements ITask {
  private constructor(private readonly userData: IUser) {}

  static withCredentials(userName: string, password: string): CreateUserViaService {
    return new CreateUserViaService({ userName, password });
  }

  static withData(userData: IUser): CreateUserViaService {
    return new CreateUserViaService(userData);
  }

  stepName(): string {
    return `Criar usuário via Service: ${this.userData.userName}`;
  }

  async performAs(actor: Actor): Promise<void> {
    const accountService = actor.abilityTo(CallAccountService).service;

    try {
      const response = await accountService.createUser(this.userData);

      // Armazenar resposta no contexto do ator
      (actor as any).lastUserCreationResponse = response;

    } catch (error) {
      throw error;
    }
  }
}

```

Vamos criar uma question para validações

**src/screenplay/questions/ServiceValidations.ts**

```tsx
import { Actor } from "@screenplay/core/Actor";
import { IUserCreationResponse } from "@interfaces/IUser";
import { IQuestion } from "@framework/interfaces/IQuestion";

/**
 * Question para verificar se Service aplicou validações de negócio corretamente
 */
export class ServiceValidationsWereApplied implements IQuestion<boolean> {
  private constructor(private readonly expectedUserName: string) {}

  static for(userName: string): ServiceValidationsWereApplied {
    return new ServiceValidationsWereApplied(userName);
  }

  stepName(): string {
    return `Verificar se validações de negócio foram aplicadas para: ${this.expectedUserName}`;
  }

  async answeredBy(actor: Actor): Promise<boolean> {
    const creationResponse = (actor as any)
      .lastUserCreationResponse as IUserCreationResponse;

    if (!creationResponse) {
      return false;
    }

    const validations = {
      hasValidUsername: creationResponse.username === this.expectedUserName,
      hasValidUserId: !!(
        creationResponse.userID && creationResponse.userID.trim() !== ""
      ),
      hasBooksArray: Array.isArray(creationResponse.books),
      usernameMatches: creationResponse.username === this.expectedUserName,
    };

    const allValidationsPassed = Object.values(validations).every(
      (v) => v === true
    );

    return allValidationsPassed;
  }
}

```

Vamos agora criar um service para não utilizarmos o adapter diretamente.

**src/services/AccountService.ts**

```tsx
import { IAccountApiPort } from "@interfaces/IAccountApiPort";
import { IUser, IUserCreationResponse } from "@interfaces/IUser";
import { AllureLogger } from "@utils/AllureLogger";

export class AccountService implements IAccountApiPort {
  constructor(private readonly accountApiPort: IAccountApiPort) {}

  async createUser(userData: IUser): Promise<IUserCreationResponse> {
    // Validações de negócio antes de chamar o adapter
    this.validateUserData(userData);

    try {
      const response = await this.accountApiPort.createUser(userData);

      // Lógica de negócio pós-criação
      await this.logUserCreation(response);

      return response;
    } catch (error) {
      throw error;
    }
  }

  private validateUserData(userData: IUser): void {
    if (!userData.userName || userData.userName.trim() === "") {
      throw new Error("Username é obrigatório");
    }

    if (!userData.password || userData.password.length < 6) {
      throw new Error("Password deve ter pelo menos 6 caracteres");
    }

    // Validações específicas do DemoQA
    if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(userData.password)) {
      throw new Error(
        "Password deve conter pelo menos: 1 maiúscula, 1 número, 1 caractere especial"
      );
    }
  }

  private async logUserCreation(
    response: IUserCreationResponse
  ): Promise<void> {
    AllureLogger.info(
      `[SERVICE] Usuário registrado no sistema - ${response.username}`
    );
  }
}

```

---

## Teste com screenplay

Para o teste com screenplay vemos que utilizamos inversão de dependências e passamos o adapter para o service e passamos o service para a ability do actor.

**tests/Screenplay/account_api.spec.ts**

```tsx

import { DemoQAAccountApiAdapter } from "@framework/adapters/api/DemoQAAccountApiAdapter";
import { IAccountApiPort } from "@interfaces/IAccountApiPort";
import { test, expect } from "@playwright/test";
import { CallAccountService } from "@screenplay/abilities/CallAccountService";
import { Actor } from "@screenplay/core/Actor";
import { ServiceValidationsWereApplied } from "@screenplay/questions/ServiceValidations";
import { CreateUserViaService } from "@screenplay/tasks/CreateUserViaService";
import { AccountService } from "@services/AccountService";

test.describe("DemoQA Account API Tests - Service Layer Architecture", () => {
  let actor: Actor;
  let accountService: IAccountApiPort;

  test.beforeEach(async ({ request }) => {
    // 1. Adapter (Infraestrutura - Comunicação HTTP)
    const apiAdapter = new DemoQAAccountApiAdapter(request);

    // 2. Service (Domínio - Lógica de Negócio)
    accountService = new AccountService(apiAdapter);

    // 3. Actor com habilidade de usar Service
    actor = Actor.named("API Tester").whoCan(
      CallAccountService.using(accountService)
    );
  });

  test("Must register user using Service with business validations", async () => {
    const userName = `serviceuser_${Date.now()}`;
    const password = "784512Asd!";

    await actor.attemptsTo(
      CreateUserViaService.withCredentials(userName, password)
    );

    const validationsApplied = await actor.asksFor(
      ServiceValidationsWereApplied.for(userName)
    );

    expect(validationsApplied).toBe(true);

    // Verificação adicional dos dados básicos
    const response = (actor as any).lastUserCreationResponse;
    expect(response.username).toBe(userName);
    expect(response.userID).toBeTruthy();
  });

  test("Service must validate invalid password before calling API", async () => {
    const userName = `invalidpass_${Date.now()}`;
    const invalidPassword = "123"; // Não atende critérios de negócio

    // Service deve falhar na validação antes mesmo de chamar o Adapter
    await expect(
      actor.attemptsTo(
        CreateUserViaService.withCredentials(userName, invalidPassword)
      )
    ).rejects.toThrow("Password deve ter pelo menos 6 caracteres");
  });

  test("Service must validate empty username before calling API", async () => {
    const emptyUserName = "";
    const password = "784512Asd!";

    // Service deve falhar na validação de username vazio
    await expect(
      actor.attemptsTo(
        CreateUserViaService.withCredentials(emptyUserName, password)
      )
    ).rejects.toThrow("Username é obrigatório");
  });

  test("Should fail when trying to create duplicate user (validation via Service)", async () => {
    const userName = `duplicate_${Date.now()}`;
    const password = "784512Asd!";

    // Criar primeiro usuário
    await actor.attemptsTo(
      CreateUserViaService.withCredentials(userName, password)
    );

    // Tentar criar usuário duplicado deve falhar
    await expect(
      actor.attemptsTo(CreateUserViaService.withCredentials(userName, password))
    ).rejects.toThrow();
  });
});

```

## Teste com page object

No page object como não temos ability passamos o adapter para o service e utilizamos o service nos testes.

**tests/PageObject/account_api.spec.ts**

```tsx

import { DemoQAAccountApiAdapter } from "@framework/adapters/api/DemoQAAccountApiAdapter";
import { IAccountApiPort } from "@interfaces/IAccountApiPort";
import { IUser } from "@interfaces/IUser";
import { test, expect } from "@playwright/test";
import { AccountService } from "@services/AccountService";

test.describe("DemoQA Account API Tests - Page Object Pattern", () => {
  let accountService: IAccountApiPort;

  test.beforeEach(async ({ request }) => {
    // 1. Adapter (Infraestrutura - Comunicação HTTP)
    const apiAdapter = new DemoQAAccountApiAdapter(request);

    // 2. Service (Domínio - Lógica de Negócio)
    accountService = new AccountService(apiAdapter);
  });

  test("Must register a new user", async () => {
    const userName = `testuser_${Date.now()}`;
    const password = "784512Aas!";
    const user: IUser = { userName, password };

    const response = await accountService.createUser(user);

    expect(response.username).toBe(userName);
    expect(response.userID).toBeDefined();
    expect(response.userID).not.toBe("");
    expect(response.books).toEqual([]);
  });

  test("Should fail when trying to create user with invalid password", async () => {
    const userName = `invaliduser_${Date.now()}`;
    const password = "123"; // Senha muito simples
    const user: IUser = { userName, password };

    await expect(accountService.createUser(user)).rejects.toThrow();
  });

  test("Should fail when trying to create duplicate user", async () => {
    const userName = `duplicateuser_${Date.now()}`;
    const password = "784512Asd!";
    const user: IUser = { userName, password };

    // Criar primeiro usuário
    await accountService.createUser(user);

    // Tentar criar usuário com mesmo nome deve falhar
    await expect(accountService.createUser(user)).rejects.toThrow();
  });
});

```

# Atualizando as configurações globais do projeto

Por fim para utilizarmos todos os recursos implementado vamos atualizar nosso arquivo playwright.config.ts para a seguinte configuração.

**playwright.config.ts**

```tsx
import {
  defineConfig,
  devices,
  PlaywrightTestConfig,
  TraceMode,
  ScreenshotMode,
  VideoMode,
  ReporterDescription,
} from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

const ENV = process.env.ENV || "uat";
dotenv.config({ path: path.resolve(__dirname, `${ENV}.env`), quiet: true });

const requiredEnvVars = ["BASE_URL"];
for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    throw new Error(
      `Variável de ambiente obrigatória ${varName} não está definida para o ambiente ${ENV}`
    );
  }
}

function parseTraceMode(value?: string): TraceMode | undefined {
  const valid: TraceMode[] = [
    "off",
    "on",
    "on-first-retry",
    "retain-on-failure",
  ];
  if (value && valid.includes(value as TraceMode)) return value as TraceMode;
  return undefined;
}

function parseScreenshotMode(value?: string): ScreenshotMode | undefined {
  const valid: ScreenshotMode[] = ["off", "on", "only-on-failure"];
  if (value && valid.includes(value as ScreenshotMode))
    return value as ScreenshotMode;
  return undefined;
}

function parseVideoMode(value?: string): VideoMode | undefined {
  const valid: VideoMode[] = ["off", "on", "retain-on-failure"];
  if (value && valid.includes(value as VideoMode)) return value as VideoMode;
  return undefined;
}

function parseReport(): string | ReporterDescription[] {
  const reporters = process.env.REPORTER?.split(",").map((r) => r.trim()) || [
    "html",
  ];

  if (reporters.length === 1) {
    const [name, options] = parseReporterWithOptions(reporters[0]);
    if (options) {
      return [[name, options]];
    }
    return name;
  }

  return reporters.map((r) => {
    const [name, options] = parseReporterWithOptions(r);
    return options ? ([name, options] as const) : ([name] as const);
  });
}

function parseReporterWithOptions(input: string): [string, any?] {
  const [name, opts] = input.split(":");
  if (!opts) return [name];

  const options = opts.split(";").reduce((acc, pair) => {
    const [key, value] = pair.split("=");
    if (key && value !== undefined) {
      if (value === "true") acc[key] = true;
      else if (value === "false") acc[key] = false;
      else if (!isNaN(Number(value))) acc[key] = Number(value);
      else acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);

  return [name, options];
}

const commonUseOptions: PlaywrightTestConfig["use"] = {
  baseURL: process.env.BASE_URL,
  trace: parseTraceMode(process.env.TRACE) ?? "off",
  screenshot: parseScreenshotMode(process.env.SCREENSHOT) ?? "off",
  video: parseVideoMode(process.env.VIDEO) ?? "off",
  headless: process.env.HEADLESS !== "false",
  actionTimeout: Number(process.env.ACTION_TIMEOUT) || 15000,
  navigationTimeout: Number(process.env.NAVIGATION_TIMEOUT) || 30000,
};

const isCI = !!process.env.CI;
const retries = isCI ? Number(process.env.RETRIES) || 2 : 0;
const workers = isCI ? 1 : undefined;

const config: PlaywrightTestConfig = defineConfig({
  globalSetup: require.resolve("./tests/global-setup"),
  globalTeardown: require.resolve("./tests/global-teardown"),
  testDir: "./tests/",
  fullyParallel: true,
  forbidOnly: isCI,
  retries,
  workers,
  reporter: parseReport(),
  timeout: Number(process.env.TEST_TIMEOUT) || 60000,
  use: commonUseOptions,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testMatch: process.env.TEST_CHROMIUM === "false" ? [] : undefined,
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      testMatch: process.env.TEST_FIREFOX === "false" ? [] : undefined,
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      testMatch: process.env.TEST_WEBKIT === "false" ? [] : undefined,
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
      testMatch: process.env.TEST_MOBILE === "false" ? [] : undefined,
    },
  ],
});

export default config;

```

E nosso arquivo de variáveis de ambiente deve ficar semelhante a:

uat.env

```bash

BASE_URL=https://test-automation-practice.com.br/
HEADLESS=false
CI=false
TRACE=off
SCREENSHOT=only-on-failure
VIDEO=off
ACTION_TIMEOUT=15000
NAVIGATION_TIMEOUT=30000
TEST_TIMEOUT=60000
RETRIES=0
REPORTER=allure-playwright:outputFolder=allure-results
TEST_CHROMIUM=true
TEST_FIREFOX=false
TEST_WEBKIT=false
TEST_MOBILE=false

MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=testdb
MYSQL_USER=testuser
MYSQL_PASSWORD=testpassword

DB_NAME=testdb
DB_USER=testuser
DB_PASSWORD=testpassword
DB_HOST=localhost
DB_PORT=3306
```

Lembrando que podemos adicionar mais configurações conforme nossa necessidade.

---

## Estrutura do Projeto


    ├── src
    │   ├── adapters
    │   │   ├── api
    │   │   │   └── DemoQAAccountApiAdapter.ts
    │   │   ├── database
    │   │   │   ├── DatabaseConnection.ts
    │   │   │   └── MySQLAdapter.ts
    │   │   └── pages
    │   │       └── HomePage.ts
    │   ├── errors
    │   │   └── TestErrors.ts
    │   ├── fixtures
    │   │   └── dbAdapter.ts
    │   ├── interfaces
    │   │   ├── IAbility.ts
    │   │   ├── IAccountApiPort.ts
    │   │   ├── IApiError.ts
    │   │   ├── IDatabaseAdapter.ts
    │   │   ├── IDbConfig.ts
    │   │   ├── IQuestion.ts
    │   │   ├── IQuestionValidationOptions.ts
    │   │   ├── ITask.ts
    │   │   └── IUser.ts
    │   ├── repositories
    │   │   └── UserRepository.ts
    │   ├── screenplay
    │   │   ├── abilities
    │   │   │   ├── AccessDatabase.ts
    │   │   │   ├── BrowseTheWeb.ts
    │   │   │   └── CallAccountService.ts
    │   │   ├── core
    │   │   │   └── Actor.ts
    │   │   ├── questions
    │   │   │   ├── DoesDataExist.ts
    │   │   │   ├── IsHeroTitleVisible.ts
    │   │   │   ├── QueryDatabase.ts
    │   │   │   └── ServiceValidations.ts
    │   │   └── tasks
    │   │       ├── CreateUserViaService.ts
    │   │       ├── ExecuteSqlScript.ts
    │   │       ├── ExecuteSqlScriptWithValues.ts
    │   │       └── NavigateTo.ts
    │   ├── services
    │   │   ├── AccountService.ts
    │   │   └── DbService.ts
    │   ├── sql
    │   │   ├── test.sql
    │   │   └── users_replace.sql
    │   └── utils
    │       ├── AllureLogger.ts
    │       └── AllureStep.ts
    ├── tests
    │   ├── global-setup.ts
    │   ├── global-teardown.ts
    │   ├── PageObject
    │   │   ├── account_api.spec.ts
    │   │   ├── connect_database.spec.ts
    │   │   └── home.spec.ts
    │   ├── Screenplay
    │   │   ├── account_api.spec.ts
    │   │   ├── connect_database.spec.ts
    │   │   └── home.spec.ts
    │   ├── tsconfig.json



---

### **src/ — Núcleo do framework de testes**
Aqui está localizado o framework em si, ou seja, toda a infraestrutura, lógica de negócio e suporte que tornam os testes reutilizáveis, independentes e organizados.

Ele traz a separação entre infraestrutura (adapters), contratos (interfaces), serviços, padrões de automação (page objects, screenplay) e utilidades.

---

### **adapters/ — Pontos de integração com sistemas externos**
Responsável por implementar as “portas” definidas em interfaces, conectando o framework a recursos externos.

---

- **api/**
  - **DemoQAAccountApiAdapter.ts** → Implementa chamadas reais para a API DemoQA usando Playwright APIRequestContext. É a camada de infraestrutura para serviços HTTP.
- **database/**
  - **DatabaseConnection.ts** → Gerencia o ciclo de vida de conexões com o banco, garantindo reuso com Singleton e suporte a múltiplos bancos de dados.
  - **MySQLAdapter.ts** → Implementação do IDatabaseAdapter, conectando via MySQL, abstraindo queries, execuções de scripts, transações e oferecendo suporte a pooling de conexões para maior eficiência.

- **pages/**
  - **HomePage.ts**→ Implementa o Page Object Model (POM) para a página Home.
É a camada que encapsula interação com a interface da aplicação web.

Resumo: os adapters são implementações concretas de integração, mas desacopladas do domínio. Se amanhã fosse necessário mudar de MySQL para PostgreSQL ou trocar a API DemoQA por outra, apenas os adapters mudariam.

---

### **errors/ — Tratamento estruturado de erros**
  - **TestErrors.ts** → Define erros customizados (ex.: TaskFailedError, DatabaseConnectionError, etc.).

Isso profissionaliza o tratamento de falhas, permitindo relatórios mais claros no Allure e logs mais úteis para debugging.

### **fixtures/ — Injeção de dependências para os testes**
- **dbAdapter.ts**→ Cria fixtures customizadas do Playwright, injetando instâncias de banco de dados por worker de teste.

Garante que testes possam consumir dependências configuradas sem precisar instanciá-las repetidamente.

### **interfaces/ — Contratos e abstrações**
Define portas (ports) que devem ser implementadas pelos adapters e consumidas pelos services.

Principais contratos:

- IAbility.ts → Define habilidades do ator no Screenplay.
- IAccountApiPort.ts → Porta de comunicação com serviços de “Account”.
- IApiError.ts → Contrato para representar erros de API.
- IDatabaseAdapter.ts → Porta de acesso a banco de dados.
- IDbConfig.ts → Estrutura de configuração de conexões.
- IQuestion.ts, ITask.ts, IQuestionValidationOptions.ts → Contratos básicos do Screenplay.
- IUser.ts → Representação de entidade de usuário.

Resumo: garantem desacoplamento entre domínio, serviços e infraestrutura.

### **repositories/ — Acesso especializado a entidades**
  - **UserRepository.ts** → Implementa acesso a entidade Usuário no banco de dados, aplicando regras específicas (CRUD, buscas).

Diferença para o DbService:

- O service DB é genérico (executa qualquer SQL).
- O repository é especializado e orientado a entidades de domínio.

### **screenplay/** — Implementação do Screenplay Pattern

Promovendo a separação de responsabilidades e reutilização de código.

**abilities/**
- **BrowseTheWeb.ts** → Permite ao ator navegar no browser.
- **AccessDatabase.ts**→ Concede habilidade de interagir com bancos via DbService.
- **CallAccountService.ts** → Dá acesso ao serviço de API do domínio.

**core/**
- **Actor.ts** → Classe principal do padrão Screenplay.
  - Permite ao ator executar tarefas (ITask) e responder perguntas (IQuestion), desde que possua as habilidades necessárias (IAbility).

**tasks/**
- **NavigateTo.ts**→ Navegar para uma URL.
- **ExecuteSqlScript.ts** e ExecuteSqlScriptWithValues.ts → Executar consultas SQL.
- **CreateUserViaService.ts** → Criar usuário via serviço de API.

**questions/**
- **IsHeroTitleVisible.ts**→ Validação na UI via Playwright.
- **DoesDataExist.ts** → Valida se um dataset retornado do banco contém registros.
- **QueryDatabase.ts** → Consulta banco de dados.
- **ServiceValidations.ts** → Validações pós-interação com APIs.

Resumo: traduz o comportamento do usuário/sistema em um DSL (linguagem de alto nível) para automação de testes.

### **services/ — Regras de negócio e orquestração**
- **AccountService.ts** → Centraliza regras para criação/validação de usuários via API.
Não chama o adapter diretamente: aplica lógicas de validação e negócio antes/depois.
- **DbService.ts** → Camada intermediária entre testes/repos e o adapter de banco.
Aplica padronização (ex.: logs, attachments no Allure, trace).
Resumo: abstraem a infraestrutura para um nível de domínio mais expressivo.

### **sql/ — Scripts SQL reutilizáveis**
Scripts versionados para seed/setup/execução em testes.

**test.sql**→ consulta completa de usuários.
**users_replace.sql** → consulta parametrizada com placeholders ($$).

### **utils/ — Utilitários do framework**
- **AllureLogger.ts** → Facilita registrar steps, anexos e mensagens customizadas no Allure.
- **AllureStep.ts** → Decorator para adicionar automaticamente steps Allure em métodos de classes (ex.: PageObjects).

### **tests/ — Suites de testes**
Aqui ficam os testes automatizados em si, separados por padrão de implementação.

- **global-setup.ts / global-teardown.ts**
Executados antes/depois da suite de testes para configurar recursos globais (ex.: abrir e fechar conexões com banco).

- **PageObject/**
  - **home.spec.ts** → Testes da Home usando POM.
  - **account_api.spec.ts** → Testes de Account API via Service + Adapter.
  - **connect_database.spec.ts** → Testes DB usando repositórios/serviços.

- **Screenplay/**
  - **home.spec.ts** → Versão equivalente utilizando padrão Screenplay.
  - **account_api.spec.ts** → Testes de criação de usuário via Actor + abilities + tasks.
  - **connect_database.spec.ts**→ Testes de database orientados a atores/tasks.

Resumo: permitem comparar dois estilos de escrita de testes (POM vs Screenplay) consumindo a mesma arquitetura de suporte.

## Resumo da Arquitetura

- Camadas externas (adapters): UI (Page), API, Database.
- Camada intermediária (services/repos): lógica de negócio e persistência orientada a entidades.
- Camada de domínio (interfaces + screenplay): descreve “o que” e não “como”, com alto nível de abstração.
- Layer de testes (specs): consome toda essa infraestrutura escrevendo casos em dois estilos diferentes (POM ou Screenplay).

Isso garante baixo acoplamento, alta testabilidade e flexibilidade para evoluir o projeto.
