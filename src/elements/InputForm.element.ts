import { expect } from '@playwright/test';
import { step } from '@src/utils/decorators.js';
import { BaseElement } from './Base.element.js';
import { styles } from '@src/utils/constants/styles.js';

export class InputElement extends BaseElement {
  protected errorIcon = this.root.locator('[class*=error_icon]');
  protected input = this.root.locator('input');

  @step('Fill input:', ([value]) => value)
  async fill(value: string): Promise<void> {
    await this.input.fill(value);
  }

  @step('Validate input has error')
  async hasValidationError() {
    await expect(this.errorIcon, 'Error icon is visible').toBeVisible();
    const borderColor = await this.input.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles['borderBottomColor'];
    });
    expect(borderColor, `Bottom border color is equal to ${styles.RED_ERROR_BORDER}`).toEqual(styles.RED_ERROR_BORDER);
  }
}
