import { expect, test } from "playwright/test";

test("Loads the home page", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveTitle(/.+/);
});
