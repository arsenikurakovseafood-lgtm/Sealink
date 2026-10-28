import { test, expect } from "@playwright/test";
test("interactive product preview and honest disclosures", async ({ page }) => {
  await page.goto("/");
  const preview = page.getByLabel("Interactive SeaLink product preview");
  await preview.getByRole("button", { name: "Inbox", exact: true }).click();
  await expect(
    preview.getByRole("heading", { name: "Unified Inbox" }),
  ).toBeVisible();
  await expect(preview).toContainText("External channels are not connected");
  await preview
    .getByRole("button", { name: "Marketplace", exact: true })
    .click();
  await preview
    .getByRole("textbox", { name: "Search the marketplace preview" })
    .fill("Nordhaven");
  await expect(preview.locator(".h3-preview-row")).toHaveCount(1);
  await expect(preview).toContainText("Nordhaven Seafood");
  await preview
    .getByRole("textbox", { name: "Search the marketplace preview" })
    .fill("no-such-supplier");
  await expect(preview).toContainText("No matching companies");
  await preview.getByRole("button", { name: "Overview", exact: true }).click();
  await expect(preview).toContainText("Frozen Atlantic cod loins");
  await page
    .getByRole("group", { name: "Explore companies by country" })
    .getByRole("button", { name: "Germany", exact: true })
    .click();
  await expect(page.locator(".h3-network-company")).toHaveCount(2);
  await expect(page.locator(".h3-network-panel")).toContainText("Germany");
  await expect(page.locator(".h3-planned")).toContainText(
    "planned, not operational",
  );
  await expect(page.locator("#pricing")).toContainText("Billing is not active");
  await page
    .getByRole("button", { name: "About the preview", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("No real transactions");
  await page
    .getByRole("button", { name: "Continue exploring", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("every homepage destination and anchor resolves", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page.locator("h1").waitFor();
  const hrefs = await page
    .locator("a[href]")
    .evaluateAll((els) => [
      ...new Set(els.map((el) => el.getAttribute("href")!)),
    ]);
  const target = await context.newPage();
  for (const href of hrefs) {
    if (href.startsWith("#") || href.startsWith("/#")) {
      const id = href.split("#")[1];
      await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
      continue;
    }
    expect(href).toMatch(/^\//);
    const response = await target.goto(`http://127.0.0.1:3000${href}`);
    expect(response?.status(), href).toBe(200);
    await expect(target.locator("h1").first()).toBeVisible();
    await expect(
      target.getByText("Page not found", { exact: true }),
    ).toHaveCount(0);
  }
  await target.close();
});
test("readable hero and first-screen desktop product preview", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const body = page.locator(".h3-hero-copy>p");
  expect(
    await body.evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
  ).toBeGreaterThanOrEqual(16);
  const preview = await page.locator(".h3-product").boundingBox();
  expect(preview?.y).toBeLessThan(400);
  expect(preview!.y + preview!.height).toBeLessThan(1000);
  const heading = page.locator("h1");
  expect(await heading.evaluate((el) => getComputedStyle(el).fontWeight)).toBe(
    "800",
  );
});
