import { test, expect } from "@playwright/test";
test("polished hero preserves hierarchy and readable product details", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Trade seafood. Run your business. One platform.",
    }),
  ).toBeVisible();
  await expect(page.locator(".h3-scene-note")).not.toBeVisible();
  const opacity = await page
    .locator(".h3-industrial img")
    .evaluate((el) => Number(getComputedStyle(el).opacity));
  expect(opacity).toBeLessThanOrEqual(0.6);
  expect(
    await page
      .locator(".h3-preview-row strong")
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
  ).toBeGreaterThanOrEqual(12);
  await expect(
    page.getByText("Industrial concept illustration", { exact: true }),
  ).toBeVisible();
  const preview = await page.locator(".h3-product").boundingBox();
  expect(preview!.y + preview!.height).toBeLessThan(1000);
});
test("business data stays opaque, with stronger operational typography", async ({
  page,
}) => {
  for (const [path, selector] of [
    ["/app", ".daily-metrics span"],
    ["/app/discover", ".company-description"],
    ["/app/inbox", ".inbox-item-body p"],
    ["/app/organization", ".field>span"],
    ["/app/rfqs", "td .table-title"],
  ]) {
    await page.goto(path);
    const el = page.locator(selector).first();
    await expect(el).toBeVisible();
    expect(
      await el.evaluate((e) => parseFloat(getComputedStyle(e).fontSize)),
    ).toBeGreaterThanOrEqual(12);
    const panel = page.locator(".panel,.company-card,.daily-metrics").first();
    await expect(panel).toBeVisible();
    expect(
      await panel.evaluate((e) => getComputedStyle(e).backdropFilter),
    ).toBe("none");
    expect(
      await panel.evaluate((e) => getComputedStyle(e).backgroundColor),
    ).toBe("rgb(255, 255, 255)");
  }
  await page.getByRole("button", { name: "Activity notifications" }).click();
  await expect(page.locator(".notification-pop")).toBeVisible();
});

test("long mobile page names keep header controls within the viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/app/marketplace",
    "/app/profile",
    "/app/business",
    "/app/organization",
    "/app/rfqs",
  ]) {
    await page.goto(route);
    await expect(page.locator("main h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      route,
    ).toBe(true);
    const bell = await page
      .getByRole("button", { name: "Activity notifications" })
      .boundingBox();
    expect(bell!.x + bell!.width, route).toBeLessThanOrEqual(390);
    await expect(
      page.getByRole("button", { name: "Open navigation" }),
    ).toBeVisible();
  }
});
