import { authorizedFixture } from '@fixtures/authorized.fixture.js';
import { products } from 'test-data/products.js';
import { Priority } from '@src/utils/constants/priority.constants.js';

const { backpack, bikeLight, boltTShirt } = products;

authorizedFixture.describe('Cart', () => {
  authorizedFixture.beforeEach(async ({ app: { inventoryPage } }) => {
    await inventoryPage.open();
  });

  authorizedFixture(
    'TC-CART-003: Should add multiple products to cart',
    { tag: [Priority.CRITICAL] },
    async ({ app: { inventoryPage } }) => {
      const product1 = inventoryPage.productsList.getProductByName(backpack.name);
      const product2 = inventoryPage.productsList.getProductByName(bikeLight.name);
      const product3 = inventoryPage.productsList.getProductByName(boltTShirt.name);

      await product1.addToCart();
      await inventoryPage.header.shouldHaveCartBadgeCount(1);

      await product2.addToCart();
      await inventoryPage.header.shouldHaveCartBadgeCount(2);

      await product3.addToCart();
      await inventoryPage.header.shouldHaveCartBadgeCount(3);
    },
  );

  authorizedFixture('TC-CART-005: Should view cart contents', { tag: [Priority.CRITICAL] }, async ({ app: { inventoryPage } }) => {
    const product = inventoryPage.productsList.getProductByName(backpack.name);
    await product.addToCart();

    const cartPage = await inventoryPage.header.openCart();
    await cartPage.shouldHaveItemsCount(1);

    const cartItem = cartPage.getItemByName(backpack.name);
    await cartItem.shouldHaveName(backpack.name);
    await cartItem.shouldHavePrice(backpack.price);
    await cartItem.shouldHaveQuantity('1');
  });

  authorizedFixture('TC-CART-006: Should remove product from cart page', { tag: [Priority.HIGH] }, async ({ app: { inventoryPage } }) => {
    const product = inventoryPage.productsList.getProductByName(backpack.name);
    await product.addToCart();

    const cartPage = await inventoryPage.header.openCart();
    await cartPage.shouldHaveItemsCount(1);

    const cartItem = cartPage.getItemByName(backpack.name);
    await cartItem.remove();

    await cartPage.shouldBeEmpty();
  });

  authorizedFixture('TC-CART-007: Should continue shopping from cart', { tag: [Priority.MEDIUM] }, async ({ app: { inventoryPage } }) => {
    const cartPage = await inventoryPage.header.openCart();
    await cartPage.continueShopping();

    await inventoryPage.shouldBeOpened();
  });

  authorizedFixture(
    'TC-CART-008: Should persist cart after page refresh',
    { tag: [Priority.MEDIUM] },
    async ({ app: { inventoryPage }, page }) => {
      const product1 = inventoryPage.productsList.getProductByName(backpack.name);
      const product2 = inventoryPage.productsList.getProductByName(bikeLight.name);

      await product1.addToCart();
      await product2.addToCart();
      await inventoryPage.header.shouldHaveCartBadgeCount(2);

      await page.reload({ waitUntil: 'domcontentloaded' });

      await inventoryPage.header.shouldHaveCartBadgeCount(2);

      const cartPage = await inventoryPage.header.openCart();
      await cartPage.shouldHaveItemsCount(2);
    },
  );
});
