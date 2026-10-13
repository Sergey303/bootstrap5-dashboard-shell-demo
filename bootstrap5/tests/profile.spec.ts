import { expect, test } from "@playwright/test";

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 375, height: 812 },
]) {
  test(`saved professional profile is shown on the profile page at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/dashboard/profile");

    await expect(page.getByRole("heading", { name: "Профессиональные сведения" })).toBeVisible();
    await page.getByRole("link", { name: "Редактировать профессиональный профиль" }).click();

    const form = page.getByTestId("professional-profile-form");
    await form.getByRole("textbox", { name: /Должность/ }).fill("Ведущий аналитик");
    await form.getByRole("textbox", { name: /Специализация/ }).fill("Проектирование интерфейсов");
    await form.getByRole("spinbutton", { name: /Опыт работы/ }).fill("12");
    await form.getByRole("textbox", { name: /Город/ }).fill("Новосибирск");
    await form.getByRole("combobox", { name: /Формат работы/ }).selectOption("remote");
    await form.getByRole("textbox", { name: /О себе/ }).fill("Развиваю доступные интерфейсы.");
    await form.getByTestId("profile-submit").click();
    await expect(page.getByTestId("profile-feedback")).toContainText("сохранены");

    await page
      .getByRole("navigation", { name: "Хлебные крошки" })
      .getByRole("link", { name: "Профиль" })
      .click();
    const details = page.getByRole("heading", { name: "Профессиональные сведения" }).locator("..");
    await expect(details).toContainText("Ведущий аналитик");
    await expect(details).toContainText("Проектирование интерфейсов");
    await expect(details).toContainText("12 лет");
    await expect(details).toContainText("Удалённый");
    await expect(details).toContainText("Развиваю доступные интерфейсы.");
    await expect(page.getByText("Новосибирск")).toBeVisible();

    await page.getByRole("link", { name: "Редактировать профессиональный профиль" }).click();
    await expect(form.getByRole("textbox", { name: /Должность/ })).toHaveValue("Ведущий аналитик");
    await expect(form.getByRole("spinbutton", { name: /Опыт работы/ })).toHaveValue("12");

    // No backend or browser storage: a full reload restores the published demo defaults.
    await page.reload();
    await expect(form.getByRole("textbox", { name: /Должность/ })).toHaveValue(
      "Руководитель проектов",
    );
  });

  test(`invalid work experience cannot be saved at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/dashboard/profile/professional");
    const form = page.getByTestId("professional-profile-form");
    const experience = form.getByRole("spinbutton", { name: /Опыт работы/ });
    const save = form.getByTestId("profile-submit");

    for (const invalid of ["123", "51", "-1", "2.5", ""]) {
      await experience.fill(invalid);
      await expect(experience).toHaveAttribute("aria-invalid", "true");
      await expect(form.getByText("Введите целое число от 0 до 50.")).toBeVisible();
    }

    await experience.fill("123");
    await save.click();
    await expect(page.getByTestId("profile-feedback")).toContainText("Проверьте отмеченные поля");
    await expect(experience).toBeFocused();
    await page
      .getByRole("navigation", { name: "Хлебные крошки" })
      .getByRole("link", { name: "Профиль" })
      .click();
    await expect(page.getByText("8 лет", { exact: true })).toBeVisible();
    await expect(page.getByText("123 лет", { exact: true })).toHaveCount(0);

    await page.getByRole("link", { name: "Редактировать профессиональный профиль" }).click();
    const validExperience = page.getByRole("spinbutton", { name: /Опыт работы/ });
    await validExperience.fill("12");
    await expect(validExperience).toHaveAttribute("aria-invalid", "false");
    await save.click();
    await expect(page.getByTestId("profile-feedback")).toContainText("сохранены");
    await page
      .getByRole("navigation", { name: "Хлебные крошки" })
      .getByRole("link", { name: "Профиль" })
      .click();
    await expect(page.getByText("12 лет", { exact: true })).toBeVisible();
  });
}
