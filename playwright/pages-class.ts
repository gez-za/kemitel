import { Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly $locator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.$locator = this.page.getByTestId("login-form");
  }

  public async goto() {
    await this.page.goto("/");
  }

  public async login(username: string, password: string) {
    await this.$locator.getByTestId("username").fill(username);
    await this.$locator.getByTestId("password").fill(password);
    await this.$locator.getByTestId("submit-button").click();
  }
}