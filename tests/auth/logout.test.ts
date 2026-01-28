import { authorizedFixture } from '@fixtures/authorized.fixture.js';
import { Priority } from '@src/utils/constants/priority.constants.js';

authorizedFixture.describe('Logout', () => {
  authorizedFixture(
    'TC-AUTH-007: Should logout successfully',
    { tag: [Priority.CRITICAL] },
    async ({ app: { inventoryPage, loginPage } }) => {
      await inventoryPage.open();

      const menu = await inventoryPage.header.openMenu();
      await menu.logout();

      await loginPage.loginForm.shouldBeVisible();
    },
  );
});
