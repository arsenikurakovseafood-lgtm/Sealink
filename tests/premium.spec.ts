import { test, expect } from "@playwright/test";
test("homepage industrial asset, typography and public navigation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Trade seafood. Run your business. One platform.",
    }),
  ).toBeVisible();
  const image = page.locator(".h3-industrial img");
  await expect(image).toHaveCount(1);
  await image.evaluate((el) => (el as HTMLImageElement).decode());
  await expect(image).toHaveAttribute("alt", /illustration/);
  await expect(
    page.getByText("Industrial concept illustration", { exact: true }),
  ).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(() => document.fonts.check("800 18px Manrope")),
  ).toBe(true);
  await expect(
    page.locator(".public-hero,.hero-photograph,.ocean-statement"),
  ).toHaveCount(0);
  await page.screenshot({
    path: "/workspace/sealink-homepage-3/after/desktop.png",
    fullPage: true,
  });
  await page.getByRole("link", { name: "Photography & type credits" }).click();
  await expect(
    page.getByRole("heading", { name: "Photography & typography" }),
  ).toBeVisible();
  await expect(page.locator(".credits")).toContainText("AI-generated");
  expect(errors).toEqual([]);
});
test("homepage design at tablet/mobile and reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [390, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(
      page.getByRole("heading", {
        name: "Trade seafood. Run your business. One platform.",
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(
      page.getByLabel("Interactive SeaLink product preview"),
    ).toBeVisible();
    expect(
      await page
        .locator(".h3-preview-heading")
        .evaluate((el) => getComputedStyle(el).animationName),
    ).toBe("none");
    if (width <= 900) {
      await page
        .getByRole("button", { name: "Open public navigation" })
        .click();
      await expect(
        page.getByRole("navigation", { name: "Public navigation" }),
      ).toBeVisible();
      await page
        .getByRole("navigation", { name: "Public navigation" })
        .getByRole("link", { name: "Platform", exact: true })
        .click();
      await expect(
        page.getByRole("navigation", { name: "Public navigation" }),
      ).not.toBeVisible();
      await page
        .locator(".h3-industrial img")
        .evaluate((el) => (el as HTMLImageElement).decode());
      if (width === 390)
        await page.screenshot({
          path: "/workspace/sealink-homepage-3/after/mobile.png",
          fullPage: true,
        });
    }
  }
});
