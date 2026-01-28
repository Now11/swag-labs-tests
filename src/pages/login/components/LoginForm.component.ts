import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BaseComponent } from '@src/shared-components/Base.component.js';
import { InputElement } from '@src/elements/InputForm.element.js';
import { ButtonElement } from '@src/elements/Button.element.js';
import { step } from '@src/utils/decorators.js';

export class LoginFormComponent extends BaseComponent {
  private readonly usernameInput = new InputElement(this.root.locator('.form_group', { has: this.page.locator('[data-test="username"]') }));
  private readonly passwordInput = new InputElement(this.root.locator('.form_group', { has: this.page.locator('[data-test="password"]') }));
  private readonly loginButton = new ButtonElement(this.root.locator('[data-test="login-button"]'));

  constructor(page: Page) {
    super(page, page.locator('[data-test="login-container"]'));
  }

  @step('Fill username:', ([value]) => value)
  async fillUsername(value: string): Promise<void> {
    await this.usernameInput.fill(value);
  }

  @step('Fill password:', ([value]) => value)
  async fillPassword(value: string): Promise<void> {
    await this.passwordInput.fill(value);
  }

  @step('Click login button')
  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  @step('Verify login form is visible')
  async shouldBeVisible(): Promise<void> {
    await expect(this.root).toBeVisible();
  }

  @step('Verify username and password fileds have validation styles')
  async shouldHaveValidationErrors() {
    await this.usernameInput.hasValidationError();
    await this.passwordInput.hasValidationError();
  }
}
