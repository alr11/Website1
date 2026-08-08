import { expect, test } from "@playwright/test";

import {
  dialog,
  futureDate,
  goTo,
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

  test("pulls its numbers from the other sections", async ({ page }) => {
    await signUpAndSetUp(page, { budget: "40000" });

    // A guest who is coming, with a plus one.
    await goTo(page, "Guests");
    await page.getByRole("button", { name: "Add guest", exact: true }).click();
    const guestForm = dialog(page);
    await guestForm.getByLabel("First name").fill("Wren");
    await guestForm.getByLabel("Last name").fill("Castellan");
    await guestForm.getByLabel("Party size").fill("2");
    await guestForm.getByLabel("RSVP").click();
    await page.getByRole("option", { name: "Attending", exact: true }).click();
    await guestForm.getByRole("button", { name: "Add guest", exact: true }).click();
    await expect(guestForm).toBeHidden();

    // An expense against the budget.
    await goTo(page, "Budget");
    await page.getByRole("button", { name: "Expense", exact: true }).click();
    const expenseForm = dialog(page);
    await expenseForm.getByLabel("Description").fill("Venue deposit");
    await expenseForm.getByLabel("Amount").fill("5000");
    await expenseForm.getByRole("button", { name: "Log expense" }).click();
    await expect(expenseForm).toBeHidden();

    await goTo(page, "Dashboard");

    await expect(statValue(page, "Guests attending")).toHaveText("2");
    await expect(statValue(page, "Budget spent")).toHaveText("$5,000");
    await expect(page.getByText("$35,000 left of $40,000")).toBeVisible();
  });

  test("up-next lists open tasks and they can be ticked from here", async ({
    page,
  }) => {
    await signUpAndSetUp(page);

    const firstTask = page.getByText("Agree on an overall budget");
    await expect(firstTask).toBeVisible();

    await page
      .getByRole("checkbox", {
        name: 'Mark "Agree on an overall budget" complete',
        exact: true,
      })
      .click();

    await expect(statValue(page, "Checklist")).toHaveText("1/54");
    // Completed tasks drop off the up-next list.
    await expect(firstTask).toBeHidden();
  });

  test("wedding details can be edited from the hero", async ({ page }) => {
    await signUpAndSetUp(page);

    await page.getByRole("button", { name: "Edit details" }).click();
    const form = dialog(page);
    await form.getByLabel("Venue", { exact: true }).fill("The Old Rectory");
    await form.getByLabel("Total budget").fill("55000");
    await form.getByRole("button", { name: "Save details" }).click();
    await expect(form).toBeHidden();

    await expect(page.getByText("The Old Rectory")).toBeVisible();
    await expect(page.getByText("$55,000 left of $55,000")).toBeVisible();
  });
});
