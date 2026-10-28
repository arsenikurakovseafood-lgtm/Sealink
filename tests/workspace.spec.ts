import { test, expect } from "@playwright/test";
test("daily workspace, persistent navigation, inbox and organization", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/app");
  await expect(
    page.getByRole("heading", { name: "Needs Your Attention" }),
  ).toBeVisible();
  await page.screenshot({
    path: "/tmp/sealink22-dashboard.png",
    fullPage: true,
  });
  await page.screenshot({ path: "/tmp/sealink22-sidebar-expanded.png" });
  const group = page.getByRole("button", { name: "Marketplace", exact: true });
  await group.focus();
  await group.press("Space");
  await expect(group).toHaveAttribute("aria-expanded", "false");
  await page.reload();
  await expect(group).toHaveAttribute("aria-expanded", "false");
  await group.click();
  await page
    .getByRole("button", { name: "Collapse sidebar", exact: true })
    .click();
  await expect(page.locator(".app")).toHaveClass(/compact-sidebar/);
  await page.reload();
  await expect(page.locator(".app")).toHaveClass(/compact-sidebar/);
  await expect
    .poll(() =>
      page
        .locator(".sidebar")
        .evaluate((el) => Math.round(el.getBoundingClientRect().width)),
    )
    .toBe(78);
  await page.screenshot({ path: "/tmp/sealink22-sidebar-collapsed.png" });
  await page
    .getByRole("button", { name: "Expand sidebar", exact: true })
    .click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Unified Inbox", exact: true })
    .click();
  await page.getByRole("button", { name: /^Quotations/ }).click();
  const first = page.locator(".inbox-row").first();
  const record = await first.getAttribute("data-record-id");
  await first.getByRole("button", { name: /Mark read:/ }).click();
  await page.getByLabel("Unread only").check();
  await expect(
    page.locator(`.inbox-row[data-record-id="${record}"]`),
  ).toHaveCount(0);
  await page.reload();
  await page.getByRole("button", { name: /^Quotations/ }).click();
  await expect(
    page.locator(`.inbox-row[data-record-id="${record}"]`).first(),
  ).toHaveClass(/is-read/);
  await page.screenshot({ path: "/tmp/sealink22-inbox.png", fullPage: true });
  await page
    .getByRole("textbox", { name: "Search inbox" })
    .fill("no-matching-record");
  await expect(
    page.getByRole("heading", { name: "You're up to date in this view" }),
  ).toBeVisible();
  await page.goto("/app/team");
  await page.getByLabel("Fictional member name").fill("Demo Operations");
  await page.getByLabel("Fictional email").fill("ops@example.test");
  await page.getByRole("button", { name: "Save local member" }).click();
  await page.reload();
  await expect(
    page.locator(".team-row").filter({ hasText: "Demo Operations" }),
  ).toHaveCount(1);
  await page.goto("/app/organization");
  await expect(
    page.getByRole("navigation", { name: "Organization sections" }),
  ).toBeVisible();
  await page.screenshot({
    path: "/tmp/sealink22-organization.png",
    fullPage: true,
  });
  await page.goto("/app/orders");
  await expect(page.locator("main")).toContainText("Prototype");
  await page
    .getByRole("textbox", { name: "Local planning notes" })
    .first()
    .fill("Fictional planning note");
  await page
    .getByRole("button", { name: "Save planning note" })
    .first()
    .click();
  await page.reload();
  await expect(
    page.getByRole("textbox", { name: "Local planning notes" }).first(),
  ).toHaveValue("Fictional planning note");
  expect(errors).toEqual([]);
});
test("mobile grouped navigation and new routes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/app");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator(".sidebar")
        .evaluate((el) => Math.round(el.getBoundingClientRect().left)),
    )
    .toBe(0);
  await page.screenshot({ path: "/tmp/sealink22-mobile-navigation.png" });
  await page.keyboard.press("Escape");
  await expect(page.locator(".sidebar")).not.toHaveClass(/sidebar-open/);
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Unified Inbox", exact: true })
    .click();
  for (const path of [
    "/app/inbox",
    "/app/team",
    "/app/business",
    "/app/communications",
    "/app/company-preferences",
    "/app/orders",
    "/app/shipments",
  ]) {
    await page.goto(path);
    await expect(page.locator("main h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
