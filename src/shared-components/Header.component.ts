import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BaseComponent } from './Base.component.js';
import { ButtonElement } from '../elements/Button.element.js';
import { BurgerMenuComponent } from './BurgerMenu.component.js';
import { CartPage } from '../pages/cart/index.js';
import { step } from '@src/utils/decorators.js';

export class HeaderComponent extends BaseComponent {
  private readonly menuButton = new ButtonElement(this.root.locator('#react-burger-menu-btn'));
  private readonly cartButton = new ButtonElement(this.root.locator('[data-test="shopping-cart-link"]'));
  private readonly cartBadge = this.root.locator('[data-test="shopping-cart-badge"]');

  constructor(page: Page) {
    super(page, page.locator('[data-test="header-container"]'));
  }

  @step('Open menu')
  async openMenu(): Promise<BurgerMenuComponent> {
    await this.menuButton.click();
    const menu = new BurgerMenuComponent(this.page);
    await menu.shouldBeVisible();
    return menu;
  }

  @step('Open cart')
  async openCart(): Promise<CartPage> {
    await this.cartButton.click();
    const cartPage = new CartPage(this.page);
    await cartPage.shouldBeOpened();
    return cartPage;
  }

  @step('Get cart badge count')
  async getCartBadgeCount(): Promise<number> {
    if (await this.cartBadge.isVisible()) {
      const text = await this.cartBadge.innerText();
      return parseInt(text, 10);
    }
    return 0;
  }

  @step('Verify cart badge count:', ([expected]) => expected)
  async shouldHaveCartBadgeCount(expected: number): Promise<void> {
    if (expected === 0) {
      await expect(this.cartBadge).not.toBeVisible();
    } else {
      await expect(this.cartBadge).toHaveText(String(expected));
    }
  }
}
