import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BaseComponent } from './Base.component.js';
import { ButtonElement } from '../elements/Button.element.js';
import { step } from '@src/utils/decorators.js';

export class BurgerMenuComponent extends BaseComponent {
  private readonly closeButton = new ButtonElement(this.root.locator('#react-burger-cross-btn'));
  private readonly inventoryLink = this.root.locator('[data-test="inventory-sidebar-link"]');
  private readonly aboutLink = this.root.locator('[data-test="about-sidebar-link"]');
  private readonly logoutLink = this.root.locator('[data-test="logout-sidebar-link"]');
  private readonly resetLink = this.root.locator('[data-test="reset-sidebar-link"]');

  constructor(page: Page) {
    super(page, page.locator('.bm-menu-wrap'));
  }

  @step('Close menu')
  async close(): Promise<void> {
    await this.closeButton.click();
  }

  @step('Click logout')
  async logout(): Promise<void> {
    await this.logoutLink.click();
  }

  @step('Click all items')
  async goToAllItems(): Promise<void> {
    await this.inventoryLink.click();
  }

  @step('Click about')
  async goToAbout(): Promise<void> {
    await this.aboutLink.click();
  }

  @step('Click reset app state')
  async resetAppState(): Promise<void> {
    await this.resetLink.click();
  }

  @step('Verify menu is visible')
  async shouldBeVisible(): Promise<void> {
    await expect(this.root).toBeVisible();
  }

  @step('Verify menu is not visible')
  async shouldNotBeVisible(): Promise<void> {
    await expect(this.root).not.toBeVisible();
  }
}
