import { guestFixture } from '@fixtures/guest.fixture.js';
import { users } from 'test-data/users.js';
import { Priority } from '@src/utils/constants/priority.constants.js';

const { standardUser } = users;

guestFixture.describe('Authentication', () => {
  guestFixture.beforeEach(async ({ app: { loginPage } }) => {
    await loginPage.open();
  });

  guestFixture(
    'TC-AUTH-001: Should login successfully with standard user',
    { tag: [Priority.CRITICAL] },
    async ({ app: { loginPage, inventoryPage } }) => {
      await loginPage.login(standardUser);
      await inventoryPage.shouldBeOpened();
    },
  );
});
