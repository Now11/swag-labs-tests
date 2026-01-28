# Best Practices & Guidelines

This document describes the coding standards, architectural patterns, and guidelines for writing tests in this framework.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Page Object Pattern](#page-object-pattern)
- [Component Pattern](#component-pattern)
- [Element Pattern](#element-pattern)
- [Writing New Tests](#writing-new-tests)
- [Test Tagging](#test-tagging)
- [Naming Conventions](#naming-conventions)
- [Locator Strategy](#locator-strategy)
- [Assertions](#assertions)
- [Test Data Management](#test-data-management)
- [CI/CD with GitHub Actions](#cicd-with-github-actions)

---

## Architecture Overview

The framework follows a layered architecture:

```
Tests → Fixtures → Pages → Components → Elements → Playwright API
```

Each layer has a specific responsibility:

| Layer | Responsibility |
|-------|---------------|
| **Tests** | Test scenarios, assertions, test flow |
| **Fixtures** | Test setup, authentication state, app instance |
| **Pages** | Page-level actions, URL, page-specific components |
| **Components** | Reusable UI component interactions |
| **Elements** | Low-level element wrappers (Button, Input, etc.) |

---

## Page Object Pattern

### Structure

Each page is a directory with `index.ts` containing the page class:

```
src/pages/
└── page-name/
    ├── index.ts              # Page class (exported)
    └── components/           # Page-specific components
        └── Component.component.ts
```

### Rules

1. **Page class must be in `index.ts`** - not a separate file
2. **Export only the page class** from `index.ts`
3. **Extend `BasePage`** for common functionality
4. **Use `@step` decorator** for all public methods

### Example

```typescript
// src/pages/inventory/index.ts
import { BasePage } from '../Base.page.js';
import { ProductsListComponent } from './components/ProductsList.component.js';
import { HeaderComponent } from '@src/shared-components/Header.component.js';
import { step } from '@src/utils/decorators.js';

export class InventoryPage extends BasePage {
  protected readonly url = '/inventory.html';

  readonly productsList = new ProductsListComponent(this.page);
  readonly header = new HeaderComponent(this.page);

  @step('Verify inventory page is opened')
  async shouldBeOpened(): Promise<void> {
    await expect(this.page).toHaveURL(/.*inventory\.html/);
  }

  @step('Sort products by:', ([option]) => option)
  async sortBy(option: string): Promise<void> {
    await this.sortDropdown.selectOption({ label: option });
  }
}
```

---

## Component Pattern

### When to Create a Component

- UI element appears on multiple pages (Header, BurgerMenu)
- UI element has complex interactions (ProductsList, LoginForm)
- UI element groups related locators (CartItem, Product)

### Structure

```typescript
// src/pages/inventory/components/Product.component.ts
import type { Locator } from '@playwright/test';
import { step } from '@src/utils/decorators.js';

export class ProductComponent {
  private readonly name = this.root.locator('[data-test="inventory-item-name"]');
  private readonly price = this.root.locator('[data-test="inventory-item-price"]');
  private readonly addToCartButton = this.root.locator('[data-test*="add-to-cart"]');

  constructor(public readonly root: Locator) {}

  @step('Add product to cart')
  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  @step('Get product name')
  async getName(): Promise<string> {
    return this.name.innerText();
  }
}
```

### Returning New Page/Component Instances

When an action navigates to a new page or opens a component, **return the new instance**:

```typescript
// Good - returns new page instance
@step('Open cart')
async openCart(): Promise<CartPage> {
  await this.cartButton.click();
  const cartPage = new CartPage(this.page);
  await cartPage.shouldBeOpened();
  return cartPage;
}

// Good - returns new component instance
@step('Open menu')
async openMenu(): Promise<BurgerMenuComponent> {
  await this.menuButton.click();
  const menu = new BurgerMenuComponent(this.page);
  await menu.shouldBeVisible();
  return menu;
}
```

---

## Element Pattern

Base elements wrap common interactions:

```typescript
// src/elements/Button.element.ts
export class ButtonElement extends BaseElement {
  @step('Click button')
  async click(): Promise<void> {
    await this.root.click();
  }

  @step('Button should be visible')
  async shouldBeVisible(): Promise<void> {
    await expect(this.root).toBeVisible();
  }
}
```

Use elements for:
- Buttons with click actions
- Input fields with fill/clear actions
- Common reusable interactions

---

## Authentication Strategy

Authentication is implemented as a **precondition** using Playwright's storage state feature:

1. **Setup project** (`hooks/auth.setup.ts`) runs before all tests
2. Performs login and saves session to `auth.json`
3. `authorizedFixture` loads `auth.json` into browser context
4. Tests start already authenticated - no login needed per test

```
┌─────────────────┐     ┌─────────────┐     ┌──────────────────┐
│  auth.setup.ts  │ ──▶ │  auth.json  │ ──▶ │ authorizedFixture│
│  (login once)   │     │  (session)  │     │  (reuse session) │
└─────────────────┘     └─────────────┘     └──────────────────┘
```

This approach:
- Reduces test execution time (login once, not per test)
- Tests are isolated (each gets fresh context with same auth state)
- Mimics real user behavior (session persistence)

---

## Writing New Tests

### Step-by-Step Guide

1. **Choose the right fixture**:
   - `guestFixture` - for unauthenticated tests (login page)
   - `authorizedFixture` - for authenticated tests (uses `auth.json` storage state)

2. **Add test case ID and tags**:
   ```typescript
   authorizedFixture(
     'TC-CART-001: Should add product to cart',
     { tag: [Priority.CRITICAL] },
     async ({ app }) => {
       // test code
     }
   );
   ```

3. **Use page objects from `app`**:
   ```typescript
   async ({ app: { inventoryPage, cartPage } }) => {
     await inventoryPage.open();
     const product = inventoryPage.productsList.getProductByName('Backpack');
     await product.addToCart();
   }
   ```

4. **Follow AAA pattern** (Arrange, Act, Assert):
   ```typescript
   // Arrange
   await inventoryPage.open();
   const product = inventoryPage.productsList.getProductByName(backpack.name);

   // Act
   await product.addToCart();

   // Assert
   await product.shouldHaveRemoveButton();
   ```

### Test Template

```typescript
import { authorizedFixture } from '@fixtures/authorized.fixture.js';
import { Priority, TestType } from '@src/utils/constants/priority.constants.js';
import { products } from 'test-data/products.js';

const { backpack } = products;

authorizedFixture.describe('Feature Name', () => {
  authorizedFixture.beforeEach(async ({ app: { inventoryPage } }) => {
    await inventoryPage.open();
  });

  authorizedFixture(
    'TC-XXX-001: Should do something',
    { tag: [Priority.HIGH] },
    async ({ app: { inventoryPage } }) => {
      // Test implementation
    }
  );

  // Negative test example
  authorizedFixture(
    'TC-XXX-002: Should show error when invalid',
    { tag: [Priority.HIGH, TestType.NEGATIVE] },
    async ({ app: { inventoryPage } }) => {
      // Test implementation
    }
  );
});
```

---

## Test Tagging

### Priority Tags

```typescript
import { Priority, TestType } from '@src/utils/constants/priority.constants.js';

// Priority levels
Priority.CRITICAL  // @critical - Must pass for release
Priority.HIGH      // @high - Important functionality
Priority.MEDIUM    // @medium - Nice to have
Priority.LOW       // @low - Edge cases

// Test types
TestType.NEGATIVE  // @negative - Error/validation tests
```

### Usage

```typescript
// Single tag
{ tag: [Priority.CRITICAL] }

// Multiple tags
{ tag: [Priority.HIGH, TestType.NEGATIVE] }
```

### Running Tests

Tests are run via `npm run test:local` which uses `source .env` to load local environment variables (sensitive data like credentials may be stored there in the future).

```bash
# Run all tests
npm run test:local

# Run with specific tag
npm run test:local -- --grep @critical
npm run test:local -- --grep "@critical|@high"
npm run test:local -- --grep @negative

# Exclude tag
npm run test:local -- --grep-invert @negative
```

---

## Naming Conventions

### Files

| Type | Pattern | Example |
|------|---------|---------|
| Page | `index.ts` in page directory | `src/pages/login/index.ts` |
| Component | `Name.component.ts` | `LoginForm.component.ts` |
| Element | `Name.element.ts` | `Button.element.ts` |
| Test | `feature.test.ts` | `login.test.ts` |
| Test (negative) | `feature.negative.test.ts` | `login.negative.test.ts` |

### Classes

| Type | Pattern | Example |
|------|---------|---------|
| Page | `{Name}Page` | `LoginPage`, `CartPage` |
| Component | `{Name}Component` | `HeaderComponent` |
| Element | `{Name}Element` | `ButtonElement` |

### Methods

| Type | Pattern | Example |
|------|---------|---------|
| Action | `verbNoun()` | `addToCart()`, `openMenu()` |
| Getter | `get{Property}()` | `getName()`, `getPrice()` |
| Assertion | `should{Condition}()` | `shouldBeVisible()`, `shouldHaveText()` |

---

## Locator Strategy

### Priority Order

1. **`data-test` attributes** (preferred)
   ```typescript
   this.page.locator('[data-test="inventory-item-name"]')
   ```

2. **ID** (when unique and stable)
   ```typescript
   this.page.locator('#react-burger-menu-btn')
   ```

3. **Role-based** (for accessibility)
   ```typescript
   this.page.getByRole('button', { name: 'Login' })
   ```

4. **CSS selectors** (last resort)
   ```typescript
   this.page.locator('.inventory_item_img')
   ```

### Avoid

- XPath (fragile, hard to read)
- Positional selectors (`nth-child`, indexes)
- Text-based selectors for dynamic content

---

## Assertions

### Use Page Object Assertions

```typescript
// Good - encapsulated assertion
await cartPage.shouldHaveItemsCount(3);
await product.shouldHavePrice('$29.99');

// Avoid - raw assertion in test
await expect(page.locator('.cart-item')).toHaveCount(3);
```

### Assertion Method Pattern

```typescript
@step('Verify item count:', ([expected]) => expected)
async shouldHaveItemsCount(expected: number): Promise<void> {
  await expect(this.cartList).toHaveCount(expected);
}
```

---

## Test Data Management

### Structure

```
test-data/
├── users.ts            # User credentials
├── products.ts         # Product data (hardcoded)
├── error-messages.ts   # Expected error messages
└── success-messages.ts # Expected success messages
```

> **Note:** Currently `products.ts` contains hardcoded product data. This is not ideal for maintainability - if product prices or names change on the site, tests will fail. In a real-world scenario, test data should be:
> - Created dynamically via API before tests
> - Fetched from API/database at runtime
> - Managed through a test data management system

### Usage

```typescript
import { users } from 'test-data/users.js';
import { products } from 'test-data/products.js';
import { errorMessages } from 'test-data/error-messages.js';

const { standardUser } = users;
const { backpack } = products;

// In test
await loginPage.login(standardUser);
await errorMessage.shouldHaveText(errorMessages.USERNAME_REQUIRED);
```

### Guidelines

- Keep test data in dedicated files
- Use TypeScript interfaces for type safety
- Don't hardcode values in tests
- Use descriptive names for data objects

---

## The `@step` Decorator

All public methods in pages/components should use the `@step` decorator for better reporting:

```typescript
// Simple step
@step('Click login button')
async clickLogin(): Promise<void> {
  await this.loginButton.click();
}

// Step with dynamic parameter
@step('Verify price:', ([expected]) => expected)
async shouldHavePrice(expected: string): Promise<void> {
  await expect(this.price).toHaveText(expected);
}

// Step with multiple parameters
@step('Fill checkout info:', ([first, last]) => `${first} ${last}`)
async fillInfo(firstName: string, lastName: string): Promise<void> {
  // ...
}
```

---

## CI/CD with GitHub Actions

The project uses GitHub Actions for running E2E tests in CI/CD. The workflow is located at `.github/workflows/playwright.yml`.

### Workflow Structure

```
tests-e2e → upload-artifacts
```

The pipeline consists of two jobs:

1. **Run E2E Tests** - installs dependencies, sets up Playwright, runs tests
2. **Upload Artifacts** - separates test reports into individual downloadable artifacts

### Key Features

#### Manual Trigger Only

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options:
          - dev
```

Tests run only when manually triggered via GitHub Actions UI. This prevents unnecessary CI minutes consumption on every push and gives full control over when tests execute.

#### Environment Selection

The workflow supports environment selection through `workflow_dispatch` inputs. Environment variables are loaded from `envs-config/$ENVIRONMENT.env` before test execution:

```yaml
- name: Run Playwright tests
  run: |
    source envs-config/$ENVIRONMENT.env
    npm run test:e2e
```

To add a new environment (e.g., staging), add the corresponding file `envs-config/staging.env` and update the workflow options.

#### Node.js Version from `.nvmrc`

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version-file: '.nvmrc'
    cache: 'npm'
```

Node version is read from `.nvmrc` file, ensuring consistency between local development and CI. The `cache: 'npm'` option caches `node_modules` for faster subsequent runs.

#### Playwright Browser Caching

```yaml
- name: Cache Playwright browsers
  uses: actions/cache@v4
  id: playwright-cache
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ runner.os }}-${{ hashFiles('package-lock.json') }}

- name: Install Playwright browsers
  if: steps.playwright-cache.outputs.cache-hit != 'true'
  run: npx playwright install --with-deps chromium

- name: Install Playwright OS dependencies
  if: steps.playwright-cache.outputs.cache-hit == 'true'
  run: npx playwright install-deps chromium
```

Browser binaries are cached to avoid re-downloading on every run. However, OS-level dependencies (system libraries) cannot be cached and must be installed each time via `install-deps`.

#### Artifacts on Failure

```yaml
- name: Upload test results
  uses: actions/upload-artifact@v4
  if: ${{ !cancelled() }}
```

The `if: ${{ !cancelled() }}` condition ensures test reports are uploaded even when tests fail. This is critical for debugging failed test runs.

#### Separate Report Artifacts

Reports are split into separate artifacts for convenience:

- `playwright-report-html` - HTML report for visual inspection
- `playwright-report-json` - JSON report for programmatic processing

#### S3 Report Upload

HTML reports are automatically uploaded to AWS S3 for easy sharing and viewing without downloading artifacts.

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: ${{ vars.AWS_REGION }}

- name: Upload HTML report to S3
  run: |
    aws s3 cp pw-report-html/ s3://${{ vars.AWS_S3_BUCKET }}/${{ github.run_id }}/ --recursive
```

Each workflow run uploads to a unique folder (`run_id`), so reports don't overwrite each other.

**Required GitHub configuration:**

| Type | Name | Description |
|------|------|-------------|
| Secret | `AWS_ACCESS_KEY_ID` | IAM user access key |
| Secret | `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
| Variable | `AWS_S3_BUCKET` | S3 bucket name |
| Variable | `AWS_REGION` | AWS region (e.g., `eu-central-1`) |

The report URL is printed in the workflow **Summary** section after each run.

### Running Tests in CI

1. Go to **Actions** tab in GitHub repository
2. Select **Playwright Tests** workflow
3. Click **Run workflow**
4. Select environment from dropdown
5. Click **Run workflow** button

### Adding New Environments

1. Create environment config file: `envs-config/{env-name}.env`
2. Add environment to workflow options:

```yaml
inputs:
  environment:
    type: choice
    options:
      - dev
      - staging  # new environment
```

---

## Checklist for New Tests

- [ ] Test case ID in title (e.g., `TC-AUTH-001:`)
- [ ] Priority tag added
- [ ] Negative tests tagged with `TestType.NEGATIVE`
- [ ] Using correct fixture (`guestFixture` or `authorizedFixture`)
- [ ] Test data imported from `test-data/`
- [ ] Assertions use page object methods
- [ ] No hardcoded selectors in tests
- [ ] Test is independent (no dependencies on other tests)
