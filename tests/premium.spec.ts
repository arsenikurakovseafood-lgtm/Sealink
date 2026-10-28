import { test, expect } from "@playwright/test";
test("local photography, typography and public navigation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const images = page.locator(
    ".public-hero img,.industry-editorial img,.ocean-statement img",
  );
  await expect(images).toHaveCount(4);
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate((el) => {
          const img = el as HTMLImageElement;
          return img.complete && img.naturalWidth > 0;
        }),
      )
      .toBe(true);
    await expect(image).toHaveAttribute("alt", /.+/);
  }
  expect(
    new Set(
      await images.evaluateAll((els) =>
        els.map((el) => el.getAttribute("src")),
      ),
    ).size,
  ).toBe(4);
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(() => document.fonts.check("700 18px Manrope")),
  ).toBe(true);
  expect(
    await page.evaluate(() =>
      document.fonts.check('italic 400 18px "Instrument Serif"'),
    ),
  ).toBe(true);
  await page.screenshot({
    path: "/tmp/sealink-premium-desktop.png",
    fullPage: true,
  });
  await page.getByRole("link", { name: "Photography & type credits" }).click();
  await expect(
    page.getByRole("heading", { name: "Photography & typography" }),
  ).toBeVisible();
  await expect(page.locator(".credits")).toContainText("Alicia Miller");
  expect(errors).toEqual([]);
});
test("public design at tablet/mobile and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [390, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(
      page.getByRole("heading", {
        name: "The European Seafood Industry. Connected.",
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const hero = page.locator(".hero-photograph img");
    expect(
      await hero.evaluate((el) => getComputedStyle(el).animationName),
    ).toBe("none");
    if (width === 390) {
      for (const img of await page
        .locator(".industry-editorial img,.ocean-statement img")
        .all()) {
        await img.scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            img.evaluate(
              (el) =>
                (el as HTMLImageElement).complete &&
                (el as HTMLImageElement).naturalWidth > 0,
            ),
          )
          .toBe(true);
      }
      await page.screenshot({
        path: "/tmp/sealink-premium-mobile.png",
        fullPage: true,
      });
    }
  }
});
