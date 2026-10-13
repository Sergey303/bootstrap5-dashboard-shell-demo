import { expect, test } from "@playwright/test";

test("pointer activation animates without altering layout or button functionality", async ({
  page,
}) => {
  await page.goto("/dashboard/settings");
  const button = page.getByRole("button", { name: "Вернуть исходный вид" });
  const before = await button.boundingBox();

  await button.click({ position: { x: 12, y: 12 } });
  const wave = button.locator(".dashboard-button-ripple");
  await expect(wave).toHaveCount(1);
  await expect(wave).toHaveAttribute("aria-hidden", "true");
  await expect(button).toHaveAccessibleName("Вернуть исходный вид");
  const during = await button.boundingBox();
  expect(during?.width).toBeCloseTo(before?.width ?? 0, 1);
  expect(during?.height).toBeCloseTo(before?.height ?? 0, 1);
  await expect(wave).toHaveCount(0, { timeout: 2000 });
});

test("keyboard activation creates a centered wave without blocking action", async ({ page }) => {
  await page.goto("/dashboard/settings");
  const button = page.getByRole("button", { name: "Вернуть исходный вид" });
  await button.focus();
  await button.press("Enter");
  await expect(button.locator(".dashboard-button-ripple")).toHaveCount(1);
  await expect(button).toBeFocused();
  await expect(button.locator(".dashboard-button-ripple")).toHaveCount(0, { timeout: 2000 });
});

test("reduced motion never creates an animated ripple", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/dashboard/settings");
  const button = page.getByRole("button", { name: "Вернуть исходный вид" });
  await button.click();
  await expect(button.locator(".dashboard-button-ripple")).toHaveCount(0);
  await expect(button).toHaveAccessibleName("Вернуть исходный вид");
});
