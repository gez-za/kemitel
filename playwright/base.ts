import { test as base } from "@playwright/test";
import { LoginPage } from "./pages-class";

type AdditionalFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<AdditionalFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from "@playwright/test";
