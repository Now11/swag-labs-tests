import { expect } from '@playwright/test';
import { BasePage } from '../Base.page.js';
import { ButtonElement } from '@src/elements/Button.element.js';
import { CartItemComponent } from './components/CartItem.component.js';
import { CheckoutStepOnePage } from '../checkout-step-one/index.js';
import { HeaderComponent } from '@src/shared-components/Header.component.js';
import { step } from '@src/utils/decorators.js';

export class CartPage extends BasePage {
  protected readonly url = '/cart.html';

  readonly header = new HeaderComponent(this.page);
  private readonly title = this.page.locator('[data-test="title"]');
  private readonly cartList = this.page.locator('[data-test="cart-list"] [data-test="inventory-item"]');
  private readonly continueShoppingButton = new ButtonElement(this.page.locator('[data-test="continue-shopping"]'));
  private readonly checkoutButton = new ButtonElement(this.page.locator('[data-test="checkout"]'));

  @step('Verify cart page is opened')
  async shouldBeOpened(): Promise<void> {
    await expect(this.page).toHaveURL(/.*cart\.html/);
    await expect(this.title).toHaveText('Your Cart');
  }

  getItemByName(name: string): CartItemComponent {
    const itemLocator = this.cartList.filter({
      has: this.page.locator('[data-test="inventory-item-name"]', { hasText: name }),
    });
    return new CartItemComponent(itemLocator);
  }

  @step('Get all cart items')
  async getAllItems(): Promise<CartItemComponent[]> {
    const items = await this.cartList.count();

    const cartItems: CartItemComponent[] = [];

    for (let i = 0; i < items; i++) {
      cartItems.push(new CartItemComponent(this.cartList.nth(i)));
    }

    return cartItems;
  }

  @step('Continue shopping')
  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  @step('Proceed to checkout')
  async checkout(): Promise<CheckoutStepOnePage> {
    await this.checkoutButton.click();
    const checkoutPage = new CheckoutStepOnePage(this.page);
    await checkoutPage.shouldBeOpened();
    return checkoutPage;
  }

  @step('Verify cart has items count:', ([expected]) => expected)
  async shouldHaveItemsCount(expected: number): Promise<void> {
    await expect(this.cartList).toHaveCount(expected);
  }

  @step('Verify cart is empty')
  async shouldBeEmpty(): Promise<void> {
    await expect(this.cartList).toHaveCount(0);
  }
}
