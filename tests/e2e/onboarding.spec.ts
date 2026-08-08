import { expect, test } from "@playwright/test";

import {
  completeSetup,
  goTo,
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

    await expect(
      page.getByRole("heading", { level: 1, name: /Rosa/ }),
    ).toContainText("Tomás");
    await expect(page.getByText("The Old Rectory")).toBeVisible();
    await expect(statValue(page, "Budget spent")).toHaveText("$0");

    // 54 seeded checklist tasks, none complete.
    await goTo(page, "Checklist");
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
    await goTo(page, "Budget");
    await expect(statValue(page, "Total budget")).toHaveText("$50,000");
    await expect(page.getByText("Venue & Rentals")).toBeVisible();
    // Venue takes 30% of 50,000 and nothing is spent yet.
    await expect(page.getByText("$15,000 left")).toBeVisible();
  });

  test("setup only appears once", async ({ page }) => {
    await signUp(page);
    await completeSetup(page);

    await page.reload();
    await expect(page.getByText(/set up your wedding/i)).toBeHidden();
    await expect(
      page.getByRole("heading", { level: 1, name: /Amelia/ }),
    ).toBeVisible();
  });

  test("checklist due dates are counted back from the wedding date", async ({
    page,
  }) => {
    await signUp(page);
    await completeSetup(page);

    await goTo(page, "Checklist");

    // Every seeded task carries a derived due date.
    await expect(page.getByText("No date set")).toBeHidden();
    await expect(
      page.getByText(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d/).first(),
    ).toBeVisible();
  });
});
