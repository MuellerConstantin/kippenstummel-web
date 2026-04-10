import { expect, test } from "playwright/test";

test("Checks for cookie dialog and allow all cookies", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const cookieDialogHeading = page.getByRole("heading", {
    name: /we use cookies|wir verwenden cookies/i,
  });

  await expect(cookieDialogHeading).toBeVisible();

  const acceptButton = page.getByRole("button", {
    name: /accept all|alle akzeptieren/i,
  });

  await expect(acceptButton).toBeVisible();
  await expect(acceptButton).toBeEnabled();

  await acceptButton.click();

  await expect(cookieDialogHeading).not.toBeVisible();

  const privacyState = await page.evaluate(() => {
    const w = window as typeof window & {
      __getState__?: () => import("@/store").RootState;
    };

    return w.__getState__!().privacy;
  });

  expect(privacyState.cookieSettingsSelected).toBe(true);

  expect(privacyState.allowAnalyticsCookies).toBe(true);
  expect(privacyState.allowPersonalizationCookies).toBe(true);
  expect(privacyState.allowTechnicalCookies).toBe(true);
});

test("Checks for cookie dialog and decline all cookies", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const cookieDialogHeading = page.getByRole("heading", {
    name: /we use cookies|wir verwenden cookies/i,
  });

  await expect(cookieDialogHeading).toBeVisible();

  const declineButton = page.getByRole("button", {
    name: /decline|ablehnen/i,
  });

  await expect(declineButton).toBeVisible();
  await expect(declineButton).toBeEnabled();

  await declineButton.click();

  await expect(cookieDialogHeading).not.toBeVisible();

  const privacyState = await page.evaluate(() => {
    const w = window as typeof window & {
      __getState__?: () => import("@/store").RootState;
    };

    return w.__getState__!().privacy;
  });

  expect(privacyState.cookieSettingsSelected).toBe(true);

  expect(privacyState.allowAnalyticsCookies).toBe(false);
  expect(privacyState.allowPersonalizationCookies).toBe(false);
  expect(privacyState.allowTechnicalCookies).toBe(true);
});
