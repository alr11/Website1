import { expect, test } from "@playwright/test";

import {
  futureDate,
  resetBackend,
  signUpAndSetUp,
  statValue,
} from "./helpers";

test.beforeAll(async ({ request }) => {
  await resetBackend(request);
});

test.describe("dashboard", () => {
  test("shows the countdown, the venue and empty overview cards", async ({
    page,
  }) => {
    await signUpAndSetUp(page, { weddingDate: futureDate(9) });

    await expect(page.getByText(/days to go/).first()).toBeVisible();
    await expect(page.getByText("Ivy House Barn")).toBeVisible();
    await expect(statValue(page, "Guests attending")).toHaveText("0");
    await expect(statValue(page, "Budget spent")).toHaveText("$0");
    await expect(statValue(page, "Checklist")).toHaveText("0/54");
    await expect(statValue(page, "Vendors booked")).toHaveText("0");
  });

  test("pulls numbers from the other sections", async ({ page }) => {
    await signUpAndSetUp(page, { budget: "40000" });

    // A guest who is coming, with a plus one.
    await page.getByRole("link", { name: "Guests" }).click();
    await page.getByRole("button", { name: /Add (your first )?guest/ }).click();
    await page.getByLabel("First name").fill("Wren");
    await page.getByLabel("Last name").fill("Castellan");
    await page.getByLabel("Party size").fill("2");
    await page.getByLabel("RSVP").click();
    await page.getByRole("option", { name: "Attending" }).click();
    await page.getByRole("button", { name: "Add guest", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    // An expense.
    await page.getByRole("link", { name: "Budget" }).click();
    await page.getByRole("button", { name: "Expense", exact: true }).click();
    await page.getByLabel("Description").fill("Venue deposit");
    await page.getByLabel("Amount").fill("5000");
    await page.getByRole("button", { name: "Log expense" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    await page.getByRole("link", { name: "Dashboard" }).click();

    await expect(statValue(page, "Guests attending")).toHaveText("2");
    await expect(statValue(page, "Budget spent")).toHaveText("$5,000");
    await expect(page.getByText("$35,000 left of $40,000")).toBeVisible();
  });

  test("up-next lists open tasks and they can be ticked from here", async ({
    page,
  }) => {
    await signUpAndSetUp(page);

    const upNext = page.getByText("Up next").locator("xpath=ancestor::div[3]");
    await expect(
      upNext.getByText("Agree on an overall budget"),
    ).toBeVisible();

    await page
      .getByRole("checkbox", { name: 'Mark "Agree on an overall budget" complete' })
      .click();

    await expect(statValue(page, "Checklist")).toHaveText("1/54");
    await expect(
      page.getByText("Agree on an overall budget"),
    ).toBeHidden();
  });

  test("wedding details can be edited from the hero", async ({ page }) => {
    await signUpAndSetUp(page);

    await page.getByRole("button", { name: "Edit details" }).click();
    await page.getByLabel("Venue").fill("The Old Rectory");
    await page.getByLabel("Total budget").fill("55000");
    await page.getByRole("button", { name: "Save details" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    await expect(page.getByText("The Old Rectory")).toBeVisible();
    await expect(page.getByText("$55,000 left of $55,000")).toBeVisible();
  });
});
