import { expect, test } from "@playwright/test";

const desktopPagesThatFit = [
  { path: "/dashboard", width: 1792, height: 854 },
  { path: "/dashboard/work-contexts", width: 1792, height: 854 },
  { path: "/dashboard", width: 1440, height: 900 },
  { path: "/dashboard/work-contexts", width: 1440, height: 900 },
  { path: "/dashboard/settings", width: 1440, height: 900 },
  { path: "/dashboard/work-contexts", width: 1280, height: 720 },
] as const;

for (const { path, width, height } of desktopPagesThatFit) {
  test(`does not add vertical scrolling when content fits: ${path} at ${width}x${height}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    await page.goto(path);

    const metrics = await page.evaluate(() => {
      const shell = document.querySelector(".dashboard-shell");
      const header = document.querySelector(".dashboard-shell-topbar");
      const layout = document.querySelector(".dashboard-shell-layout");

      if (!shell || !header || !layout) throw new Error("Dashboard shell is missing");

      return {
        viewportHeight: window.innerHeight,
        documentHeight: document.documentElement.scrollHeight,
        shellHeight: shell.getBoundingClientRect().height,
        headerHeight: header.getBoundingClientRect().height,
        layoutHeight: layout.getBoundingClientRect().height,
      };
    });

    expect(metrics.documentHeight).toBeLessThanOrEqual(metrics.viewportHeight + 2);
    expect(metrics.shellHeight).toBeCloseTo(metrics.viewportHeight, 0);
    expect(metrics.headerHeight + metrics.layoutHeight).toBeCloseTo(metrics.viewportHeight, 0);
    await expect(page.getByRole("main")).toBeVisible();
  });
}

for (const viewport of [
  { width: 1440, height: 800 },
  { width: 375, height: 812 },
]) {
  test(`preserves scrolling for a genuinely long form at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/dashboard/profile/professional");
    const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    expect(scrollHeight).toBeGreaterThan(viewport.height);
    const reset = page.getByRole("button", { name: "Сбросить к исходным" });
    await reset.scrollIntoViewIfNeeded();
    await expect(reset).toBeVisible();
    await reset.click();
    await expect(page.getByTestId("profile-feedback")).toContainText("Восстановлены");
  });
}
