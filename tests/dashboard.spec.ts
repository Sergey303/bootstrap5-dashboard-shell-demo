import { expect, test, type Locator, type Page } from "@playwright/test";

const routes = [
  "/dashboard",
  "/dashboard/overview",
  "/dashboard/profile",
  "/dashboard/profile/professional",
  "/dashboard/work-contexts",
  "/dashboard/settings",
] as const;
const widths = [320, 375, 768, 1024, 1280, 1440] as const;

async function selectNextOption(select: Locator): Promise<string> {
  const current = await select.inputValue();
  const options = await select.locator("option").evaluateAll((elements) =>
    elements
      .filter((element) => element instanceof HTMLOptionElement && !element.disabled)
      .map((element) => (element as HTMLOptionElement).value)
      .filter(Boolean),
  );
  const next = options.find((value) => value !== current);
  expect(next, "The selector needs at least two available choices").toBeDefined();
  await select.selectOption(next!);
  return next!;
}

async function contextSelect(page: Page): Promise<Locator> {
  const selector = page.getByTestId("work-context-selector");
  await expect(selector).toBeVisible();
  return (await selector.evaluate((element) => element.tagName === "SELECT"))
    ? selector
    : selector.getByRole("combobox");
}

async function fillProfessionalProfile(form: Locator): Promise<void> {
  const textControls = form.getByRole("textbox");
  expect(await textControls.count(), "The profile must expose editable fields").toBeGreaterThan(0);
  for (const control of await textControls.all()) {
    if (!(await control.isEditable())) continue;
    await expect(control).toHaveAccessibleName(/\S/);
    const type = await control.getAttribute("type");
    await control.fill(
      type === "email"
        ? "ivan.petrov@example.com"
        : type === "url"
          ? "https://example.com"
          : type === "tel"
            ? "+79991234567"
            : "Иван Петров",
    );
  }
  for (const select of await form.getByRole("combobox").all()) {
    await expect(select).toHaveAccessibleName(/\S/);
    const option = await select
      .locator("option")
      .evaluateAll((elements) =>
        elements
          .find(
            (element) =>
              element instanceof HTMLOptionElement && !element.disabled && Boolean(element.value),
          )
          ?.getAttribute("value"),
      );
    expect(option, "A profile select must have an available value").toBeTruthy();
    await select.selectOption(option!);
  }
  for (const control of await form.getByRole("spinbutton").all()) {
    await expect(control).toHaveAccessibleName(/\S/);
    await control.fill((await control.getAttribute("min")) ?? "1");
  }
  for (const control of await form.getByRole("checkbox").all()) {
    if ((await control.getAttribute("required")) !== null) await control.check();
  }
}

for (const width of widths) {
  test.describe(`${width}px viewport`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const route of routes) {
      test(`renders ${route}`, async ({ page }) => {
        await page.goto(route);
        await expect(page.getByTestId("dashboard-shell")).toBeVisible();
        await expect(page.getByRole("main")).toBeVisible();
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(scrollWidth, "Page must not overflow horizontally").toBeLessThanOrEqual(width + 1);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        const breadcrumbs = page.getByTestId("dashboard-breadcrumbs");
        await expect(breadcrumbs).toBeVisible();
        await expect(breadcrumbs).toContainText(/\S/);
        await expect(breadcrumbs.locator('[aria-current="page"]')).toBeVisible();
        if (width >= 992) {
          const navigation = page.getByTestId("desktop-navigation");
          await expect(navigation).toBeVisible();
          for (const path of routes) {
            await expect(navigation.locator(`a[href="${path}"]`)).toBeVisible();
          }
        } else {
          await expect(page.getByTestId("desktop-navigation")).toBeHidden();
          await expect(page.getByTestId("mobile-toggle")).toBeVisible();
        }
      });
    }

    if (width < 992) {
      test("mobile navigation opens by keyboard and Escape restores focus", async ({ page }) => {
        await page.goto("/dashboard");
        const toggle = page.getByTestId("mobile-toggle");
        await expect(toggle).toHaveAccessibleName(/\S/);
        await toggle.focus();
        await toggle.press("Enter");
        const offcanvas = page.getByTestId("mobile-offcanvas");
        await expect(offcanvas).toBeVisible();
        await expect(toggle).toHaveAttribute("aria-expanded", "true");
        for (const route of routes) {
          await expect(offcanvas.locator(`a[href="${route}"]`)).toBeVisible();
        }
        await page.keyboard.press("Escape");
        await expect(offcanvas).toBeHidden();
        await expect(toggle).toHaveAttribute("aria-expanded", "false");
        await expect(toggle).toBeFocused();
      });
    }

    test("work context can be changed and retained during navigation", async ({ page }) => {
      await page.goto("/dashboard/work-contexts");
      const select = await contextSelect(page);
      await expect(select).toHaveAccessibleName(/\S/);
      const next = await selectNextOption(select);
      await expect(select).toHaveValue(next);
      const navigation = page.getByTestId(width >= 992 ? "desktop-navigation" : "mobile-offcanvas");
      if (width < 992) await page.getByTestId("mobile-toggle").click();
      await navigation.locator('a[href="/dashboard/overview"]').click();
      await expect(page).toHaveURL("/dashboard/overview");
      await expect(await contextSelect(page)).toHaveValue(next);
    });

    test("professional profile rejects invalid data and accepts valid data", async ({ page }) => {
      await page.goto("/dashboard/profile/professional");
      const form = page.getByTestId("professional-profile-form");
      await expect(form).toBeVisible();
      const submit = page.getByTestId("profile-submit");
      await expect(submit).toHaveAccessibleName(/\S/);
      for (const control of await form.getByRole("textbox").all()) {
        if (await control.isEditable()) await control.fill("");
      }
      await submit.click();
      await expect(
        form.locator('input:invalid, textarea:invalid, select:invalid, [aria-invalid="true"]'),
      ).not.toHaveCount(0);
      await fillProfessionalProfile(form);
      await submit.click();
      await expect(
        form.locator('input:invalid, textarea:invalid, select:invalid, [aria-invalid="true"]'),
      ).toHaveCount(0);
      const feedback = page.getByTestId("profile-feedback");
      await expect(feedback).toBeVisible();
      await expect(feedback).toContainText(/сохран|успеш|обнов|принят/i);
    });
  });
}
