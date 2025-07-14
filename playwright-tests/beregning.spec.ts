import { test } from "@playwright/test";

test.describe("Beregning", () => {
  test("Enkel beregning tabelltrekk 8130", async ({ page }) => {
    await page.goto("http://localhost:5173/dare/form");
    await page.goto("http://localhost:5173/dare/form");
    await page.goto("http://localhost:5173/dare/form"); // desperate workaround.

    await page.waitForSelector("#select-rj", { state: "visible" });
    const select = page.locator("#select-rj");
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
