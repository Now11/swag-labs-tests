import { BasePage } from '../Base.page.js';
import { LoginFormComponent } from './components/LoginForm.component.js';
import { ErrorMessageComponent } from './components/ErrorMessage.component.js';
import { step } from '@src/utils/decorators.js';

export class LoginPage extends BasePage {
  protected readonly url = '/';

  readonly loginForm = new LoginFormComponent(this.page);
  readonly errorMessage = new ErrorMessageComponent(this.page);

  @step('Login with user:', ([{ username, password } = {}]) => `${username} - ${password}`)
  async login({ username, password }: { username?: string; password?: string } = {}): Promise<void> {
    if (username) await this.loginForm.fillUsername(username);
    if (password) await this.loginForm.fillPassword(password);
    await this.loginForm.clickLogin();
  }
}
