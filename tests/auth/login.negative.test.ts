import { guestFixture } from '@fixtures/guest.fixture.js';
import { users } from 'test-data/users.js';
import { errorMessages } from 'test-data/error-messages.js';
import { Priority, TestType } from '@src/utils/constants/priority.constants.js';

const { standardUser, lockedUser } = users;

guestFixture.describe('Login validation errors', () => {
  guestFixture.beforeEach(async ({ app: { loginPage } }) => {
    await loginPage.open();
  });

  guestFixture(
    'TC-AUTH-002: Should show error for locked out user',
    { tag: [Priority.HIGH, TestType.NEGATIVE] },
    async ({ app: { loginPage } }) => {
      await loginPage.login(lockedUser);
      await loginPage.errorMessage.shouldHaveText(errorMessages.LOCKEDOUT_USER);
    },
  );

  guestFixture(
    'TC-AUTH-003: Should show error when credentials are empty',
    { tag: [Priority.HIGH, TestType.NEGATIVE] },
    async ({ app: { loginPage } }) => {
      await loginPage.login();
      await loginPage.errorMessage.shouldHaveText(errorMessages.USERNAME_REQUIRED);
    },
  );

  guestFixture(
    'TC-AUTH-004: Should show error when password is empty',
    { tag: [Priority.HIGH, TestType.NEGATIVE] },
    async ({ app: { loginPage } }) => {
      await loginPage.login({ username: standardUser.username });
      await loginPage.errorMessage.shouldHaveText(errorMessages.PASSWORD_REQUIRED);
    },
  );

  guestFixture(
    'TC-AUTH-005: Should show error for invalid credentials',
    { tag: [Priority.HIGH, TestType.NEGATIVE] },
    async ({ app: { loginPage } }) => {
      await loginPage.login({ username: 'invalid_user', password: 'wrong_password' });
      await loginPage.errorMessage.shouldHaveText(errorMessages.INVALID_CREDENTIALS);
    },
  );
});

guestFixture.describe('Error message behavior', () => {
  guestFixture(
    'TC-AUTH-006: Should close error message when clicking X button',
    { tag: [Priority.MEDIUM, TestType.NEGATIVE] },
    async ({ app: { loginPage } }) => {
      await loginPage.open();
      await loginPage.login();

      await loginPage.loginForm.shouldHaveValidationErrors();

      await loginPage.errorMessage.shouldBeVisible();
      await loginPage.errorMessage.close();
      await loginPage.errorMessage.shouldNotBeVisible();
    },
  );
});
