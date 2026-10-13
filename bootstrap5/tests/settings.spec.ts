import { expect, test } from "@playwright/test";

for (const width of [320, 375, 768, 1024, 1280, 1440]) {
  test(`settings preview and control panel stay at a constant height at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/dashboard/settings");

    const display = page.locator(".settings-display-panel");
    const preview = page.locator(".settings-preview-panel");
    const sample = page.locator(".settings-preview-sample");
    const compact = page.getByRole("switch", { name: "Компактные карточки" });
    const details = page.getByRole("switch", { name: "Показывать пояснения" });

    const initial = await Promise.all(
      [display, preview, sample].map(async (locator) => (await locator.boundingBox())?.height),
    );
    for (const value of initial) expect(value).toBeGreaterThan(0);

    for (const [compactValue, detailsValue] of [
      [true, true],
      [true, false],
      [false, false],
      [false, true],
    ]) {
      await compact.setChecked(compactValue);
      await details.setChecked(detailsValue);
      const current = await Promise.all(
        [display, preview, sample].map(async (locator) => (await locator.boundingBox())?.height),
      );
      for (let i = 0; i < initial.length; i++) {
        expect(Math.abs((current[i] ?? 0) - (initial[i] ?? 0))).toBeLessThanOrEqual(1);
      }
      await expect(page.getByRole("status").first()).toBeVisible();
    }

    for (const control of [compact, details]) {
      const cursor = await control.evaluate((element) => getComputedStyle(element).cursor);
      expect(cursor).toBe("pointer");
      const label = page.locator(`label[for="${await control.getAttribute("id")}"]`);
      expect(await label.evaluate((element) => getComputedStyle(element).cursor)).toBe("pointer");
    }
  });
}
