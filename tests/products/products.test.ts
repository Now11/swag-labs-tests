import { authorizedFixture } from '@fixtures/authorized.fixture.js';
import { products, PRODUCTS_COUNT } from 'test-data/products.js';
import { Priority } from '@src/utils/constants/priority.constants.js';

const { backpack } = products;

authorizedFixture.describe('Products Page', () => {
  authorizedFixture.beforeEach(async ({ app: { inventoryPage } }) => {
    await inventoryPage.open();
  });

  authorizedFixture('TC-PROD-001: Should display all products', { tag: [Priority.CRITICAL] }, async ({ app: { inventoryPage } }) => {
    await inventoryPage.productsList.shouldHaveCount(PRODUCTS_COUNT);
  });

  authorizedFixture(
    'TC-PROD-001: Each product should have required elements',
    { tag: [Priority.CRITICAL] },
    async ({ app: { inventoryPage } }) => {
      const product = inventoryPage.productsList.getProductByName(backpack.name);

      await product.shouldHaveTitle(backpack.name);
      await product.shouldHavePrice(backpack.price);
      await product.imageShouldBeDisplayed();
      await product.shouldHaveAddToCartButton();
    },
  );

  authorizedFixture('TC-PROD-006: Should open product details page', { tag: [Priority.HIGH] }, async ({ app: { inventoryPage } }) => {
    const product = inventoryPage.productsList.getProductByName(backpack.name);
    const productDetailPage = await product.openDetails();

    await productDetailPage.shouldHaveName(backpack.name);
    await productDetailPage.shouldHavePrice(backpack.price);
    await productDetailPage.shouldHaveImage();
    await productDetailPage.shouldHaveAddToCartButton();
  });

  authorizedFixture(
    'TC-PROD-007: Should navigate back from product details',
    { tag: [Priority.MEDIUM] },
    async ({ app: { inventoryPage } }) => {
      const product = inventoryPage.productsList.getProductByName(backpack.name);
      const productDetailPage = await product.openDetails();

      await productDetailPage.goBackToProducts();
      await inventoryPage.shouldBeOpened();
    },
  );
});

authorizedFixture.describe('Add to Cart', () => {
  authorizedFixture.beforeEach(async ({ app: { inventoryPage } }) => {
    await inventoryPage.open();
  });

  authorizedFixture(
    'TC-CART-001: Should add product to cart from products page',
    { tag: [Priority.CRITICAL] },
    async ({ app: { inventoryPage } }) => {
      const product = inventoryPage.productsList.getProductByName(backpack.name);

      await product.addToCart();
      await product.shouldHaveRemoveButton();
    },
  );

  authorizedFixture(
    'TC-CART-002: Should add product to cart from product details page',
    { tag: [Priority.HIGH] },
    async ({ app: { inventoryPage } }) => {
      const product = inventoryPage.productsList.getProductByName(backpack.name);
      const productDetailPage = await product.openDetails();

      await productDetailPage.addToCart();
      await productDetailPage.shouldHaveRemoveButton();
    },
  );

  authorizedFixture(
    'TC-CART-004: Should remove product from cart on products page',
    { tag: [Priority.HIGH] },
    async ({ app: { inventoryPage } }) => {
      const product = inventoryPage.productsList.getProductByName(backpack.name);

      await product.addToCart();
      await product.shouldHaveRemoveButton();

      await product.removeFromCart();
      await product.shouldHaveAddToCartButton();
    },
  );
});
