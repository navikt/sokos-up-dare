import { test } from "@playwright/test";

test.describe("Beregning", () => {
  test("Enkel beregning tabelltrekk 8130", async ({ page }) => {
    await page.goto("/dare/form", { waitUntil: "load" });

    await page.waitForTimeout(10000);

    const html = await page.content();
    // eslint-disable-next-line no-console
    console.log(html);

    await page.waitForSelector("#select-rj", {
      state: "visible",
      timeout: 10000,
    });

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
