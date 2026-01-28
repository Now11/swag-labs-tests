# Swag Labs Test Automation Framework

Playwright + TypeScript test automation framework for [Swag Labs](https://www.saucedemo.com) e-commerce application.

## Table of Contents

- [Quick Start](#quick-start)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Code Quality](#code-quality)

## Quick Start

### Prerequisites

- Node.js >= 22.11.0
- npm >= 11.7.0

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd swag-labs-tests
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

4. **Create environment file**
   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:
   ```bash
   export ENVIRONMENT=dev    # Target environment (dev)
   export HEADLESS=          # Empty = headed mode, any value = headless
   export CI=                # Set automatically in CI/CD pipelines
   ```

5. **Run tests**
   ```bash
   npm run test:local
   ```

### Environment Variables

| Variable | Description | Values | Default |
|----------|-------------|--------|---------|
| `ENVIRONMENT` | Target environment | `dev`, `staging`, `prod` (for the future) | `dev` |
| `HEADLESS` | Run browser in headless mode | any value = headless, empty = headed | headed |
| `CI` | CI/CD environment flag | `true`, `false` | - |

## Running Tests

> **Note:** Use `npm run test:local` which loads environment variables from `.env` file via `source .env`. This approach allows storing sensitive data (credentials, API keys) in local `.env` file.

```bash
# Run all tests
npm run test:local

# Run tests with specific tag
npm run test:local -- --grep @critical
npm run test:local -- --grep @negative
npm run test:local -- --grep "@critical|@high"

# Exclude tests by tag
npm run test:local -- --grep-invert @negative

# Run specific test file
npm run test:local -- tests/auth/login.test.ts

# Run tests in headed mode
npm run test:local -- --headed

# Run tests with UI mode
npm run test:local -- --ui

# Open HTML report
npm run report:open
```

## Project Structure

```
swag-labs-tests/
├── src/
│   ├── elements/                    # Base UI elements
│   │   ├── Base.element.ts
│   │   ├── Button.element.ts
│   │   └── InputForm.element.ts
│   │
│   ├── shared-components/           # Reusable components
│   │   ├── Base.component.ts
│   │   ├── Header.component.ts
│   │   └── BurgerMenu.component.ts
│   │
│   ├── pages/                       # Page Objects
│   │   ├── Base.page.ts
│   │   ├── login/
│   │   │   ├── index.ts             # LoginPage
│   │   │   └── components/
│   │   │       ├── LoginForm.component.ts
│   │   │       └── ErrorMessage.component.ts
│   │   ├── inventory/
│   │   │   ├── index.ts             # InventoryPage
│   │   │   └── components/
│   │   │       ├── ProductsList.component.ts
│   │   │       └── Product.component.ts
│   │   ├── product-detail/
│   │   │   └── index.ts             # ProductDetailPage
│   │   ├── cart/
│   │   │   ├── index.ts             # CartPage
│   │   │   └── components/
│   │   │       └── CartItem.component.ts
│   │   ├── checkout-step-one/
│   │   │   └── index.ts             # CheckoutStepOnePage
│   │   ├── checkout-step-two/
│   │   │   └── index.ts             # CheckoutStepTwoPage
│   │   └── checkout-complete/
│   │       └── index.ts             # CheckoutCompletePage
│   │
│   └── utils/
│       ├── decorators.ts            # @step decorator
│       └── constants/
│           └── priority.constants.ts # Priority & TestType enums
│
├── tests/                           # Test specs
│   ├── auth/
│   │   ├── login.test.ts
│   │   ├── login.negative.test.ts
│   │   └── logout.test.ts
│   ├── products/
│   │   ├── products.test.ts
│   │   └── sorting.test.ts
│   ├── cart/
│   │   └── cart.test.ts
│   ├── checkout/
│   │   └── checkout.test.ts
│   └── menu/
│       └── menu.test.ts
│
├── fixtures/                        # Playwright fixtures
│   ├── guest.fixture.ts             # Unauthenticated tests
│   ├── authorized.fixture.ts        # Authenticated tests
│   └── index.ts
│
├── hooks/                           # Setup hooks
│   └── auth.setup.ts                # Authentication setup
│
├── test-data/                       # Test data
│   ├── users.ts
│   ├── products.ts
│   ├── error-messages.ts
│   └── success-messages.ts
│
├── docs/                            # Documentation
│   ├── test-cases.md
│   └── best-practices.md
│
├── playwright.config.ts             # Playwright configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          Tests Layer                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │  Auth    │ │ Products │ │   Cart   │ │ Checkout │            │
│  │  Tests   │ │  Tests   │ │  Tests   │ │  Tests   │            │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘            │
└───────┼────────────┼────────────┼────────────┼──────────────────┘
        │            │            │            │
        ▼            ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Fixtures Layer                           │
│  ┌─────────────────────┐    ┌─────────────────────┐             │
│  │   guestFixture      │    │  authorizedFixture  │             │
│  │   (no auth)         │    │  (with auth state)  │             │
│  └─────────────────────┘    └─────────────────────┘             │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Page Objects Layer                         │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐        │
│  │ LoginPage │ │ Inventory │ │ CartPage  │ │ Checkout  │        │
│  │           │ │   Page    │ │           │ │   Pages   │        │
│  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘ └─────┬─────┘        │
│        │             │             │             │              │
│        ▼             ▼             ▼             ▼              │
│  ┌─────────────────────────────────────────────────────┐        │
│  │                    Components                        │       │
│  │  LoginForm │ ProductsList │ CartItem │ Header │ etc │        │
│  └─────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Elements Layer                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ BaseElement │  │   Button    │  │  InputForm  │              │
│  │             │  │   Element   │  │   Element   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Playwright API                             │
└─────────────────────────────────────────────────────────────────┘
```

## Documentation

- [Test Cases](docs/test-cases.md) - Complete list of test cases with priorities
- [Best Practices](docs/best-practices.md) - Coding standards and guidelines

## Code Quality

```bash
# Run linter
npm run lint:check

# Fix lint issues
npm run lint:fix

# Check formatting
npm run format:check

# Fix formatting
npm run format:fix

# Run all formatters
npm run format:all
```

## License

ISC
