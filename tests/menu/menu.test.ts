import { authorizedFixture, expect } from '@fixtures/authorized.fixture.js';
import { products } from 'test-data/products.js';
import { Priority } from '@src/utils/constants/priority.constants.js';

const { backpack } = products;

authorizedFixture.describe('Burger Menu', () => {
  authorizedFixture.beforeEach(async ({ app: { inventoryPage } }) => {
    await inventoryPage.open();
  });

  authorizedFixture('TC-MENU-001: Should open burger menu', { tag: [Priority.HIGH] }, async ({ app: { inventoryPage } }) => {
    const menu = await inventoryPage.header.openMenu();

    await menu.shouldBeVisible();
  });

  authorizedFixture(
    'TC-MENU-002: Should close burger menu with X button',
    { tag: [Priority.MEDIUM] },
    async ({ app: { inventoryPage } }) => {
      const menu = await inventoryPage.header.openMenu();
      await menu.shouldBeVisible();

      await menu.close();
      await menu.shouldNotBeVisible();
    },
  );

  authorizedFixture(
    'TC-MENU-003: Should navigate to All Items from cart page',
    { tag: [Priority.HIGH] },
    async ({ app: { inventoryPage } }) => {
      const cartPage = await inventoryPage.header.openCart();
      await cartPage.shouldBeOpened();

      const menu = await cartPage.header.openMenu();
      await menu.goToAllItems();

      await inventoryPage.shouldBeOpened();
    },
  );

  authorizedFixture('TC-MENU-004: Should navigate to About page', { tag: [Priority.LOW] }, async ({ app: { inventoryPage }, page }) => {
    const menu = await inventoryPage.header.openMenu();
    await menu.goToAbout();
    await expect(page).toHaveURL(/.*saucelabs\.com.*/);
  });

  authorizedFixture('TC-MENU-006: Should reset app state', { tag: [Priority.MEDIUM] }, async ({ app: { inventoryPage }, page }) => {
    const product = inventoryPage.productsList.getProductByName(backpack.name);
    await product.addToCart();
    await inventoryPage.header.shouldHaveCartBadgeCount(1);

    const menu = await inventoryPage.header.openMenu();
    await menu.resetAppState();
    await menu.close();

    await inventoryPage.header.shouldHaveCartBadgeCount(0);

    await page.reload();
    await product.shouldHaveAddToCartButton();
  });
});
