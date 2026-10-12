import { expect, test, type Locator } from "@playwright/test";

async function expectDecorativeIcon(control: Locator): Promise<void> {
  await expect(control).toBeVisible();
  await expect(control.locator('svg[aria-hidden="true"]')).toHaveCount(1);
}

test("action buttons expose text labels and decorative vector icons", async ({ page }) => {
  await page.goto("/dashboard");
  await expectDecorativeIcon(page.getByRole("link", { name: "Перейти к обзору" }));

  await page.goto("/dashboard/profile");
  await expectDecorativeIcon(
    page.getByRole("link", { name: "Редактировать профессиональный профиль" }),
  );

  await page.goto("/dashboard/profile/professional");
  await expectDecorativeIcon(page.getByRole("button", { name: "Сохранить изменения" }));
  await expectDecorativeIcon(page.getByRole("button", { name: "Сбросить к исходным" }));

  await page.goto("/dashboard/settings");
  await expectDecorativeIcon(page.getByRole("button", { name: "Вернуть исходный вид" }));

  await page.goto("/dashboard/work-contexts");
  await expectDecorativeIcon(page.getByRole("button", { name: /Выбрать: / }).first());
});
