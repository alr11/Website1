import { expect, test } from "@playwright/test";

import {
  completeSetup,
  futureDate,
  resetBackend,
  signUp,
  statValue,
} from "./helpers";

test.beforeAll(async ({ request }) => {
  await resetBackend(request);
});

test.describe("first-run setup", () => {
  test("seeds the checklist and the budget categories", async ({ page }) => {
    await signUp(page);
    await completeSetup(page, {
      partnerOne: "Rosa",
      partnerTwo: "Tomás",
      budget: "50000",
      venue: "The Old Rectory",
    });

    // Hero reflects what was entered.
    await expect(page.getByRole("heading", { name: /Rosa/ })).toContainText(
      "Tomás",
    );
    await expect(page.getByText("The Old Rectory")).toBeVisible();
    await expect(statValue(page, "Budget spent")).toHaveText("$0");

    // 54 seeded checklist tasks, none complete.
    await page.getByRole("link", { name: "Checklist" }).click();
    await expect(page.getByRole("heading", { name: "Checklist" })).toBeVisible();
    await expect(page.getByText("54 tasks still to do")).toBeVisible();
    await expect(page.getByText("0% complete")).toBeVisible();

    // All eight phases are present.
    for (const phase of [
      "12+ months out",
      "9 months out",
      "6 months out",
      "3 months out",
      "1 month out",
      "1 week out",
      "Day of",
      "After the wedding",
    ]) {
      await expect(page.getByText(phase, { exact: true })).toBeVisible();
    }

    // Ten budget categories, allocations derived from the total budget.
    await page.getByRole("link", { name: "Budget" }).click();
    await expect(statValue(page, "Total budget")).toHaveText("$50,000");
    await expect(page.getByText("Venue & Rentals")).toBeVisible();
    await expect(page.getByText("$15,000 left")).toBeVisible();
  });

  test("checklist due dates are derived from the wedding date", async ({
    page,
  }) => {
    await signUp(page);
    await completeSetup(page, { weddingDate: futureDate(12) });

    await page.getByRole("link", { name: "Checklist" }).click();

    // "Day of" tasks fall on the wedding date itself.
    const weddingDate = new Date(futureDate(12));
    const formatted = weddingDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    await expect(
      page.getByText("Get married").locator("xpath=following-sibling::p"),
    ).toContainText(formatted);
  });

  test("setup only appears once", async ({ page }) => {
    await signUp(page);
    await completeSetup(page);

    await page.reload();
    await expect(page.getByText(/set up your wedding/i)).toBeHidden();
    await expect(page.getByRole("heading", { name: /Amelia/ })).toBeVisible();
  });
});
