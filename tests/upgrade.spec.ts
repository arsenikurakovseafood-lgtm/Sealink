import { test, expect } from "@playwright/test";
test("public pricing and professional onboarding", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "The European Seafood Industry. Connected.",
    }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Explore Professional", exact: true })
    .click();
  await expect(page.getByLabel("Provisional membership")).toHaveValue(
    "Professional",
  );
  await page.getByLabel("Account category").selectOption("Professional");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  for (const [label, value] of [
    ["Professional name", "Demo Specialist"],
    ["Country", "Estonia"],
    ["Professional specialization", "Quality control"],
    ["Experience", "5 years"],
    ["Employment interests", "Permanent"],
  ])
    await page.getByLabel(label, { exact: true }).fill(value);
  await page.getByRole("button", { name: "Enter demo workspace" }).click();
  await expect(page.getByLabel("Name", { exact: true })).toHaveValue(
    "Demo Specialist",
  );
  await expect(
    page
      .getByRole("navigation")
      .getByRole("link", { name: "RFQs", exact: false }),
  ).toHaveCount(0);
  await page.reload();
  await expect(page.getByLabel("Name", { exact: true })).toHaveValue(
    "Demo Specialist",
  );
});
test("logistics, vacancy publishing, applications and capacity", async ({
  page,
}) => {
  await page.goto("/app/logistics");
  await page
    .getByRole("button", { name: "Create transport inquiry" })
    .first()
    .click();
  for (const [label, value] of [
    ["Origin", "Riga"],
    ["Destination", "Rotterdam"],
    ["Cargo type", "Frozen cod"],
    ["Estimated weight (kg)", "2400"],
    ["Required temperature", "-18 C"],
    ["Pickup date", "2026-12-01"],
  ])
    await page.getByLabel(label, { exact: true }).fill(value);
  await page.getByRole("button", { name: "Save local demonstration" }).click();
  await page.getByRole("button", { name: "My activity", exact: true }).click();
  await expect(page.locator("main")).toContainText("Riga → Rotterdam");
  await page.reload();
  await page.getByRole("button", { name: "My activity", exact: true }).click();
  await expect(page.locator("main")).toContainText("2400 kg");
  await page.goto("/app/jobs");
  await page.getByRole("button", { name: "Publish a vacancy" }).click();
  await page
    .getByLabel("Position", { exact: true })
    .fill("Demo quality manager");
  await page
    .getByLabel("Role description")
    .fill("Fictional quality control position for this local preview.");
  await page.getByRole("button", { name: "Save local demonstration" }).click();
  const card = page
    .locator(".jobs-list article")
    .filter({
      has: page.getByRole("heading", { name: "Demo quality manager" }),
    });
  await card.getByRole("button", { name: "Apply in demo" }).click();
  await page
    .getByLabel("Experience and motivation (fictional only)")
    .fill("Fictional applicant with seafood quality experience.");
  await page.getByRole("button", { name: "Save local demonstration" }).click();
  await card.getByText("Review local applications (1)").click();
  await expect(card).toContainText("Fictional applicant");
  await card.getByRole("button", { name: "Close vacancy" }).click();
  await page.getByRole("button", { name: "My activity", exact: true }).click();
  await expect(card).toContainText("Closed");
  await page.goto("/app/publish-capacity");
  await page.getByLabel("Available capacity", { exact: true }).fill("12");
  await page.getByLabel("Available from", { exact: true }).fill("2026-11-01");
  await page.getByLabel("Available until", { exact: true }).fill("2026-12-01");
  await page.getByRole("button", { name: "Publish demo capacity" }).click();
  await page
    .getByRole("link", { name: "Filleting · 12 tonnes / week" })
    .click();
  await expect(page.locator("main h1")).toHaveText("Filleting capacity");
});
test("public and new routes fit mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/",
    "/join",
    "/login",
    "/app/logistics",
    "/app/jobs",
    "/app/profile",
    "/app/publish-capacity",
  ]) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto("/");
  await page.screenshot({ path: "/tmp/sealink2-mobile.png", fullPage: true });
});
