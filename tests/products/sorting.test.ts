import { authorizedFixture, expect } from '@fixtures/authorized.fixture.js';
import { Priority } from '@src/utils/constants/priority.constants.js';

authorizedFixture.describe('Product Sorting', () => {
  authorizedFixture.beforeEach(async ({ app: { inventoryPage } }) => {
    await inventoryPage.open();
  });

  authorizedFixture('TC-PROD-002: Should sort products by name A to Z', { tag: [Priority.HIGH] }, async ({ app: { inventoryPage } }) => {
    await inventoryPage.sortBy('Name (A to Z)');

    const names = await inventoryPage.getProductNames();
    const sortedNames = [...names].sort((a, b) => a.localeCompare(b));

    expect(names, 'Verify products sorted by name A to Z').toEqual(sortedNames);
  });

  authorizedFixture('TC-PROD-003: Should sort products by name Z to A', { tag: [Priority.HIGH] }, async ({ app: { inventoryPage } }) => {
    await inventoryPage.sortBy('Name (Z to A)');

    const names = await inventoryPage.getProductNames();
    const sortedNames = [...names].sort((a, b) => b.localeCompare(a));

    expect(names, 'Verify products sorted by name Z to A').toEqual(sortedNames);
  });

  authorizedFixture(
    'TC-PROD-004: Should sort products by price low to high',
    { tag: [Priority.HIGH] },
    async ({ app: { inventoryPage } }) => {
      await inventoryPage.sortBy('Price (high to low)');

      const prices = await inventoryPage.getProductPrices();
      const sortedPrices = [...prices].sort((a, b) => a - b);

      expect(prices, 'Verify products sorted by price low to high').toEqual(sortedPrices);
    },
  );

  authorizedFixture(
    'TC-PROD-005: Should sort products by price high to low',
    { tag: [Priority.HIGH] },
    async ({ app: { inventoryPage } }) => {
      await inventoryPage.sortBy('Price (low to high)');

      const prices = await inventoryPage.getProductPrices();
      const sortedPrices = [...prices].sort((a, b) => b - a);

      expect(prices, 'Verify products sorted by price high to low').toEqual(sortedPrices);
    },
  );
});
