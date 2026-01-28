import { expect } from '@playwright/test';
import { BasePage } from '../Base.page.js';
import { ButtonElement, InputElement } from '@src/elements/index.js';
import { step } from '@src/utils/decorators.js';

export class CheckoutStepOnePage extends BasePage {
  protected readonly url = '/checkout-step-one.html';

  private readonly title = this.page.locator('[data-test="title"]');
  private readonly firstNameInput = new InputElement(
    this.page.locator('.form_group', { has: this.page.locator('[data-test="firstName"]') }),
  );
  private readonly lastNameInput = new InputElement(this.page.locator('.form_group', { has: this.page.locator('[data-test="lastName"]') }));
  private readonly postalCodeInput = new InputElement(
    this.page.locator('.form_group', { has: this.page.locator('[data-test="postalCode"]') }),
  );
  private readonly cancelButton = new ButtonElement(this.page.locator('[data-test="cancel"]'));
  private readonly continueButton = new ButtonElement(this.page.locator('[data-test="continue"]'));
  private readonly errorMessage = this.page.locator('[data-test="error"]');

  @step('Verify checkout step one page is opened')
  async shouldBeOpened(): Promise<void> {
    await expect(this.page).toHaveURL(/.*checkout-step-one\.html/);
    await expect(this.title).toHaveText('Checkout: Your Information');
  }

  @step('Fill first name:', ([value]) => value)
  async fillFirstName(value: string): Promise<void> {
    await this.firstNameInput.fill(value);
  }

  @step('Fill last name:', ([value]) => value)
  async fillLastName(value: string): Promise<void> {
    await this.lastNameInput.fill(value);
  }

  @step('Fill postal code:', ([value]) => value)
  async fillPostalCode(value: string): Promise<void> {
    await this.postalCodeInput.fill(value);
  }

  @step('Fill checkout info')
  async fillInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillPostalCode(postalCode);
  }

  @step('Click continue')
  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  @step('Click cancel')
  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  @step('Verify error message:', ([expected]) => expected)
  async shouldHaveError(expected: string): Promise<void> {
    await expect(this.errorMessage).toHaveText(expected);
  }

  @step('Verify firstName, lastName & postalCode fileds have validation styles')
  async shouldHaveValidationErrors() {
    await this.firstNameInput.hasValidationError();
    await this.lastNameInput.hasValidationError();
    await this.postalCodeInput.hasValidationError();
  }
}
