import { guestFixture as setup } from '@fixtures/guest.fixture.js';
import { users } from '../test-data/users.js';
import { STORAGE_STATE_PATH } from '@src/utils/constants/index.js';

setup('[SETUP] authenticate as standart user', async ({ app: { loginPage }, page }) => {
  await loginPage.open();
  await loginPage.login(users.standardUser);
  await page.context().storageState({ path: STORAGE_STATE_PATH });
});
