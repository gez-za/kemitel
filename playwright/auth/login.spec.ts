import { test } from "../base";
import { expect } from "@playwright/test";

test.describe("login", () => {
  test("should be successful", async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login("cristiano_01", "cristiano01");
    await expect(
      page
        .locator("[data-testid='menu-item-dashboard']")
        .getByText("dashboard"),
    ).toBeVisible();
  });
  test.skip("should be successful even if the user type the directly the route to the login view", async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto();
    await page.goto("/login");
    await loginPage.login("cristiano_01", "cristiano01");
    await expect(
      page.locator("[data-testid='menu-item-dashboard']"),
    ).toBeVisible({ timeout: 30000 });
    await expect(
      page
        .locator("[data-testid='menu-item-dashboard']")
        .getByText("dashboard"),
    ).toBeVisible();
  });
  test.skip("should successfully and efficiently redirect the user to the page they were trying to access via a link (associations list).", async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto();
    await page.goto("/associations");
    await loginPage.login("cristiano_01", "cristiano01");
    await expect(page.getByTestId("empty_list_association")).toBeVisible();
    await expect(page.getByTestId("empty_list_title_msg")).toContainText(
      "You have not yet created or joined any association.",
    );
  });
});
