import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Axe a11y", () => {
  test("Front page should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    await page.goto("/dare");

    await page.waitForLoadState("networkidle");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
  test("Form page should not have any automatically detectable accessibility issues", async ({
    page,
  }) => {
    await page.goto("/dare/form");

    await page.waitForLoadState("networkidle");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
