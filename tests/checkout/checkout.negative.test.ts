import { authorizedFixture } from '@fixtures/authorized.fixture.js';
import { products } from 'test-data/products.js';
import { errorMessages } from 'test-data/error-messages.js';
import { Priority, TestType } from '@src/utils/constants/priority.constants.js';

const { backpack } = products;

const checkoutInfo = {
  firstName: 'John',
  lastName: 'Doe',
  postalCode: '12345',
};

authorizedFixture.describe('Checkout validation errors', () => {
  authorizedFixture.beforeEach(async ({ app: { inventoryPage } }) => {
    await inventoryPage.open();
    const product = inventoryPage.productsList.getProductByName(backpack.name);
    await product.addToCart();
  });

  authorizedFixture(
    'TC-CHK-002: Should show error for empty first name',
    { tag: [Priority.HIGH, TestType.NEGATIVE] },
    async ({ app: { inventoryPage } }) => {
      const cartPage = await inventoryPage.header.openCart();
      const checkoutStepOne = await cartPage.checkout();

      await checkoutStepOne.fillLastName(checkoutInfo.lastName);
      await checkoutStepOne.fillPostalCode(checkoutInfo.postalCode);
      await checkoutStepOne.clickContinue();

      await checkoutStepOne.shouldHaveError(errorMessages.FIRST_NAME_REQUIRED);
    },
  );

  authorizedFixture(
    'TC-CHK-003: Should show error for empty last name',
    { tag: [Priority.HIGH, TestType.NEGATIVE] },
    async ({ app: { inventoryPage } }) => {
      const cartPage = await inventoryPage.header.openCart();
      const checkoutStepOne = await cartPage.checkout();

      await checkoutStepOne.fillFirstName(checkoutInfo.firstName);
      await checkoutStepOne.fillPostalCode(checkoutInfo.postalCode);
      await checkoutStepOne.clickContinue();

      await checkoutStepOne.shouldHaveError(errorMessages.LAST_NAME_REQUIRED);
    },
  );

  authorizedFixture(
    'TC-CHK-004: Should show error for empty postal code',
    { tag: [Priority.HIGH, TestType.NEGATIVE] },
    async ({ app: { inventoryPage } }) => {
      const cartPage = await inventoryPage.header.openCart();
      const checkoutStepOne = await cartPage.checkout();

      await checkoutStepOne.fillFirstName(checkoutInfo.firstName);
      await checkoutStepOne.fillLastName(checkoutInfo.lastName);
      await checkoutStepOne.clickContinue();

      await checkoutStepOne.shouldHaveError(errorMessages.POSTAL_CODE_REQUIRED);
    },
  );

  authorizedFixture(
    'TC-CHK-010: Should show error when all fields are empty',
    { tag: [Priority.HIGH, TestType.NEGATIVE] },
    async ({ app: { inventoryPage } }) => {
      const cartPage = await inventoryPage.header.openCart();
      const checkoutStepOne = await cartPage.checkout();

      await checkoutStepOne.clickContinue();

      await checkoutStepOne.shouldHaveValidationErrors();
      await checkoutStepOne.shouldHaveError(errorMessages.FIRST_NAME_REQUIRED);
    },
  );
});

authorizedFixture.describe('Checkout with empty cart', () => {
  authorizedFixture(
    'TC-CHK-009: Should show empty cart on checkout page',
    { tag: [Priority.MEDIUM, TestType.NEGATIVE] },
    async ({ app: { inventoryPage } }) => {
      await inventoryPage.open();
      const cartPage = await inventoryPage.header.openCart();
      await cartPage.shouldBeEmpty();
    },
  );
});
