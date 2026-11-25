# SauceDemo Playwright Tests

This project uses JavaScript and Playwright Test to check the login and shopping
cart flows on [SauceDemo](https://www.saucedemo.com/). Page objects keep browser
interactions separate from test expectations.

## Project structure

```text
playwright-test-SauceDemo/
├── tests/
│   ├── pages/
│   │   ├── CartPage.js
│   │   ├── InventoryPage.js
│   │   ├── InventoryItemPage.js
│   │   └── LoginPage.js
│   ├── cart.spec.js
│   ├── inventoryItem.spec.ts
│   └── login.spec.js
├── .gitignore
├── package.json
└── playwright.config.js
```

## Setup

Install Node.js LTS, then run these commands from the project folder:

```powershell
npm install
npx playwright install chromium
```

## Run the tests

```powershell
npm test
```

The inventory-item spec is named `inventoryItem.spec.ts` as requested, but its
test code uses JavaScript/CommonJS syntax and the existing JavaScript page
objects; it does not add TypeScript types.

Run tests with the browser visible:

```powershell
npm run test:headed
```

Open the HTML report from the most recent run:

```powershell
npm run report
```

Playwright saves screenshots and traces for failed tests in `test-results/`.
Generated reports and test output are ignored by Git.

## Render report site

`render.yaml` describes a Render Static Site that builds and hosts the Playwright
HTML report. It installs Chromium, runs the test suite, and publishes
`playwright-report/` when the build succeeds. This deploys the test report, not
the SauceDemo application.

To create the site, sign in to [Render](https://dashboard.render.com/), choose
**New > Blueprint**, connect this GitHub repository, and apply the Blueprint.
Render will build again when changes are pushed to `main`.

## Page Object Model

Each class in `tests/pages/` receives a Playwright `page` in its constructor.
The class owns selectors for that page and exposes methods for user actions:

- `LoginPage` opens the site and fills in the login form.
- `InventoryPage` adds a named product and opens the cart.
- `CartPage` lists and removes products.

The spec files describe the scenario and assert the result. For example, the
cart test calls `addProductToCart()` rather than repeating the product-card
selector and button click in the test.

## Test hooks

- `test.beforeEach()` runs before every test in its scope. The login spec uses it
  to open the login form. The cart spec uses it to log in and prepare the cart.
- `test.afterEach()` runs after every test. It is useful for cleanup that is not
  automatic, such as deleting a record created through an API. These UI tests do
  not need it: Playwright creates a fresh browser context for each test and
  closes it automatically.
- `test.beforeAll()` runs once before the tests in a file (per worker).
- `test.afterAll()` runs once after those tests (per worker).

Use the last two hooks to manage a resource genuinely shared by tests, not to
share a page between tests. For example, an API request context can be created
once and disposed once:

```js
const { test, request } = require('@playwright/test');

let apiContext;

test.beforeAll(async () => {
  apiContext = await request.newContext({
    baseURL: 'https://www.saucedemo.com',
  });
});

test.afterAll(async () => {
  await apiContext.dispose();
});
```

This example explains the lifecycle; it is not needed by the current browser
tests. Keeping each test's browser context isolated helps tests run independently
and avoids state leaking between them.

## Recorded tests and Codegen

Playwright Codegen is useful for discovering selectors and recording a first
draft:

```powershell
npx playwright codegen https://www.saucedemo.com/
```

Treat recorded code as a starting point. Move reusable selectors and actions
into the relevant page class, then keep the test focused on the scenario and
its expected result.
