import { expect, test } from "@playwright/test";

test.describe("Beregning", () => {
  test("Enkel beregning tabelltrekk 8130", async ({ page }) => {
    await page.goto("http://localhost:5173/dare/form");
    const select = page.locator("#select-rj");
    await expect(select).toBeVisible();
    await expect(select).toBeEnabled(); // Optional but informative
    await select.selectOption("8130");

    await page.getByRole("spinbutton", { name: "Sats", exact: true }).click();
    await page
      .getByRole("spinbutton", { name: "Sats", exact: true })
      .fill("900");
    await page
      .getByRole("spinbutton", { name: "Sats", exact: true })
      .press("Tab");
    await page.getByRole("spinbutton", { name: "Vedtakssats" }).fill("1200");
    await page.getByRole("spinbutton", { name: "Vedtakssats" }).press("Tab");
    await page.getByRole("button", { name: "Send oppdrag" }).click();
  });
});
