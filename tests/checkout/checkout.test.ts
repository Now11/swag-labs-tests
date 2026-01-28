import { authorizedFixture, expect } from '@fixtures/authorized.fixture.js';
import { products } from 'test-data/products.js';
import { Priority } from '@src/utils/constants/priority.constants.js';
import { CheckoutStepTwoPage } from '@src/pages/checkout-step-two/index.js';
import { CheckoutCompletePage } from '@src/pages/checkout-complete/index.js';

const { backpack } = products;

const checkoutInfo = {
  firstName: 'John',
  lastName: 'Doe',
  postalCode: '12345',
};

authorizedFixture.describe('Checkout', () => {
  authorizedFixture.beforeEach(async ({ app: { inventoryPage } }) => {
    await inventoryPage.open();
    const product = inventoryPage.productsList.getProductByName(backpack.name);
    await product.addToCart();
  });

  authorizedFixture(
    'TC-CHK-001: Should complete full checkout flow',
    { tag: [Priority.CRITICAL] },
    async ({ app: { inventoryPage }, page }) => {
      const cartPage = await inventoryPage.header.openCart();
      const checkoutStepOne = await cartPage.checkout();

      await checkoutStepOne.fillInfo(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);
      await checkoutStepOne.clickContinue();

      const checkoutStepTwo = new CheckoutStepTwoPage(page);
      await checkoutStepTwo.shouldBeOpened();
      await checkoutStepTwo.shouldHaveItemsCount(1);

      await checkoutStepTwo.finish();

      const checkoutComplete = new CheckoutCompletePage(page);
      await checkoutComplete.shouldBeOpened();
      await checkoutComplete.shouldHaveSuccessMessage();
    },
  );

  authorizedFixture('TC-CHK-005: Should cancel checkout on step one', { tag: [Priority.MEDIUM] }, async ({ app: { inventoryPage } }) => {
    const cartPage = await inventoryPage.header.openCart();
    const checkoutStepOne = await cartPage.checkout();

    await checkoutStepOne.cancel();

    await cartPage.shouldBeOpened();
  });

  authorizedFixture(
    'TC-CHK-006: Should cancel checkout on step two',
    { tag: [Priority.MEDIUM] },
    async ({ app: { inventoryPage }, page }) => {
      const cartPage = await inventoryPage.header.openCart();
      const checkoutStepOne = await cartPage.checkout();

      await checkoutStepOne.fillInfo(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);
      await checkoutStepOne.clickContinue();

      const checkoutStepTwo = new CheckoutStepTwoPage(page);
      await checkoutStepTwo.shouldBeOpened();

      await checkoutStepTwo.cancel();

      await inventoryPage.shouldBeOpened();
    },
  );

  authorizedFixture(
    'TC-CHK-007: Should verify price calculation',
    { tag: [Priority.CRITICAL] },
    async ({ app: { inventoryPage }, page }) => {
      const cartPage = await inventoryPage.header.openCart();
      const checkoutStepOne = await cartPage.checkout();

      await checkoutStepOne.fillInfo(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);
      await checkoutStepOne.clickContinue();

      const checkoutStepTwo = new CheckoutStepTwoPage(page);
      await checkoutStepTwo.shouldBeOpened();

      const subtotalText = await checkoutStepTwo.getSubtotal();
      const taxText = await checkoutStepTwo.getTax();
      const totalText = await checkoutStepTwo.getTotal();

      const subtotal = parseFloat(subtotalText.replace('Item total: $', ''));
      const tax = parseFloat(taxText.replace('Tax: $', ''));
      const total = parseFloat(totalText.replace('Total: $', ''));

      const expectedTax = Math.round(subtotal * 0.08 * 100) / 100;
      const expectedTotal = Math.round((subtotal + expectedTax) * 100) / 100;

      expect(tax).toBeCloseTo(expectedTax, 2);
      expect(total).toBeCloseTo(expectedTotal, 2);
    },
  );

  authorizedFixture(
    'TC-CHK-008: Should go back to home after order completion',
    { tag: [Priority.MEDIUM] },
    async ({ app: { inventoryPage }, page }) => {
      const cartPage = await inventoryPage.header.openCart();
      const checkoutStepOne = await cartPage.checkout();

      await checkoutStepOne.fillInfo(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);
      await checkoutStepOne.clickContinue();

      const checkoutStepTwo = new CheckoutStepTwoPage(page);
      await checkoutStepTwo.finish();

      const checkoutComplete = new CheckoutCompletePage(page);
      await checkoutComplete.shouldBeOpened();

      await checkoutComplete.backToProducts();

      await inventoryPage.shouldBeOpened();
      await inventoryPage.header.shouldHaveCartBadgeCount(0);
    },
  );
});
