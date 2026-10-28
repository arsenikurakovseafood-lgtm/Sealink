import { test, expect } from "@playwright/test";
test("complete connected sourcing workflow, persistence and reset", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Welcome to SeaLink." }),
  ).toBeVisible();
  await page.screenshot({ path: "/tmp/sealink-dashboard.png", fullPage: true });
  await page.goto("/discover");
  await page
    .getByRole("combobox", { name: "Country", exact: true })
    .selectOption("Netherlands");
  await page
    .getByRole("combobox", { name: "Species", exact: true })
    .selectOption("Atlantic cod");
  await page
    .getByRole("combobox", { name: "Processing service", exact: true })
    .selectOption("Freezing");
  await page
    .getByRole("combobox", { name: "Certification", exact: true })
    .selectOption("MSC");
  await expect(page.locator(".company-card")).toHaveCount(2);
  await page
    .getByRole("link", { name: "Nordhaven Seafood", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Nordhaven Seafood", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Remove from shortlist", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Save to shortlist", exact: true })
    .click();
  await page.getByRole("button", { name: "Create RFQ", exact: true }).click();
  await page
    .getByLabel("RFQ title *", { exact: true })
    .fill("Demo cod procurement for November");
  await page
    .getByLabel("Delivery location *", { exact: true })
    .fill("Rotterdam demo cold store");
  await page.getByRole("button", { name: "Save & select suppliers" }).click();
  await expect(
    page.getByRole("heading", { name: "Demo cod procurement for November" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Edit requirements", exact: true })
    .click();
  await page.getByLabel("Quantity *", { exact: true }).fill("2400");
  await page.getByRole("button", { name: "Save & select suppliers" }).click();
  await expect(page.locator(".page-heading")).toContainText("2,400 kg");
  await page
    .getByRole("button", { name: "Select suppliers", exact: true })
    .click();
  await page
    .getByRole("checkbox", { name: "Select Westbank Ocean Foods", exact: true })
    .check();
  await page.getByRole("button", { name: "Simulate distribution (2)" }).click();
  await page.getByRole("button", { name: "Confirm simulation" }).click();
  await page
    .getByRole("button", { name: "Simulate quotation", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Fictional quotation received",
  );
  await page
    .getByRole("button", { name: "Simulate quotation", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Quotations", exact: false })
    .filter({ hasNotText: "Review" })
    .first()
    .click();
  await expect(page.locator("tbody tr")).toHaveCount(2);
  await page
    .getByRole("button", { name: "Compare offers", exact: true })
    .click();
  await page.locator("tbody input[type=checkbox]").nth(0).check();
  await page.locator("tbody input[type=checkbox]").nth(1).check();
  await page.getByRole("button", { name: "Compare selected (2)" }).click();
  await expect(page.getByRole("dialog")).toContainText("Lowest unit price");
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.locator("tbody .table-title").first().click();
  await page
    .getByRole("button", { name: "Simulate award", exact: true })
    .click();
  await page.getByRole("button", { name: "Confirm simulated award" }).click();
  await expect(page.locator(".page-heading")).toContainText("Accepted");
  await page.goto("/organization");
  await page
    .getByLabel("Company name", { exact: true })
    .fill("Demo Northwater Updated");
  await page.getByRole("button", { name: "Save demo profile" }).click();
  await page.reload();
  await expect(page.locator(".org-switch")).toContainText(
    "Demo Northwater Updated",
  );
  await page.goto("/capacity/cap-1");
  await page.getByRole("button", { name: "Simulate inquiry" }).click();
  await page
    .getByLabel("Production requirements")
    .fill("Fictional 20 tonne filleting inquiry for November.");
  await page.getByRole("button", { name: "Save simulated inquiry" }).click();
  await page.goto("/messages");
  await page.getByRole("button", { name: /Demo capacity inquiry/ }).click();
  await expect(page.locator(".thread")).toContainText("Fictional 20 tonne");
  await page.getByLabel("Write a demo message").fill("Local follow-up only.");
  await page.getByRole("button", { name: "Save demo message" }).click();
  await page.reload();
  await page.getByRole("button", { name: /Demo capacity inquiry/ }).click();
  await expect(page.locator(".thread")).toContainText("Local follow-up only.");
  await page.goto("/settings");
  await page.getByRole("button", { name: "Demo data", exact: true }).click();
  await page
    .getByRole("button", { name: "Reset demo data", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Reset demo data", exact: true })
    .click();
  await expect(page.locator(".org-switch")).toContainText("Northwater Seafood");
  await page.goto("/rfqs");
  await expect(page.locator("tbody tr")).toHaveCount(8);
  expect(errors).toEqual([]);
});
test("navigation and mobile layout", async ({ page }) => {
  for (const route of [
    "/",
    "/discover",
    "/companies",
    "/rfqs",
    "/offers",
    "/capacity",
    "/messages",
    "/organization",
    "/settings",
  ]) {
    await page.goto(route);
    await expect(page.locator("main h1")).toBeVisible();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Discover", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Discover your next partner" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: "/tmp/sealink-mobile.png", fullPage: true });
});
